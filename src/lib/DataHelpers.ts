import type Book from 'epubjs/types/book';

import ePub, { Location } from 'epubjs';
import localforage from 'localforage';
import { useContext } from 'react';

import Highlight from '../types/Highlight';
import BookInfo from '../types/BookInfo';

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
export const getCurrentBookInfo = async (): Promise<BookInfo> => {
	const bookName = (await localforage.getItem('currentBook')) as string;
	const bookInfo = await localforage.getItem(bookName);
	return bookInfo as BookInfo;
};

/**
 * Serializes the currently opened book to IndexedDB.
 */
export function serialize(
	title: string,
	file: File,
	highlights: Highlight[],
	location: Location
): void {
	localforage.setItem(title, {
		file,
		highlights,
		location
	});
	localforage.setItem('currentBook', title);
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
const getBook = async (name: string): Promise<BookInfo> =>
	localforage.getItem(name) as Promise<BookInfo>;
