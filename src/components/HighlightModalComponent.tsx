import React, { useContext } from 'react';

import { BookContext, Context } from '../lib/Store';

import ButtonComponent from './ButtonComponent/ButtonComponent';

type HighlightModalComponentProps = {
	title: string;
	annotation: string;
};

const HighlightModalComponent = ({
	title = '',
	annotation = ''
}: HighlightModalComponentProps) => {
	const context = useContext<BookContext>(Context);
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
							console.log('deselect text and close modal');
						}}
						buttonClass="cancel-button"
					/>
				</div>
				<div className="mt-2">
					<ButtonComponent
						label="Save"
						onClick={() => {
							console.log('save the highlight');
						}}
						buttonClass="primary-button"
					/>
				</div>
			</div>
		</div>
	);
};

export default HighlightModalComponent;
