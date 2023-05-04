import React from 'react';
import { Button } from '@chakra-ui/button';

const BlueButton = (props: any) => {
  const { children, ...rest } = props;
  return (
    <Button
      alignSelf='flex-start'
      color='white'
      borderRadius='36px'
      background='linear-gradient(274.1deg, #295495 0%, #14A3B8 100%)'
      fontSize='13px'
      size='md'
      width='239px'
      height='52px'
      _hover=''
      {...rest}
    >
      {children}
    </Button>
  );
};

export default BlueButton;
