import { PropsWithChildren } from 'react';
import './alert.styles.css';

type AlertProps = {
  type?: 'info' | 'error';
  title?: string;
} & PropsWithChildren;

export const Alert = ({ type, title, children }: AlertProps) => (
  <div className={`alert alert--${type}`}>
    {title && <h3 className='alert__title'>{title}</h3>}
    {children}
  </div>
);