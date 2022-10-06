import React, { useContext } from 'react';

import { RenditionContext, RenditionContextType } from '../lib/Store';

import ButtonComponent from './ButtonComponent/ButtonComponent';

type Props = {
	textIsSelected: boolean;
	onHighlightClicked: () => void;
	clearSelection: () => void;
};

const ControlsComponent: React.FC<Props> = ({
	textIsSelected,
	onHighlightClicked,
	clearSelection
}: Props) => {
	// NOTE: The context API is overkill for this situation;
	// I've implemented it here for demonstration purposes.
	// Normally, I would either send an event to the parent
	// or pass an object down as a prop. Likewise, passing
	// 'clearSelection' to this component would not be done
	// in a real app - it would be called by the parent when
	// this component emits an event.
	const { rendition } = useContext<RenditionContextType>(RenditionContext);

	return (
		<div className="rounded-t-md border border-gray-300 bg-gray-50 p-4">
			<div className="flex place-content-between ">
				<div className="col-span-1 self-end">
					<ButtonComponent
						label="Back"
						onClick={() => {
							clearSelection();
							rendition!.prev();
						}}
						buttonClass="default-button"
					/>
				</div>
				<div className="col-span-1 self-end">
					<ButtonComponent
						label="Highlight"
						onClick={onHighlightClicked}
						disabled={!textIsSelected}
						buttonClass="highlight-button"
					/>
				</div>
				<div className="col-span-1 self-end">
					<ButtonComponent
						label="Forward"
						onClick={() => {
							clearSelection();
							rendition!.next();
						}}
						buttonClass="default-button"
					/>
				</div>
			</div>
		</div>
	);
};

export default ControlsComponent;
