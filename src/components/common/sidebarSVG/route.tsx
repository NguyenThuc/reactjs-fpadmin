import React from 'react';

interface IHistoryProps {
  color?: string;
}

export const RouteSVG: React.FC<IHistoryProps> = (props) => {

  const svgColor: string = props?.color || 'white';

  const style = {
    color: svgColor
  };

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <g clipPath="url(#clip0_478_1488)">
        <path d="M2.78087 12.7778C2.07182 13.3226 1.66602 13.9551 1.66602 14.6297C1.66602 16.6751 5.39698 18.3334 9.99935 18.3334C14.6018 18.3334 18.3327 16.6751 18.3327 14.6297C18.3327 13.9551 17.9268 13.3226 17.2179 12.7778" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.99892 14.6297C13.0672 13.1893 15.5545 10.61 15.5545 7.42806C15.5545 4.24617 13.0672 1.66675 9.99892 1.66675C6.93067 1.66675 4.44336 4.24617 4.44336 7.42806C4.44336 10.61 6.93067 13.1893 9.99892 14.6297Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 4.90747V9.5371" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.68555 7.22217H12.3152" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_478_1488">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

