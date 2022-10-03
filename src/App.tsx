import type { Location } from 'epubjs/types/rendition';
import type { BookContext } from './lib/Store';

import ePub, { Book, Contents, EpubCFI, Rendition } from 'epubjs';
import localforage from 'localforage';
import React, { useState, useEffect, useRef } from 'react';

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
import { Context } from './lib/Store';
import { renderBookOnElement } from './lib/Utils';

const App = () => {
	// The rendition is rendered to the element using this ref.
	const viewer = useRef<HTMLDivElement>(null);
	const context = useRef<BookContext>({
		selectionLocation: null,
		highlights: [],
		title: null,
		location: null,
		file: null,
		iframe: null,
		rendition: null
	});
	const [file, setFile] = useState<File | null>(null);
	const [book, setBook] = useState<Book | null>(null);

	/**
	 * Handles UploaderComponent's onUpload event.
	 * @param file The uploaded file.
	 */
	const handleFileUploaded = async (file: File) => {
		setFile(file);
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
				context.current.file = file;
				context.current.title = file.name;
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
				context.current.highlights = bookInfo.highlights;
				context.current.location = bookInfo.location;
				context.current.file = bookInfo.file;
				context.current.title = bookInfo.file!.name;
				setBook(book);
				console.log(book);
			}
		})();

		// Initialize the rendition when the book is ready
		// if there is not already a rendition.
		if (
			viewer.current &&
			book &&
			!context.current.rendition &&
			context.current.title
		) {
			const handleSelection = (cfiRange: EpubCFI, contents: Contents) => {
				context.current.selectionLocation = cfiRange;
				context.current.iframe = contents.window;
			};
			const r = renderBookOnElement(book, viewer);

			r.display(context.current.location?.start.cfi);

			r.on('selected', (l: EpubCFI, c: Contents) => handleSelection(l, c));
			r.on('relocated', (location: Location) =>
				serialize({ ...context.current, location })
			);

			context.current.rendition = r;
		}
	}, [file, book]);

	return (
		<Context.Provider value={context.current}>
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
						<ControlsComponent />
					</div>
				</div>
			)}
		</Context.Provider>
	);
};

export default App;
