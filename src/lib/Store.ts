import type { Location } from 'epubjs/types/rendition';

import Rendition from 'epubjs/types/rendition';
import { createContext } from 'react';

export type BookContext = {
	rendition: Rendition | null;
	selection: string;
	selectionLocation: Location | null;
	handler?: (context: BookContext) => void;
};

export const RenditionContext = createContext<BookContext>({} as BookContext);
