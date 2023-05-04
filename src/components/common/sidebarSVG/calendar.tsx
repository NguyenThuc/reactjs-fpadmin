import React from 'react';

interface IHistoryProps {
  color?: string;
}

export const CalendarSVG: React.FC<IHistoryProps> = (props) => {

  const svgColor: string = props?.color || 'white';

  const style = {
    color: svgColor
  };

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M15 10.8333L10 15.8333V17.4999H11.6667L16.6667 12.4999L15 10.8333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.75 12.0833L15.4167 13.7499" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.5 2.08325V5.41659" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 2.08325V5.41659" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.92969 9.58325H7.49858" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.66602 17.17C3.8668 16.4597 2.91602 14.5078 2.91602 10.4166C2.91602 10.1283 2.92074 9.85059 2.93049 9.58325C3.10405 4.82723 4.87098 3.33325 9.99935 3.33325C14.4726 3.33325 16.3883 4.46991 16.92 7.91659" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

