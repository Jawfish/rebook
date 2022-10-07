import { NavItem } from 'epubjs';

type Props = {
	chapters: NavItem[];
	active: string | undefined;
	onClick: (href: string) => void;
};

const TableOfContents = ({ chapters, active, onClick }: Props) => {
	return (
		<div className="h-full overflow-scroll border-x border-gray-300 bg-gray-50 p-2 text-gray-400">
			{chapters.map((chapter, index) => {
				return (
					<div key={index}>
						<div
							className={`cursor-pointer rounded border border-transparent p-2 hover:text-black 
							${active && chapter.href.includes(active) ? 'rounded border text-black' : ''}`}
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
