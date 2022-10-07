import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faPencil,
	faTrash,
	faDownload
} from '@fortawesome/free-solid-svg-icons';

import Highlight from '../types/Highlight';

type Props = {
	highlights: Highlight[];
	onHighlightClicked: (highlight: Highlight) => void;
	onEditHighlightClicked: (highlight: Highlight) => void;
	onDeleteHighlightClicked: (highlight: Highlight) => void;
	onDownloadClicked: () => void;
	onClearClicked: () => void;
};

const HighlightSidebar = ({
	highlights,
	onHighlightClicked,
	onEditHighlightClicked,
	onDeleteHighlightClicked,
	onDownloadClicked,
	onClearClicked
}: Props) => {
	return (
		<div className="h-full overflow-scroll border-x border-gray-300 bg-gray-50 p-2">
			{highlights.length > 0 && (
				<div className="flex justify-between text-2xl">
					<FontAwesomeIcon
						icon={faDownload}
						className="cursor-pointer p-2 text-gray-300 transition-colors duration-100 hover:text-blue-500"
						onClick={onDownloadClicked}
					/>
					<FontAwesomeIcon
						icon={faTrash}
						className="cursor-pointer p-2 text-gray-300 transition-colors duration-100 hover:text-red-500"
						onClick={onClearClicked}
					/>
				</div>
			)}
			{highlights.map((highlight, index) => {
				return (
					<div
						key={index}
						className="cursor-pointer rounded border border-transparent p-2 text-gray-400  transition-all duration-100 hover:text-black"
						onClick={() => onHighlightClicked(highlight)}>
						<div className="flex flex-row justify-between">
							<div className="overflow-hidden text-ellipsis whitespace-nowrap py-1 text-lg">
								<span
									className={`mr-2 inline-block h-3 w-3 rounded-full border border-black`}
									style={{ backgroundColor: highlight.color }}
								/>
								{highlight.title}
							</div>
							<div className="flex gap-2 self-end">
								<div
									className="p-1 text-lg text-gray-300 transition-all duration-100 hover:text-blue-500"
									onClick={e => {
										e.stopPropagation();
										onEditHighlightClicked(highlight);
									}}>
									<FontAwesomeIcon icon={faPencil} />
								</div>
								<div
									className="p-1 text-lg text-gray-300 transition-all duration-100 hover:text-red-500"
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
