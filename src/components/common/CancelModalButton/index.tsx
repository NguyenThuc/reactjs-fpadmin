import React from 'react';
import { ModalCloseButton } from '@chakra-ui/modal';

const CancelModalButton = (props: any) => {
  return (
    <ModalCloseButton
      borderLeft='1px solid #E4E4E4'
      borderRadius='none'
      right='5px'
      padding='0px 20px 0px 20px'
      {...props}
    />
  );
};

export default CancelModalButton;
