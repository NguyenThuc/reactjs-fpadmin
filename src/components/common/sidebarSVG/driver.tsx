import React from 'react';

interface IHistoryProps {
  color?: string;
}

export const DriverSVG: React.FC<IHistoryProps> = (props) => {

  const svgColor: string = props?.color || 'white';

  const style = {
    color: svgColor
  };

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M17.3145 5.37937V5.37012" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M17.3145 10.9258V7.68506" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M14.9999 18.333H4.8148C3.53637 18.333 2.5 17.2967 2.5 16.0182C2.5 12.2398 8.05552 12.3146 9.90737 12.3146C11.7592 12.3146 17.3147 12.2398 17.3147 16.0182C17.3147 17.2967 16.2783 18.333 14.9999 18.333Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M9.90681 9.07387C11.9523 9.07387 13.6105 7.41568 13.6105 5.37019C13.6105 3.3247 11.9523 1.6665 9.90681 1.6665C7.86132 1.6665 6.20312 3.3247 6.20312 5.37019C6.20312 7.41568 7.86132 9.07387 9.90681 9.07387Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
};

