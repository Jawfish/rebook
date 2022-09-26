import React from 'react';

import ButtonComponent from './ButtonComponent/ButtonComponent';

const HighlightModalComponent = () => {
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
						onClick={() => console.log('cancel')}
						buttonClass="cancel-button"
					/>
				</div>
				<div className="mt-2">
					<ButtonComponent
						label="Save"
						onClick={() => console.log('save')}
						buttonClass="primary-button"
					/>
				</div>
			</div>
		</div>
	);
};

export default HighlightModalComponent;
