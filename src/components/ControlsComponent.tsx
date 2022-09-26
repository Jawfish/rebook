import React, { useContext, useState } from 'react';

import { BookContext, RenditionContext } from '../lib/Store';

import HighlightModalComponent from './HighlightModalComponent';
import ButtonComponent from './ButtonComponent/ButtonComponent';

const ControlsComponent = () => {
	const renditionContext = useContext<BookContext>(RenditionContext);
	const [showHighlightModal, setShowHighlightModal] = useState<boolean>(false);

	return (
		<div className="rounded-t-md border border-gray-300 bg-gray-50 p-4">
			{showHighlightModal && (
				<div className="col-span-4 place-self-center">
					<HighlightModalComponent />
				</div>
			)}
			{!showHighlightModal && (
				<div className="flex place-content-between ">
					<div className="col-span-1 self-end">
						<ButtonComponent
							label="Back"
							onClick={() => renditionContext.rendition!.prev()}
							buttonClass="default-button"
						/>
					</div>
					<div className="col-span-1 self-end">
						<ButtonComponent
							label="Highlight"
							onClick={() => setShowHighlightModal(true)}
							buttonClass="secondary-button"
							// TODO: disable button and set to default-button
							// (or invisible) if no text is selected
						/>
					</div>
					<div className="col-span-1 self-end">
						<ButtonComponent
							label="Forward"
							onClick={() => renditionContext.rendition!.next()}
							buttonClass="default-button"
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default ControlsComponent;
