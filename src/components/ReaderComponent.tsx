import type Book from 'epubjs/types/book';
import type Location from 'epubjs/types/rendition';

import { FC, useRef, useEffect, useState, useContext } from 'react';
import Rendition from 'epubjs/types/rendition';
import { useFloating } from '@floating-ui/react-dom-interactions';

import Highlight from '../types/Highlight';
import { BookContext, RenditionContext } from '../lib/Store';

type ReaderProps = {
	book: Book;
	location: string;
	highlights: Highlight[];
};

const Reader: FC<ReaderProps> = ({
	book,
	location,
	highlights
}: ReaderProps): JSX.Element => {
	const viewerRef = useRef(null);
	const context = useContext<BookContext>(RenditionContext);

	useEffect(() => {
		async function initializeRendition() {
			const r = book.renderTo(viewerRef.current!, {
				width: '100%'
			});
			r.themes.default({
				body: { 'padding-bottom': '6rem !important' }
			});
			await r.display();
			// TODO: on r.on('relocated', (l: Location) => { ... })
			// TODO: when text is deselected, context.setContextSelection('');
			// TODO: on r.on('selected', (cfiRange, contents) => { ... })
			context.handler!({
				...context,
				rendition: r
			});
		}
		initializeRendition();
	}, []);

	return (
		<div className="col-span-10  h-full w-full border border-green-400 bg-green-50 py-2">
			{/* show HighlightModalComponent in the controls area when the user selects text */}

			<div ref={viewerRef}></div>
		</div>
	);
};

export default Reader;
