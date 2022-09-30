import type { Location } from 'epubjs/types/rendition';

import { Book } from 'epubjs';
import Rendition from 'epubjs/types/rendition';
import { createContext } from 'react';

import Highlight from '../types/Highlight';

export type BookContext = {
	rendition: Rendition | null;
	selectionLocation: Location | null;
	highlights: Highlight[];
	title: string | null;
	file: File | null;
	location: string | null;
	book: Book | null;
	handler?: (context: BookContext) => void;
};

export const Context = createContext<BookContext>({} as BookContext);
