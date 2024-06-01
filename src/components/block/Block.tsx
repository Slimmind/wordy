import { ElementType, PropsWithChildren } from 'react';
import './block.styles.css';

type BlockProps = {
  tag?: ElementType;
  title?: string;
} & PropsWithChildren;

export const Block = ({ children, tag: Tag = 'div', title }: BlockProps) => {

  return <Tag className='block'>
    {title && <h3 className="block__title">{title}</h3>}
    {children}
  </Tag>
}