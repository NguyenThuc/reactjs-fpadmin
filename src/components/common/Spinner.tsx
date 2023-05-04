import React from 'react';
import { Flex, Spinner } from '@chakra-ui/react';

export const CustomSpinner = ({ style }) => {
  return (
    <Flex
      position='fixed'
      top={0}
      left={0}
      right={0}
      bottom={0}
      justify='center'
      align='center'
      background='black'
      opacity='0.4'
      zIndex={99999}
      style={style}
    >
      <Spinner thickness='4px' size='xl' color='blue.500' />
    </Flex>
  );
};
