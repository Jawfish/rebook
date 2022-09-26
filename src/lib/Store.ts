import type Rendition from 'epubjs/types/rendition';
import type BookInfo from '../types/BookInfo';

import { createContext } from 'react';

export type BookContext = {
	rendition: Rendition | null;
};

export const RenditionContext = createContext<BookContext>({
	rendition: null
});
