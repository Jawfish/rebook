import type { Location } from 'epubjs/types/rendition';
import type { BookContext } from './lib/Store';

import ePub, { Book, Rendition } from 'epubjs';
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
	const viewerRef = useRef<HTMLDivElement>(null);
	const [context, setContext] = useState<BookContext>({
		rendition: null,
		selectionLocation: null,
		highlights: [],
		title: null,
		location: null,
		file: null,
		book: null
	});

	/**
	 * Handles UploaderComponent's onUpload event.
	 * @param file The uploaded file.
	 */
	const handleFileUploaded = async (file: File) => {
		setContext({
			...context,
			file
		});
	};

	useEffect(() => {
		(async () => {
			if (context.book) return;

			const bookExistsInIndexedDB = await currentBookExists();

			// If neither of these conditions are true, then the
			// UploaderComponent will be rendered. The context's
			// defaults will be used for values that are not set
			// by one of the paths below.
			if (!bookExistsInIndexedDB && context.file) {
				// This path is taken if this is the first time
				// the app is being used and the user has just
				// uploaded a file from UploaderComponent
				const book = getBookFromEpub(context.file);
				await book.ready;
				setContext({
					...context,
					title: context.file.name,
					book,
					location: book.navigation.toc[0].href
				});
			} else if (bookExistsInIndexedDB) {
				// This path is taken if the user has already
				// uploaded a file and is returning to the app.
				const bookInfo = await getCurrentBookInfo();
				const book = getBookFromEpub(bookInfo.file!);
				// Need to wait for the book to be ready
				// so that the rendition can access the object's
				// properties.
				await book.ready;
				setContext({
					...context,
					highlights: bookInfo.highlights,
					location: bookInfo.location,
					file: bookInfo.file,
					book
				});
			}
		})();

		// Any time the context changes, we need to serialize the book info
		// and save it to IndexedDB.
		if (context.book) {
			serialize(context);
		}

		// Set up the rendition
		if (viewerRef.current && context.book && !context.rendition) {
			const rendition = renderBookOnElement(context.book, viewerRef);
			setContext({
				...context,
				rendition
			});
			rendition.display(
				// TEMP: replace context.book.navigation.toc[5].href
				// 		with index 0 - this is just for testing
				context.location || context.book.navigation.toc[5].href
			);
			// TODO: set up selected events:
			//		r.on('selected', (cfiRange, contents) => { ... })

			// TODO: set up relocated events:
			//		r.on('relocated', (l: Location) => { ... })
		}
	}, [context, viewerRef]);

	return (
		<Context.Provider value={context}>
			{!context.file && (
				<div className="grid h-screen place-items-center">
					<div className="w-96">
						<UploaderComponent onUpload={handleFileUploaded} />
					</div>
				</div>
			)}
			{context.file && (
				<div
					className="mx-auto grid max-h-screen grid-cols-6 grid-rows-6"
					style={{ maxWidth: '110rem' }}>
					<div className="row-span-full">{/* <IndexComponent /> */}</div>
					<div className="col-span-4 col-start-2 row-span-full min-h-screen overflow-y-hidden">
						<div className="col-span-10  h-full w-full border border-green-400 bg-green-50 py-2">
							<div ref={viewerRef}></div>
						</div>
					</div>
					<div className="row-span-full">{/* <HighlightsComponent /> */}</div>
					<div className="absolute bottom-0 w-1/2 max-w-3xl place-self-center">
						{/* <ControlsComponent
							modalShowing={showModal}
							setShowModal={show => setShowModal(show)}
						/> */}
					</div>
				</div>
			)}
		</Context.Provider>
	);
};

export default App;
