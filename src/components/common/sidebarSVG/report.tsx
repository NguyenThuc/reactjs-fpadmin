
import React from 'react';

interface IHistoryProps {
  color?: string;
}

export const ReportSVG: React.FC<IHistoryProps> = (props) => {

  const svgColor: string = props?.color || 'white';

  const style = {
    color: svgColor
  };

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M7.28125 10.4385H10.79" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M7.28125 13.9473H12.5444" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M7.28125 1.6665H12.5444V2.78868V4.29808H7.28125V2.78868V1.6665Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M12.5445 2.78857C15.5046 3.4613 16.4919 5.61699 16.4919 10.4383C16.4919 16.4755 14.9439 18.333 9.91293 18.333C4.88198 18.333 3.33398 16.4755 3.33398 10.4383C3.33398 5.61699 4.32126 3.4613 7.28135 2.78857" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
};

