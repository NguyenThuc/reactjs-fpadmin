import React from 'react';
import { Tr } from '@chakra-ui/react';

export const CustomTr = (props) => {
  const { children, ...rest } = props;

  return (
    <Tr
      _hover={{
        backgroundColor: 'table.backgroundHover',
        cursor: 'pointer',
        color: 'table.headerColor',
      }}
      height='53px'
      color='table.dataColor'
      {...rest}
    >
      {children}
    </Tr>
  );
};
