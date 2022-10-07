import React from 'react';

import Highlight from '../types/Highlight';

type Props = {
	highlights: Highlight[];
	onHighlightClicked: (highlight: Highlight) => void;
};

const HighlightSidebar = ({ highlights, onHighlightClicked }: Props) => {
	return (
		<div className="h-full border border-yellow-400 bg-yellow-50">
			{highlights.map((highlight, index) => {
				return (
					<div
						key={index}
						className="cursor-pointer p-1 transition-colors duration-100 hover:text-black"
						onClick={() => onHighlightClicked(highlight)}>
						{highlight.title}
						{highlight.annotation && (
							<div className="text-xs text-gray-500">
								{highlight.annotation}
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default HighlightSidebar;
