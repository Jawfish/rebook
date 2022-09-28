import React from 'react';

import './ButtonStyle.css';

type ButtonComponentProps = {
	onClick: () => void;
	label: string;
	buttonClass: string;
	disabled?: boolean;
};

const ButtonComponent: React.FC<ButtonComponentProps> = ({
	onClick,
	label,
	buttonClass = 'default-button',
	disabled = false
}: ButtonComponentProps): JSX.Element => {
	return (
		<button
			className={`${buttonClass} w-20 rounded-md border p-2  transition-all`}
			onClick={onClick}
			disabled={disabled}>
			{label}
		</button>
	);
};

export default ButtonComponent;
