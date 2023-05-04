
import React from 'react';

interface IHistoryProps {
  color?: string;
}

export const NewsSVG: React.FC<IHistoryProps> = (props) => {

  const svgColor: string = props?.color || 'white';

  const style = {
    ...props,
    color: svgColor,
  };

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M9.74592 1.66675C6.58999 1.66675 4.03162 3.27274 4.03162 6.42865C4.03162 8.27551 3.36014 10.3461 2.66822 11.9895C2.09371 13.3541 3.05809 15.0001 4.53865 15.0001H14.9532C16.4337 15.0001 17.3981 13.3541 16.8236 11.9895C16.1316 10.3461 15.4602 8.27551 15.4602 6.42865C15.4602 3.27274 12.9018 1.66675 9.74592 1.66675Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.88672 15V15.9524C6.88672 17.5304 8.16586 18.3333 9.74386 18.3333C11.3219 18.3333 12.601 17.5304 12.601 15.9524V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

