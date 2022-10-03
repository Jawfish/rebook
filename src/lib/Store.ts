import type { Location } from 'epubjs/types/rendition';

import { Book, EpubCFI } from 'epubjs';
import Rendition from 'epubjs/types/rendition';
import { createContext } from 'react';

import Highlight from '../types/Highlight';

export type BookContext = {
	selectionLocation: EpubCFI | null;
	highlights: Highlight[];
	title: string | null;
	file: File | null;
	location: Location | null;
	book: Book | null;
	iframe: Window | null;
	rendition: Rendition | null;
};

export const Context = createContext<BookContext>({} as BookContext);
