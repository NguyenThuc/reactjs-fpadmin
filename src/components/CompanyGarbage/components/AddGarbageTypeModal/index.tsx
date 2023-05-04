import React, { FC, useCallback, useEffect, useState } from 'react';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useToast,
  Input,
  Text,
  Box,
} from '@chakra-ui/react';
import { addGarbageType } from '../../../../services/apiRequests/garbages';

import { styles } from './styles';
import { useFormik } from 'formik';
import DeepBlueButton from '../../../common/DeepBlueButton';
import CancelModalButton from '../../../common/CancelModalButton';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: Function;
  garbageDetails?: any;
};

export const AddGarbageTypeModal: FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  garbageDetails,
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
      name: garbageDetails?.name || '',
      description: garbageDetails?.description || '',
    },
    validate: (values) => {
      const errors = {};
      if (!values.name) {
        errors.name = 'タイプ名が必要です';
      }
      return errors;
    },
    onSubmit: async (values) => {
      if (garbageDetails) {
        await onSubmit(
          garbageDetails?.id,
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
    <Modal size='xl' isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign='center'>
          {garbageDetails ? 'ゴミの種類を編集' : '新しいゴミの種類'}
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
          <DeepBlueButton onClick={formik.submitForm}>
            {garbageDetails ? '編集' : '追加'}
          </DeepBlueButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
