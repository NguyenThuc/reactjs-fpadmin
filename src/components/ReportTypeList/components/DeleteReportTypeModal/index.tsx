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
import { deleteReportType } from '../../../../services/apiRequests/reportTypes';

import { styles } from './styles';

type Props = {
  isVisible: boolean;
  setVisible: (reloadData: boolean) => void;
  id: string;
};

export const DeleteReportTypeModal: FC<Props> = ({
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

  const handleDeleteReportType = useCallback(async () => {
    try {
      setLoading(true);
      const { isOk } = await deleteReportType(id);

      if (isOk) {
        toast({
          title: 'レポート タイプの成功の削除',
          description: '',
          status: 'success',
          duration: 2000,
        });

        setVisible(true);
      } else {
        toast({
          title: 'レポート タイプの削除に失敗しました',
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
        <ModalHeader textAlign='center'>レポート タイプの削除</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className={styles.container}>本当に削除しますか？</div>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme='red'
            isLoading={isLoading}
            onClick={handleDeleteReportType}
          >
            消去
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
