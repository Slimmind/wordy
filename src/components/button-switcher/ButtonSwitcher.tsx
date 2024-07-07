import { useState, useEffect } from 'react';
import Button from '../button';
import './button-switcher.styles.css';

type ButtonSwitcherProps<T> = {
	firstLabel: string;
	secondLabel: string;
	firstValue: T;
	secondValue: T;
	defaultValue?: T;
	setValue: (value: T) => void;
};

export const ButtonSwitcher = <T,>({
	firstLabel,
	secondLabel,
	firstValue,
	secondValue,
	defaultValue,
	setValue,
}: ButtonSwitcherProps<T>) => {
	const [active, setActive] = useState<T>(defaultValue ?? firstValue);

	useEffect(() => {
		if (defaultValue !== undefined) {
			setActive(defaultValue);
		}
	}, [defaultValue]);

	const switchHandler = (value: T) => {
		setActive(value);
		setValue(value);
	};

	const getButtonClass = (value: T) => (active === value ? '' : 'bordered');

	return (
		<div className='button-switcher'>
			<Button
				mod={getButtonClass(firstValue)}
				onClick={() => switchHandler(firstValue)}
			>
				{firstLabel}
			</Button>
			<Button
				mod={getButtonClass(secondValue)}
				onClick={() => switchHandler(secondValue)}
			>
				{secondLabel}
			</Button>
		</div>
	);
};
