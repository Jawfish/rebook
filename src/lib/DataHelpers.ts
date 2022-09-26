import type BookInfo from '../types/BookInfo';
import type Book from 'epubjs/types/book';

import ePub from 'epubjs';
import localforage from 'localforage';

export const fileInIndexedDB = async (name: string): Promise<boolean> =>
	name in (await localforage.keys());

/**
 * Gets the current book (if one exists) from IndexedDB as a BookInfo object.
 * Uses the book's name as the key and gets the associated value from IndexedDB.
 * @returns BookInfo object of the current book if it exists, null otherwise.
 */
export const getCurrentBookInfo = async (): Promise<BookInfo | null> => {
	const bookName = (await localforage.getItem('currentBook')) as string;
	return await localforage.getItem(bookName);
};

/**
 * Serializes the currently opened book to IndexedDB.
 */
export function serialize(book: BookInfo): void {
	localforage.setItem(book.title, book);
	localforage.setItem('currentBook', book.title);
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
