import type Book from 'epubjs/types/book';

import ePub from 'epubjs';
import localforage from 'localforage';

import { BookContext } from './Store';

export const keyInIndexedDB = async (name: string): Promise<boolean> =>
	(await localforage.keys()).includes(name);

/**
 * Check if 'currentBook' is a key in IndexedDB.
 * @returns True if 'currentBook' is a key in IndexedDB.
 */
export const currentBookExists = async (): Promise<boolean> =>
	keyInIndexedDB('currentBook');

/**
 * Gets the current book (if one exists) from IndexedDB.
 * Uses the book's name as the key and gets the associated value from IndexedDB.
 * @returns The current book if it exists, null otherwise.
 */
export const getCurrentBookInfo = async (): Promise<BookContext> => {
	const bookName = (await localforage.getItem('currentBook')) as string;
	const bookInfo = await localforage.getItem(bookName);
	return bookInfo as BookContext;
};

/**
 * Serializes the currently opened book to IndexedDB.
 */
export function serialize(bookInfo: BookContext): void {
	if (!bookInfo.title) return;
	// We don't need everything in the bookInfo object,
	// so only store the data that needs to be persisted.
	localforage.setItem(bookInfo.title, {
		file: bookInfo.file,
		highlights: bookInfo.highlights,
		location: bookInfo.location
	});
	localforage.setItem('currentBook', bookInfo.title);
}

/**
 * Returns an epubjs Book object from a given File object.
 * @param file The .epub file to open.
 * @returns A Book object created from the given file.
 */
export const getBookFromEpub = (file: File): Book =>
	// Despite being undocumented and untyped,
	// epubjs's Book constructor can take a File object.
	// The casting is necessary to avoid a type error.
	ePub(file as unknown as ArrayBuffer);

/**
 * Returns BookInfo from a given book name as the key in IndexedDB.
 * @param name The name of the book to get.
 * @returns The BookInfo for the book with the given name.
 */
const getBook = async (name: string): Promise<BookContext> =>
	localforage.getItem(name) as Promise<BookContext>;
