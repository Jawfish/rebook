import { NavItem } from 'epubjs';

type Props = {
	chapters: NavItem[];
	active: string | undefined;
	onClick: (href: string) => void;
};

const TableOfContents = ({ chapters, active, onClick }: Props) => {
	return (
		<div className="h-full border border-red-400 bg-red-50 text-gray-500">
			{chapters.map((chapter, index) => {
				return (
					<div key={index}>
						<div
							className={`cursor-pointer p-1 transition-colors duration-100 hover:text-black
							${active && chapter.href.includes(active) ? 'font-medium text-black' : ''}`}
							onClick={() => onClick(chapter.href)}>
							{chapter.label}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default TableOfContents;
