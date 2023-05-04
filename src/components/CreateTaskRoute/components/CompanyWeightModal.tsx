import React, { useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Input,
  Box,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { CustomSpinner } from '../../common/Spinner';
import DeepBlueButton from '../../common/DeepBlueButton';

export const CompanyWeightModal = ({
  isOpen,
  onClose,
  onSubmit,
  pointDetails,
  setLoading,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: Function;
  pointDetails?: any;
}) => {
  const formik = useFormik({
    initialValues: {
      weight: '',
    },
    validate: (values) => {
      const errors = {};
      if (!values.weight) {
        errors.weight = 'の重量を入力してください';
      }
      return errors;
    },
    onSubmit: async (values) => {
      if (pointDetails) {
        setLoading(true);
        await onSubmit(onClose, values?.weight);
      }
    },
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='xl'>
      <ModalOverlay />
      <ModalContent>
        {loading && <CustomSpinner />}
        <ModalHeader textAlign='center'>{'重量を入力してください'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div>
            <Box mb='8px'>
              {/* <Text mb='4px' fontWeight='600'>
                Weight
              </Text> */}
              <NumberInput>
                <NumberInputField
                  placeholder='重量を入力してください'
                  value={formik.values.weight}
                  onChange={(e) => {
                    formik.setFieldValue('weight', e.target.value);
                  }}
                  mb='4px'
                />
              </NumberInput>
              {formik.errors.weight ? (
                <Text color='red'>{formik.errors.weight}</Text>
              ) : null}
            </Box>
          </div>
        </ModalBody>
        <ModalFooter>
          <DeepBlueButton onClick={formik.submitForm}>
            {pointDetails ? '同意' : '同意'}
          </DeepBlueButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
