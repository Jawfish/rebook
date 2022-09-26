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
	const renditionContext = useContext<BookContext>(RenditionContext);
	const [currentSelection, setCurrentSelection] = useState<string>('');

	useEffect(() => {
		async function initializeRendition() {
			const r = book.renderTo(viewerRef.current!, {
				width: '100%'
			});
			r.themes.default({
				body: { 'padding-bottom': '6rem !important' }
			});
			await r.display();

			r.on('relocated', (l: Location) => {
				console.log('relocated', l.start);
			});

			r.on('selected', (cfiRange: string, contents: string) => {
				if (!contents) {
					setCurrentSelection('');
				} else {
					// TODO: when text is selected,
					// show a popup below the selection
					// to allow the user to highlight it.
					setCurrentSelection(cfiRange);
				}
			});

			renditionContext.rendition = r;
		}
		initializeRendition();
	}, [book]);

	const highlightSelection = () => {
		// TODO: show highlight modal
		// modal should take a title which is displayed in the highlight sidebar
		// modal should show the selected text
		// modal should take a longer annotation to associate with the highlight
		renditionContext.rendition!.annotations.add('highlight', currentSelection);
	};

	return (
		<div className="col-span-10  h-full w-full border border-green-400 bg-green-50 py-2">
			{/* show HighlightModalComponent in the controls area when the user selects text */}

			<div ref={viewerRef}></div>
		</div>
	);
};

export default Reader;
