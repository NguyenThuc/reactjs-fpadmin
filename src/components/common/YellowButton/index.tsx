import React from 'react';
import { Button } from '@chakra-ui/button';

const YellowButton = (props: any) => {
  const { children, ...rest } = props;
  return (
    <Button
      background='linear-gradient(274.1deg, #D1992F 0%, #CED12F 100%)'
      boxShadow='8px 8px 24px rgba(15, 124, 182, 0.3)'
      borderRadius='36px'
      width='234px'
      fontSize='16px'
      fontWeight='400'
      variant='unstyled'
      color='white'
      {...rest}
    >
      {children}
    </Button>
  );
};

export default YellowButton;
