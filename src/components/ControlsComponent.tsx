import React, { useContext, useEffect, useState } from 'react';

import { BookContext, RenditionContext } from '../lib/Store';

import HighlightModalComponent from './HighlightModalComponent';
import ButtonComponent from './ButtonComponent/ButtonComponent';

type ControlsComponentProps = {
	modalShowing: boolean;
	setShowModal: (show: boolean) => void;
};

const ControlsComponent = ({
	modalShowing,
	setShowModal
}: ControlsComponentProps) => {
	const context = useContext<BookContext>(RenditionContext);

	return (
		<div className="rounded-t-md border border-gray-300 bg-gray-50 p-4">
			{modalShowing && (
				<div className="col-span-4 place-self-center">
					<HighlightModalComponent
						closeModal={() => {
							setShowModal(false);
						}}
					/>
				</div>
			)}
			{!modalShowing && (
				<div className="flex place-content-between ">
					<div className="col-span-1 self-end">
						<ButtonComponent
							label="Back"
							onClick={() => context.rendition!.prev()}
							buttonClass="default-button"
						/>
					</div>
					<div className="col-span-1 self-end">
						<ButtonComponent
							label="Highlight"
							onClick={() => setShowModal(true)}
							disabled={!context.selection}
							buttonClass="highlight-button"
						/>
					</div>
					<div className="col-span-1 self-end">
						<ButtonComponent
							label="Forward"
							onClick={() => context.rendition!.next()}
							buttonClass="default-button"
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default ControlsComponent;
