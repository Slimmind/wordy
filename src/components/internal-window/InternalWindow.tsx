import { PropsWithChildren } from "react";
import "./internal-window.styles.css";
import { Link } from "@tanstack/react-router";

export const InternalWindow = ({ children }: PropsWithChildren) => (
  <section className="internal-window">
    <Link to="/" className="internal-window__back-btn btn--circle btn--back" />
    <div className="internal-window__content">{children}</div>
  </section>);
