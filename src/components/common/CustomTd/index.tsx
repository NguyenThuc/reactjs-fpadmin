import React from 'react';
import { Td } from '@chakra-ui/react';

export const CustomTd = (props) => {
  const { children, ...rest } = props;

  return (
    <Td fontSize='14px' fontWeight='500' {...rest}>
      {children}
    </Td>
  );
};
