import React from 'react';

export const TrashSVG = (props) => {
  const style = {
    width: 20,
    height: 20,
    color: props.color || 'white',
  };

  return (
    <svg
      width='12'
      height='12'
      viewBox='0 0 12 12'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      style={style}
    >
      <path
        d='M7.125 4.875C7.125 4.875 7.40625 5.4375 7.40625 6.5625C7.40625 7.6875 7.125 8.25 7.125 8.25M4.875 4.875C4.875 4.875 4.59375 5.4375 4.59375 6.5625C4.59375 7.6875 4.875 8.25 4.875 8.25M9.37493 2.90625C9.37493 6.20177 10.1449 10.7812 5.99993 10.7812C1.85491 10.7812 2.62493 6.20177 2.62493 2.90625M1.5 2.90625H10.5M7.6875 2.90625V2.34375C7.6875 1.34529 6.76652 1.21875 6 1.21875C5.23348 1.21875 4.3125 1.34529 4.3125 2.34375V2.90625'
        stroke='currentColor'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  );
};
