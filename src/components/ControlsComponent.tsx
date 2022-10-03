import React, { useContext, useEffect, useState } from 'react';

import { BookContext, Context } from '../lib/Store';
import { RenditionController } from '../types/RenditionController';

import HighlightModalComponent from './HighlightModalComponent';
import ButtonComponent from './ButtonComponent/ButtonComponent';

const ControlsComponent = () => {
	const context = useContext<BookContext>(Context);
	const modalShowing = false;

	return (
		<div className="rounded-t-md border border-gray-300 bg-gray-50 p-4">
			{modalShowing && (
				<div className="col-span-4 place-self-center">
					<HighlightModalComponent title="test" annotation="test" />
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
							onClick={() => console.log('open modal')}
							disabled={!context.selectionLocation}
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
