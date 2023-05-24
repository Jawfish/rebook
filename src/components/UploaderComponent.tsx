import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';

import Uppy from '@uppy/core';
import React from 'react';
import { DragDrop } from '@uppy/react';

type UploaderProps = {
	onUpload: (file: File) => void;
};

const Uploader: React.FC<UploaderProps> = ({
	onUpload
}: UploaderProps): JSX.Element => {
	const uppy = new Uppy({
		restrictions: {
			maxNumberOfFiles: 1,
			allowedFileTypes: ['.epub']
		},
		autoProceed: true
	});
	uppy.on('complete', result => {
		onUpload(result.successful[0].data as File);
	});
	return <DragDrop uppy={uppy} className="w-full" />;
};

export default Uploader;
