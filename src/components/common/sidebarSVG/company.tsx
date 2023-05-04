
import React from 'react';

interface IHistoryProps {
  color?: string;
}

export const CompanySVG: React.FC<IHistoryProps> = (props) => {

  const svgColor: string = props?.color || 'white';

  const style = {
    color: svgColor
  };

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M15.6799 17.1526C16.4895 17.1526 17.1892 16.5991 17.2979 15.7968C17.4011 15.0343 17.4986 13.9853 17.4986 12.7416C17.4986 10.0951 17.6471 8.47923 14.8521 5.6841C13.5628 4.39491 12.1229 3.40716 11.149 2.80894C10.4392 2.37293 9.56077 2.37293 8.85096 2.80894C7.87702 3.40716 6.43712 4.39491 5.14793 5.6841C2.35281 8.47923 2.50137 10.0951 2.50137 12.7416C2.50137 13.9853 2.59878 15.0343 2.70205 15.7967C2.8107 16.5991 3.51043 17.1526 4.32005 17.1526H15.6799Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
};

