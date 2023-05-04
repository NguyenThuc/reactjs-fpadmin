import React from 'react';
import { Button } from '@chakra-ui/button';

const DeepBlueButton = (props: any) => {
  const { children, ...rest } = props;
  return <Button backgroundColor='sidebar.background' {...rest}>{children}</Button>;
};

export default DeepBlueButton;
