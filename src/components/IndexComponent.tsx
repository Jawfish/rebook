import { NavItem } from 'epubjs';

type Props = {
	chapters: NavItem[];
	active: string | undefined;
	onClick: (href: string) => void;
};

const TableOfContents = ({ chapters, active, onClick }: Props) => {
	return (
		<div className="h-full border-x border-gray-300 bg-gray-50 p-2 text-gray-500">
			{chapters.map((chapter, index) => {
				return (
					<div key={index}>
						<div
							className={`cursor-pointer rounded border border-transparent p-2 transition-colors duration-75 hover:border-blue-200 hover:bg-blue-50 hover:text-black
							${
								active && chapter.href.includes(active)
									? 'rounded border border-blue-300 bg-blue-100 text-black'
									: ''
							}`}
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
