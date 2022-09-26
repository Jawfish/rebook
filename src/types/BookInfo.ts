import type Highlight from './Highlight';

export default interface BookInfo {
	title: string;
	file: File;
	highlights: Highlight[];
	location: string;
}
