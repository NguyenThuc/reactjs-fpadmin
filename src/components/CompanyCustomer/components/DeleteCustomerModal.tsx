import React from 'react'
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
  Box
} from '@chakra-ui/react';

export const DeleteCustomerModal = ({
  isOpen,
  onClose,
  onSubmit,
  companyDetails
}: {
  isOpen: boolean,
  onClose: () => void,
  onSubmit: Function,
  companyDetails?: any
}) => {

  const handleSubmit = async () => {
    const { id } = companyDetails;
    await onSubmit(id, () => {
      onClose();
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='xl'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign='center'>顧客を削除</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          本当に削除しますか？
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='red' onClick={handleSubmit}>
            消去
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}