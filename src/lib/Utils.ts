import type Book from 'epubjs/types/book';

import { Rendition } from 'epubjs';
import { RefObject } from 'react';

/**
 * Creates a rendition of a Book and attaches it to a div ref.
 * Need to call rendition.display(location) for the rendition to show.
 * @param element The element to attach the rendition to.
 * @param book The Book object from which to create the rendition.
 * @returns The Rendition object.
 */
export const renderBookOnElement = (
	book: Book,
	element: RefObject<HTMLDivElement>
): Rendition => {
	const rendition = book.renderTo(element.current!, {
		width: '100%'
	});
	// Add padding to the bottom for the footer
	rendition.themes.default({
		body: { 'padding-bottom': '6rem !important' }
	});
	return rendition;
};
