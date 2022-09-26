import type { Location } from 'epubjs/types/rendition';
import type { BookContext } from './lib/Store';

import ePub, { Book } from 'epubjs';
import localforage from 'localforage';
import React, { useState, useEffect } from 'react';

import HighlightsComponent from './components/HighlightsComponent';
import ReaderComponent from './components/ReaderComponent';
import IndexComponent from './components/IndexComponent';
import UploaderComponent from './components/UploaderComponent';
import {
	serialize,
	getCurrentBookInfo,
	getBookFromEpub
} from './lib/DataHelpers';
import BookInfo from './types/BookInfo';
import Highlight from './types/Highlight';
import ControlsComponent from './components/ControlsComponent';
import { RenditionContext } from './lib/Store';

const App = () => {
	const [book, setBook] = useState<Book | null>(null);
	const [highlights, setHighlights] = useState<Highlight[]>([]);
	const [location, setLocation] = useState<string>('');
	const [renditionContext, setrenditionContext] = useState<BookContext>({
		rendition: null
	});
	// TODO: add context so rendition can be accessed by ControlsComponent

	/**
	 * Handles the upload of a new .epub from UploaderComponent.
	 * @param file The uploaded file.
	 */
	const handleFileUploaded = async (file: File): Promise<void> => {
		const b = getBookFromEpub(file);
		await b.ready;

		// The data shared between IndexedDB and internal state.
		const data = {
			highlights: [],
			location: b.navigation.toc[0].href
		};

		// Save the uploaded book to IndexedDB.
		serialize({
			title: file.name,
			file,
			highlights: data.highlights,
			location: data.location
		});

		// Update the internal state.
		setBook(b);
		setHighlights(data.highlights);
		setLocation(data.location);
	};

	/**
	 * Load the book file and store it in internal state as a Book object.
	 */
	async function deserializeBook() {
		const currentBookInfo: BookInfo = (await getCurrentBookInfo()) as BookInfo;
		const b: Book = getBookFromEpub(currentBookInfo.file);
		await b.ready;
		setBook(b);
		setHighlights(currentBookInfo.highlights);
		setLocation(currentBookInfo.location);
	}

	// Check if this is the first visit to the app,
	// so that we know if the user needs to upload a book,
	// or if we can just load the last book they were reading.
	useEffect(() => {
		async function Load() {
			const bookInfo = await getCurrentBookInfo();
			if (bookInfo) {
				deserializeBook();
			}
		}
		Load();
	}, []);

	if (!book) {
		return (
			<div className="grid h-screen place-items-center">
				<div className="w-96">
					<UploaderComponent onUpload={handleFileUploaded} />
				</div>
			</div>
		);
	} else {
		return (
			<RenditionContext.Provider value={renditionContext}>
				<div
					className="mx-auto grid max-h-screen grid-cols-6 grid-rows-6"
					style={{ maxWidth: '110rem' }}>
					<div className="row-span-full">
						<IndexComponent />
					</div>
					<div className="col-span-4 col-start-2 row-span-full overflow-y-hidden">
						<ReaderComponent
							book={book}
							highlights={highlights}
							location={location}
						/>
					</div>
					<div className="row-span-full">
						<HighlightsComponent />
					</div>
					<div className="absolute bottom-0 w-1/2 max-w-3xl place-self-center">
						<ControlsComponent />
					</div>
				</div>
			</RenditionContext.Provider>
		);
	}
};

export default App;
