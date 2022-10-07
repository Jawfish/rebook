import type Book from 'epubjs/types/book';

import { Rendition } from 'epubjs';
import { RefObject } from 'react';

import Highlight from '../types/Highlight';

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

/**
 * Downloads the highlights as markdown.
 */
export function downloadHighlights(highlights: Highlight[]): void {
	let formattedHighlights = '';
	highlights.forEach((highlight: Highlight) => {
		formattedHighlights += `**${highlight.title} (${highlight.color})**`;
		formattedHighlights += '\n';
		// TODO: Save the highlight content itself so it can be exported.
		formattedHighlights += `==${highlight.text}==`;
		formattedHighlights += '\n';
		if (highlight.annotation) {
			formattedHighlights += `${highlight.annotation}`;
			formattedHighlights += '\n';
		}
		formattedHighlights += '\n';
		formattedHighlights += '---';
		formattedHighlights += '\n';
		formattedHighlights += '\n';
	});

	// TODO: this only works on localhost
	// navigator.clipboard.writeText(formattedHighlights);

	downloadString('highlights.md', formattedHighlights);
}

/**
 *
 * @param frame The frame to get the text from.
 * @returns The selected text.
 */
export function extractTextFromSelection(frame: Window): string {
	const selection = frame.document.getSelection();
	if (selection) {
		return selection.toString();
	}
	return '';
}

function downloadString(filename: string, text: string): void {
	const element = document.createElement('a');
	element.setAttribute(
		'href',
		`data:text/plain;charset=utf-8,${encodeURIComponent(text)}`
	);
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}
