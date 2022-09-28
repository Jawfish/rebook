import React, { useContext } from 'react';

import { BookContext, RenditionContext } from '../lib/Store';

import ButtonComponent from './ButtonComponent/ButtonComponent';

type HighlightModalComponentProps = {
	closeModal: () => void;
};

const HighlightModalComponent = ({
	closeModal
}: HighlightModalComponentProps) => {
	const context = useContext<BookContext>(RenditionContext);
	return (
		<div className="flex flex-col">
			<div className="flex flex-col">
				<div>Title:</div>
				<input
					type="text"
					name="title"
					id="title"
					className="rounded-md border border-gray-300"
				/>
				<div>Annotation:</div>
				<textarea
					name="annotation"
					id="annotation"
					cols={45}
					rows={5}
					className="rounded-md  border border-gray-300"
				/>
			</div>
			<div className="flex justify-between">
				<div className="mt-2">
					<ButtonComponent
						label="Cancel"
						onClick={() => {
							context.setContextSelection('');
							// deselect the text
							console.log(context.rendition);
							closeModal();
						}}
						buttonClass="cancel-button"
					/>
				</div>
				<div className="mt-2">
					<ButtonComponent
						label="Save"
						onClick={() => {
							context.setContextSelection('');
							closeModal();
						}}
						buttonClass="primary-button"
					/>
				</div>
			</div>
		</div>
	);
};

export default HighlightModalComponent;
