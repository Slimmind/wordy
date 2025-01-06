import React, {
  forwardRef,
  InputHTMLAttributes,
  PropsWithChildren,
  TextareaHTMLAttributes,
} from "react";
import clsx from "clsx";
import "./input.styles.css";

export type InputProps = {
  label?: string;
  id?: string;
  type?: string;
  errorMessage?: string;
} & InputHTMLAttributes<HTMLInputElement> &
  TextareaHTMLAttributes<HTMLTextAreaElement> &
  PropsWithChildren;

export const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(({ id, label, type, children, errorMessage, ...props }, ref) => {
  const InputElement = type === "textarea" ? "textarea" : "input";

  const classes = clsx("input", errorMessage && "input--invalid");

  return (
    <div className={classes}>
      {label && <label htmlFor={id}>{label}</label>}
      <div className="input__wrap">
        {React.createElement(InputElement, {
          ref: ref as React.Ref<HTMLInputElement & HTMLTextAreaElement>,
          type: type || "text",
          id,
          ...props,
        })}
        {children}
      </div>
      {errorMessage && <p className="input__error-message">{errorMessage}</p>}
    </div>
  );
});
