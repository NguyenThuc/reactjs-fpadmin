import React from 'react';
import { Container } from '@chakra-ui/layout';

const CustomCard = (props: any) => {
  const { children, ...rest } = props;
  return (
    <Container
      maxW='container.xl'
      borderRadius='10px'
      boxShadow='0px 4px 10px rgba(0, 0, 0, 0.05)'
      background='#FFFFFF'
      padding='40px 48px 40px 48px'
      {...rest}
    >
      {children}
    </Container>
  );
};

export default CustomCard;
