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
} from '@chakra-ui/react';
import { deleteGarbageType } from '../../../../services/apiRequests/garbages';

import { styles } from './styles';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  garbageDetails: any;
  onSubmit: any;
};

export const DeleteGarbageTypeModal: FC<Props> = ({
  isOpen,
  onClose,
  garbageDetails,
  onSubmit
}) => {

  const handleSubmit = async () => {
    const { id } = garbageDetails;
    await onSubmit(id, () => {
      onClose();
    });
  }

  return (
    <Modal size='sm' isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign='center'>ごみの種類を削除</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className={styles.container}>本当に削除しますか？</div>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme='red'
            onClick={handleSubmit}
          >
            消去
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
