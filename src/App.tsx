import type { Location } from 'epubjs/types/rendition';

import { Book, Contents, EpubCFI, Rendition } from 'epubjs';
import { useState, useEffect, useRef } from 'react';

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
import { renderBookOnElement } from './lib/Utils';
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
	const clearSelection = () => {
		renditionWindow?.document.getSelection()?.removeAllRanges();
		setSelection(null);
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
			// TODO: Render highlights from IndexedDB on the rendition

			// Runs when the user makes a selection within the rendition via
			// the 'selected' event.
			const handleSelection = (cfiRange: EpubCFI, contents: Contents) => {
				setSelection(cfiRange);
				if (!renditionWindow) {
					setRenditionWindow(contents.window);
				}
			};

			// Creates the actual rendition object
			const r = renderBookOnElement(book, viewer);

			r.display(location?.start.cfi);

			r.on('selected', (l: EpubCFI, c: Contents) => handleSelection(l, c));
			r.on('relocated', (l: Location) => {
				setLocation(l);
			});

			setRendition(r);
		}

		if (file && location) {
			serialize(file.name, file, highlights, location);
		}
	}, [file, book, rendition, highlights, location, renditionWindow, selection]);

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
					<div className="row-span-full">{/* <IndexComponent /> */}</div>
					<div className="col-span-4 col-start-2 row-span-full min-h-screen overflow-y-hidden">
						<div className="col-span-10  h-full w-full border border-green-400 bg-green-50 py-2">
							<div ref={viewer}></div>
						</div>
					</div>
					<div className="row-span-full">{/* <HighlightsComponent /> */}</div>
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
											onCancel={() => {
												clearSelection();
												setHighlightModalShowing(false);
											}}
											onSave={(title: string, annotation: string) => {
												clearSelection();
												const highlight = {
													title,
													annotation,
													cfiRange: selection!
												};
												rendition.annotations.add(
													'highlight',
													selection!.toString()
												);
												setHighlights([...highlights, highlight]);
												setHighlightModalShowing(false);
											}}
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
