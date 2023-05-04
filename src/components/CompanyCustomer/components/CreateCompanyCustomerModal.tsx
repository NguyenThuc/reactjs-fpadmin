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
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import CancelModalButton from '../../common/CancelModalButton';
import DeepBlueButton from '../../common/DeepBlueButton';

export const CreateCompanyCustomerModal = ({
  isOpen,
  onClose,
  onSubmit,
  companyDetails,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: Function;
  companyDetails?: any;
}) => {
  const handleServerError = (errors: { error: any }) => {
    Object.entries(errors).forEach(([key, value]) => {
      let errorValue = value;
      if (Array.isArray(value)) {
        errorValue = value.join('\n');
      }
      formik.setFieldError(key, errorValue);
    });
  };

  const formik = useFormik({
    initialValues: {
      name: companyDetails?.name || '',
      description: companyDetails?.description || '',
    },
    validate: (values) => {
      const errors = {};
      if (!values.name) {
        errors.name = 'タイプ名が必要です';
      }
      return errors;
    },
    onSubmit: async (values) => {
      if (companyDetails) {
        await onSubmit(
          companyDetails?.id,
          formik.values,
          () => {
            onClose();
            formik.resetForm();
          },
          handleServerError
        );
      } else {
        await onSubmit(
          values,
          () => {
            onClose();
            formik.resetForm();
          },
          handleServerError
        );
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
        <ModalHeader textAlign='center'>
          {companyDetails ? 'お客様情報の編集' : '新しい顧客を追加'}
        </ModalHeader>
        <CancelModalButton />
        <ModalBody>
          <div>
            <Box mb='8px'>
              <Text mb='4px' fontWeight='600'>
                名前
              </Text>
              <Input
                placeholder='名前'
                value={formik.values.name}
                onChange={(e) => {
                  formik.setFieldValue('name', e.target.value);
                }}
                mb='4px'
              />
              {formik.errors.name ? (
                <Text color='red'>{formik.errors.name}</Text>
              ) : null}
            </Box>
            <Box mb='8px'>
              <Text mb='4px' fontWeight='600'>
                説明
              </Text>
              <Input
                placeholder='説明'
                value={formik.values.description}
                onChange={(e) => {
                  formik.setFieldValue('description', e.target.value);
                }}
              />
              {formik.errors.description ? (
                <Text color='red'>{formik.errors.description}</Text>
              ) : null}
            </Box>
          </div>
        </ModalBody>
        <ModalFooter>
          <DeepBlueButton colorScheme='blue' onClick={formik.submitForm}>
            {companyDetails ? '編集' : '追加'}
          </DeepBlueButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
