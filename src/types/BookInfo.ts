import type { Location } from 'epubjs';
import type Highlight from './Highlight';

export default interface BookInfo {
	file: File;
	highlights: Highlight[];
	location: Location;
}
