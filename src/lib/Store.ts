import Rendition from 'epubjs/types/rendition';
import { createContext } from 'react';

export type RenditionContextType = {
	rendition: Rendition | null;
};

export const RenditionContext = createContext<RenditionContextType>(
	{} as RenditionContextType
);
