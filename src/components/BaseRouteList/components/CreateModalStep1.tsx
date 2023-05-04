import React, { useState } from 'react';
import { Button, Box, Flex } from '@chakra-ui/react';
import DeepBlueButton from '../../common/DeepBlueButton';
import YellowButton from '../../common/YellowButton';

const TYPE = {
  COMPANY: 'COMPANY',
  BASE: 'BASE',
};

export const CreateModalStep1 = (props) => {
  const { setFieldValue, setStep } = props;

  const [currentStep, setCurrentType] = useState(null);

  const handleClickNext = () => {
    if (currentStep) {
      setFieldValue('type', currentStep);
      setStep((step) => {
        return step + 1;
      });
    }
  };

  const handleSelectType = (type) => {
    setCurrentType(type);
  };

  return (
    <Box>
      <Flex align='center' justify='space-evenly' padding='24px'>
        <DeepBlueButton
          
          size='lg'
          width='120px'
          height='120px'
          {...(currentStep === TYPE.BASE
            ? {}
            : {
                color: 'sidebar.background',
                backgroundColor: '#ffffff',
                variant: 'outline',
              })}
          _hover=''
          onClick={() => {
            handleSelectType(TYPE.BASE);
          }}
        >
          BASE
        </DeepBlueButton>
        <DeepBlueButton
          size='lg'
          width='120px'
          height='120px'
          onClick={() => {
            handleSelectType(TYPE.COMPANY);
          }}
          {...(currentStep === TYPE.COMPANY
            ? {}
            : {
                color: 'sidebar.background',
                backgroundColor: '#ffffff',
                variant: 'outline',
              })}
        >
          COMPANY
        </DeepBlueButton>
      </Flex>
      <Flex justify='center' align='center' padding='18px'>
        <YellowButton onClick={handleClickNext}>次へ</YellowButton>
      </Flex>
    </Box>
  );
};
