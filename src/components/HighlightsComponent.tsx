import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

import Highlight from '../types/Highlight';

type Props = {
	highlights: Highlight[];
	onHighlightClicked: (highlight: Highlight) => void;
	onEditHighlightClicked: (highlight: Highlight) => void;
	onDeleteHighlightClicked: (highlight: Highlight) => void;
};

const HighlightSidebar = ({
	highlights,
	onHighlightClicked,
	onEditHighlightClicked,
	onDeleteHighlightClicked
}: Props) => {
	return (
		<div className="h-full border-x border-gray-300 bg-gray-50 p-2">
			{highlights.map((highlight, index) => {
				return (
					<div
						key={index}
						className="cursor-pointer rounded border border-transparent p-2 text-gray-500  transition-all duration-75 hover:border-yellow-300 hover:bg-yellow-50 hover:text-black"
						onClick={() => onHighlightClicked(highlight)}>
						<div className="flex flex-row justify-between">
							<div className="overflow-hidden text-ellipsis whitespace-nowrap py-1 text-lg">
								{highlight.title}
							</div>
							<div className="flex gap-2 self-end">
								<div
									className="p-1 text-lg text-gray-300 transition-all duration-75 hover:text-blue-500"
									onClick={e => {
										e.stopPropagation();
										onEditHighlightClicked(highlight);
									}}>
									<FontAwesomeIcon icon={faPencil} />
								</div>
								<div
									className="p-1 text-lg text-gray-300 transition-all duration-75 hover:text-red-500"
									onClick={e => {
										e.stopPropagation();
										onDeleteHighlightClicked(highlight);
									}}>
									<FontAwesomeIcon icon={faTrash} />
								</div>
							</div>
						</div>
						{highlight.annotation && (
							<div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm">
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
