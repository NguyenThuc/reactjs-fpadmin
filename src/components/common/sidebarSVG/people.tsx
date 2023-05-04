import React from 'react';

export const PeopleSVG = (props) => {
  const style = {
    width: 20,
    height: 20,
    marginLeft: 3,
    color: props.color || 'white',
  };

  return (
    <svg
      width='13'
      height='12'
      viewBox='0 0 13 12'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      style={style}
    >
      <path
        d='M9.52148 7.50684C10.626 7.50684 11.5215 8.40229 11.5215 9.50684V10.5068H10.5215'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M8.02148 5.44382C8.88408 5.22177 9.52148 4.43873 9.52148 3.50681C9.52148 2.57489 8.88408 1.79184 8.02148 1.56982'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M4.52148 5.50684C5.62603 5.50684 6.52148 4.61141 6.52148 3.50684C6.52148 2.40227 5.62603 1.50684 4.52148 1.50684C3.41691 1.50684 2.52148 2.40227 2.52148 3.50684C2.52148 4.61141 3.41691 5.50684 4.52148 5.50684Z'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M6.52148 7.50684H2.52148C1.41691 7.50684 0.521484 8.40229 0.521484 9.50684V10.5068H8.52148V9.50684C8.52148 8.40229 7.62603 7.50684 6.52148 7.50684Z'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};
