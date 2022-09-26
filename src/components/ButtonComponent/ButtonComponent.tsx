import React from 'react';

import './ButtonStyle.css';

type ButtonComponentProps = {
	onClick: () => void;
	label: string;
	buttonClass: string;
};

const ButtonComponent: React.FC<ButtonComponentProps> = ({
	onClick,
	label,
	buttonClass = 'default-button'
}: ButtonComponentProps): JSX.Element => {
	return (
		<button
			className={`${buttonClass} w-20 rounded-md border p-2  transition-all`}
			onClick={onClick}>
			{label}
		</button>
	);
};

export default ButtonComponent;
