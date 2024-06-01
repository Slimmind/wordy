import { ComponentPropsWithoutRef } from "react";
import './button.styles.css';

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  href?: never;
  mod?: string;
};

type AnchorProps = ComponentPropsWithoutRef<'a'> & {
  href?: string;
  mod?: string;
}

function isAnchorProps (props: ButtonProps | AnchorProps): props is AnchorProps {
  return 'href' in props;
}

export const Button = (props: ButtonProps | AnchorProps) => {
  if (isAnchorProps(props)) {
    return <a className={`btn ${props.mod}`} {...props}></a>
  }

  return (
    <button className={`btn ${props.mod}`} {...props}></button>
  );
}