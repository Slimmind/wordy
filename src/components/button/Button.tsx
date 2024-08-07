import { ComponentPropsWithoutRef } from 'react';
import getMod from '../../utils/get-mod';
import './button.styles.css';

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
	href?: never;
	mod?: string;
  extraClass?: string;
};

type AnchorProps = ComponentPropsWithoutRef<'a'> & {
	href?: string;
	mod?: string;
  extraClass?: string;
};

function isAnchorProps(props: ButtonProps | AnchorProps): props is AnchorProps {
	return 'href' in props;
}

export const Button = (props: ButtonProps | AnchorProps) => {
	if (isAnchorProps(props)) {
		return <a className={`btn ${getMod('btn', props.mod)} ${props.extraClass}`} {...props}></a>;
	}

	return (
		<button className={`btn ${getMod('btn', props.mod)} ${props.extraClass}`} {...props}></button>
	);
};
