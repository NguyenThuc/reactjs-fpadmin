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
  isVisible: boolean;
  setVisible: (reloadData: boolean) => void;
  id: string;
};

export const DeleteGarbageTypeModal: FC<Props> = ({
  isVisible,
  setVisible,
  id,
}) => {
  const toast = useToast();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const reset = useCallback(() => {
    setName('');
    setDescription('');
  }, []);

  useEffect(() => {
    if (!isVisible) {
      reset();
    }
  }, [isVisible]);

  const handleDeleteGarbageType = useCallback(async () => {
    try {
      setLoading(true);
      const { isOk } = await deleteGarbageType(id);

      if (isOk) {
        toast({
          title: 'ガベージタイプの削除成功',
          description: '',
          status: 'success',
          duration: 2000,
        });

        setVisible(true);
      } else {
        toast({
          title: 'ガベージ タイプの削除に失敗しました',
          description: '',
          status: 'error',
          duration: 2000,
        });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [name, description, id]);

  return (
    <Modal size='sm' isOpen={isVisible} onClose={() => setVisible(false)}>
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
            isLoading={isLoading}
            onClick={handleDeleteGarbageType}
          >
            消去
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
