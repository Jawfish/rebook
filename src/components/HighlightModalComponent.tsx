import { useEffect, useState } from 'react';

import ButtonComponent from './ButtonComponent/ButtonComponent';

// This component can take a title and an
// annotation as props for instances where
// there is a pre-existing highlight that
// is being edited within this modal.
type Props = {
	title?: string;
	annotation?: string;
	onCancel: () => void;
	onSave: (title: string, annotation: string) => void;
};

const HighlightModalComponent = ({
	title = '',
	annotation = '',
	onCancel,
	onSave
}: Props) => {
	const [titleValue, setTitleValue] = useState(title);
	const [annotationValue, setAnnotationValue] = useState(annotation);
	const [titleError, setTitleError] = useState(false);

	useEffect(() => {
		if (titleError) document.getElementById('title')?.focus();
		if (titleValue) setTitleError(false);
	}, [titleError, titleValue]);

	return (
		<div className="flex flex-col rounded-t-md border border-gray-300 bg-gray-50 p-4">
			<div className="flex flex-col">
				<div>Title:</div>
				<input
					type="text"
					name="title"
					id="title"
					autoFocus
					className={`rounded-md border border-gray-300 p-1 transition-all duration-100 ${
						titleError ? 'border-red-500 bg-red-50 focus:outline-red-500' : ''
					}`}
					value={titleValue}
					onInput={e => setTitleValue(e.currentTarget.value)}
				/>
				<div className="mt-3">Annotation:</div>
				<textarea
					name="annotation"
					id="annotation"
					cols={45}
					rows={5}
					className="mb-1 rounded-md border border-gray-300 p-1"
					value={annotationValue}
					onInput={e => setAnnotationValue(e.currentTarget.value)}
				/>
			</div>
			<div className="flex justify-between">
				<div className="mt-2">
					<ButtonComponent
						label="Cancel"
						onClick={onCancel}
						buttonClass="cancel-button"
					/>
				</div>
				<div
					className={`my-auto text-red-500 transition-all duration-100 ${
						titleError ? 'opacity-100' : 'opacity-0'
					}`}>
					Please enter a title.
				</div>
				<div className="mt-2">
					<ButtonComponent
						label="Save"
						onClick={() => {
							if (titleValue) {
								onSave(titleValue, annotationValue);
							} else {
								setTitleError(true);
							}
						}}
						buttonClass="primary-button"
					/>
				</div>
			</div>
		</div>
	);
};

export default HighlightModalComponent;
