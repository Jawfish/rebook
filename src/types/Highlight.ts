import { EpubCFI } from 'epubjs';

export default interface Highlight {
	title: string;
	annotation: string;
	cfiRange: EpubCFI;
	color: string;
	text: string;
}
