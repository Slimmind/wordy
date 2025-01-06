import { PropsWithChildren } from "react";
import "./fieldset.styles.css";

type FieldSetProps = {
  title?: string;
} & PropsWithChildren

export const Fieldset = ({ title, children }: FieldSetProps) => {
  return (
    <fieldset>
      {title && (<legend>{title}</legend>)}
      {children}
    </fieldset>
  );
}
