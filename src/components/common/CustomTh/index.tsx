import React from 'react';
import { Th } from '@chakra-ui/react';

export const CustomTh = (props) => {
  const { children, ...rest } = props;

  return (
    <Th color='table.headerColor' fontSize='12px' fontWeight='600' {...rest}>
      {children}
    </Th>
  );
};
