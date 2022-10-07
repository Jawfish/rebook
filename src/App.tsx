import type { Location } from 'epubjs/types/rendition';

import { Book, Contents, EpubCFI, Rendition } from 'epubjs';
import { useState, useEffect, useRef, useCallback } from 'react';

import HighlightsComponent from './components/HighlightsComponent';
import IndexComponent from './components/IndexComponent';
import UploaderComponent from './components/UploaderComponent';
import {
	serialize,
	getCurrentBookInfo,
	getBookFromEpub,
	currentBookExists
} from './lib/DataHelpers';
import Highlight from './types/Highlight';
import ControlsComponent from './components/ControlsComponent';
import { RenditionContext } from './lib/Store';
import {
	downloadHighlights,
	extractTextFromSelection,
	renderBookOnElement
} from './lib/Utils';
import HighlightModalComponent from './components/HighlightModalComponent';

const App = () => {
	// The rendition is rendered to the element using this ref.
	const viewer = useRef<HTMLDivElement>(null);

	const [file, setFile] = useState<File | null>(null);
	const [book, setBook] = useState<Book | null>(null);
	const [rendition, setRendition] = useState<Rendition | null>(null);
	const [highlights, setHighlights] = useState<Highlight[]>([]);
	const [location, setLocation] = useState<Location | null>(null);
	const [highlightModalShowing, setHighlightModalShowing] = useState(false);
	const [renditionWindow, setRenditionWindow] = useState<Window | null>(null);
	const [selection, setSelection] = useState<EpubCFI | null>(null);
	const [highlightBeingEdited, setHighlightBeingEdited] =
		useState<Highlight | null>(null);
	/**
	 * Handles UploaderComponent's onUpload event.
	 * @param file The uploaded file.
	 */
	const handleFileUploaded = async (file: File) => {
		setFile(file);
	};

	/**
	 * Clear's the rendition's current selection.
	 */
	const clearSelection = useCallback(() => {
		renditionWindow?.document.getSelection()?.removeAllRanges();
		setSelection(null);
		// Close the modal so it won't be referencing a null selection
		// when the user tries to save their highlight.
		setHighlightModalShowing(false);
	}, [renditionWindow]);

	/**
	 * Save a given highlight to the internal state.
	 * @param highlight The highlight to save.
	 */
	const saveHighlight = (
		// TODO: consider making this more functional by taking a rendition
		// object; also consider taking a Highlight object directly instead
		// of constructing it here. Could be moved out of the App component
		// into Utils. Also consider separating editing and saving new highlights.
		highlight: Highlight
	) => {
		// If this is a new highlight, render it to the rendition.
		if (highlights.find(h => h.cfiRange === highlight.cfiRange) === undefined) {
			rendition!.annotations.add(
				'highlight',
				highlight.cfiRange.toString(),
				undefined,
				undefined,
				undefined,
				{
					fill: highlight.color,
					'mix-blend-mode': 'multiply'
				}
			);
		}

		// If this is an existing highlight, update its styles.
		else {
			// TODO: this can be cleaned up; the code is repetitive with the above.
			rendition!.annotations.remove(highlight.cfiRange.toString(), 'highlight');
			rendition!.annotations.add(
				'highlight',
				highlight.cfiRange.toString(),
				undefined,
				undefined,
				undefined,
				{
					fill: highlight.color,
					'mix-blend-mode': 'multiply'
				}
			);
		}

		// Get the index of the highlight with the same cfiRange as the one we're saving
		const index = highlights.findIndex(
			h => h.cfiRange.toString() === highlight.cfiRange.toString()
		);

		// If a highlight with the same cfiRange already exists, remove it.
		const newHighlights = highlights.filter(
			h => h.cfiRange.toString() !== highlight.cfiRange.toString()
		);

		// Place the new highlight at the index of the previous one if it existed.
		if (index !== -1) {
			newHighlights.splice(index, 0, highlight);
		} else {
			newHighlights.push(highlight);
		}

		// Save to internal state - will be serialized through App.tsx's useEffect.
		setHighlights(newHighlights);
		setHighlightBeingEdited(null);
		clearSelection();
	};

	useEffect(() => {
		(async () => {
			if (book) return;
			const bookExistsInIndexedDB = await currentBookExists();

			// If neither of these conditions are true, then the
			// UploaderComponent will be rendered. The context's
			// defaults will be used for values that are not set
			// by one of the paths below.
			if (!bookExistsInIndexedDB && file) {
				// This path is taken if this is the first time
				// the app is being used and the user has just
				// uploaded a file from UploaderComponent
				const book = getBookFromEpub(file);
				await book.ready;
				setBook(book);
			} else if (bookExistsInIndexedDB) {
				// This path is taken if the user has already
				// uploaded a file and is returning to the app.
				const bookInfo = await getCurrentBookInfo();
				const book = getBookFromEpub(bookInfo.file!);
				// Need to wait for the book to be ready
				// so that the rendition can access the object's
				// properties.
				await book.ready;
				setFile(bookInfo.file);
				setHighlights(bookInfo.highlights);
				setLocation(bookInfo.location);
				setBook(book);
			}
		})();

		// Initialize the rendition when the book is ready
		// if there is not already a rendition. Event listeners
		// should only be added here to prevent them from being
		// added multiple times when components are re-rendered.
		if (viewer.current && book && !rendition) {
			// Creates the actual rendition object
			const r = renderBookOnElement(book, viewer);

			// Render previously-saved highlights
			highlights.forEach(highlight => {
				r.annotations.add(
					'highlight',
					highlight.cfiRange.toString(),
					undefined,
					undefined,
					undefined,
					{
						fill: highlight.color,
						'mix-blend-mode': 'multiply'
					}
				);
			});

			r.display(location?.start.cfi);

			r.hooks.content.register((contents: Contents) => {
				// Enable rendition.next() and rendition.prev() on mousewheel
				contents.window.addEventListener('wheel', w => {
					if (w.deltaY > 0) {
						r.next();
					} else {
						r.prev();
					}
				});

				// Make sure the rest of the app knows when the user deselects
				// text in the rendition.
				contents.window.document.addEventListener('selectionchange', () => {
					if (!contents.window.document.getSelection()?.toString()) {
						clearSelection();
					}
				});

				setRenditionWindow(contents.window);
			});

			r.on('selected', (l: EpubCFI) => setSelection(l));
			r.on('relocated', (l: Location) => {
				setLocation(l);
			});

			setRendition(r);
		}

		if (file && location) {
			serialize(file.name, file, highlights, location);
		}
	}, [
		file,
		book,
		rendition,
		highlights,
		location,
		renditionWindow,
		selection,
		clearSelection
	]);

	return (
		<>
			{!book && (
				<div className="grid h-screen place-items-center">
					<div className="w-96">
						<UploaderComponent onUpload={handleFileUploaded} />
					</div>
				</div>
			)}
			{book && (
				<div
					className="mx-auto grid max-h-screen grid-cols-6 grid-rows-6"
					style={{ maxWidth: '110rem' }}>
					<div className="row-span-full">
						<IndexComponent
							chapters={book.navigation.toc}
							active={location?.start.href}
							onClick={href => {
								rendition?.display(href);
							}}
						/>
					</div>
					<div className="col-span-4 col-start-2 row-span-full min-h-screen overflow-y-hidden">
						<div className="col-span-10  h-full w-full  py-2">
							<div ref={viewer}></div>
						</div>
					</div>
					<div className="row-span-full">
						<HighlightsComponent
							highlights={highlights}
							onHighlightClicked={highlight => {
								rendition?.display(highlight.cfiRange.toString());
							}}
							onEditHighlightClicked={highlight => {
								setHighlightBeingEdited(highlight);
								setHighlightModalShowing(true);
							}}
							onDeleteHighlightClicked={highlight => {
								setHighlights(highlights.filter(h => h !== highlight));
								rendition?.annotations.remove(
									highlight.cfiRange.toString(),
									'highlight'
								);
							}}
							onDownloadClicked={() => {
								downloadHighlights(highlights);
							}}
							onClearClicked={() => {
								highlights.forEach(highlight => {
									rendition?.annotations.remove(
										highlight.cfiRange.toString(),
										'highlight'
									);
								});
								setHighlights([]);
							}}
						/>
					</div>
					<div className="absolute bottom-0 w-1/2 max-w-3xl place-self-center">
						{rendition && (
							<RenditionContext.Provider value={{ rendition }}>
								{!highlightModalShowing && (
									<ControlsComponent
										textIsSelected={selection !== null}
										onHighlightClicked={() => setHighlightModalShowing(true)}
										clearSelection={clearSelection}
									/>
								)}
								{highlightModalShowing && (
									<div className="col-span-4 place-self-center">
										<HighlightModalComponent
											onCancel={clearSelection}
											onSave={saveHighlight}
											title={highlightBeingEdited?.title}
											annotation={highlightBeingEdited?.annotation}
											range={
												highlightBeingEdited
													? highlightBeingEdited?.cfiRange
													: selection!
											}
											color={highlightBeingEdited?.color}
											text={extractTextFromSelection(renditionWindow!)}
										/>
									</div>
								)}
							</RenditionContext.Provider>
						)}
					</div>
				</div>
			)}
		</>
	);
};

export default App;
