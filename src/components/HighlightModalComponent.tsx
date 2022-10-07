import { EpubCFI } from 'epubjs';
import { useEffect, useState } from 'react';

import Highlight from '../types/Highlight';

import ButtonComponent from './ButtonComponent/ButtonComponent';

// This component can take a title and an
// annotation as props for instances where
// there is a pre-existing highlight that
// is being edited within this modal.
type Props = {
	title?: string;
	annotation?: string;
	range: EpubCFI;
	color?: string;
	text: string;
	onCancel: () => void;
	onSave: (highlight: Highlight) => void;
};

enum HighlightColors {
	Yellow = '#FDFD96',
	Blue = '#96FDFD',
	Green = '#96FD96',
	Red = '#FD9696'
}

// TODO: change this to take a Highlight object
const HighlightModalComponent = ({
	title = '',
	annotation = '',
	range,
	text,
	color = HighlightColors.Yellow,
	onCancel,
	onSave
}: Props) => {
	const [titleValue, setTitleValue] = useState(title);
	const [annotationValue, setAnnotationValue] = useState(annotation);
	const [titleError, setTitleError] = useState(false);
	const [rangeValue] = useState(range);
	const [highlightColor, setHighlightColor] = useState(color);

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
				<div className="flex flex-row justify-between py-1">
					Highlight Color:
				</div>
				{/* This could be componentized */}
				<div className="flex flex-row gap-2 py-1">
					{Object.values(HighlightColors).map(color => (
						<div
							key={color}
							className={`h-6 w-6 cursor-pointer rounded-full border border-gray-500 transition-all duration-100  ${
								highlightColor === color ? 'ring-1 ring-black' : ''
							}`}
							style={{ backgroundColor: color }}
							onClick={() => setHighlightColor(color)}
						/>
					))}
				</div>
			</div>
			<div className="flex justify-between">
				<div className="mt-2">
					<ButtonComponent
						label="Cancel"
						onClick={onCancel}
						buttonClass="default-button"
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
								const highlight: Highlight = {
									title: titleValue,
									annotation: annotationValue,
									cfiRange: rangeValue,
									color: highlightColor,
									text
								};
								onSave(highlight);
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
