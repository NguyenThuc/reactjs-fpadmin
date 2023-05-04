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
} from '@chakra-ui/react';
import { addReportType } from '../../../../services/apiRequests/reportTypes';

import { styles } from './styles';
import CancelModalButton from '../../../common/CancelModalButton';
import DeepBlueButton from '../../../common/DeepBlueButton';

type Props = {
  isVisible: boolean;
  setVisible: (isVisible: boolean, reloadData: boolean) => void;
};

export const AddReportTypeModal: FC<Props> = ({ isVisible, setVisible }) => {
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

  const handleAddReportType = useCallback(async () => {
    try {
      if (!name) {
        toast({
          title: 'タイプ名が必要です',
          description: '',
          status: 'error',
          duration: 2000,
        });

        return;
      }
      setLoading(true);
      const { isOk } = await addReportType({
        name,
        description,
      });

      if (isOk) {
        toast({
          title: '新しいレポート タイプの作成成功',
          description: '',
          status: 'success',
          duration: 2000,
        });

        setVisible(false, true);
      } else {
        toast({
          title: '新しいレポート タイプの作成に失敗しました',
          description: '',
          status: 'error',
          duration: 2000,
        });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [name, description]);

  return (
    <Modal
      size='xl'
      isOpen={isVisible}
      onClose={() => setVisible(false, false)}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign='center'>新しいレポート タイプ</ModalHeader>
        <CancelModalButton />
        <ModalBody>
          <div className={styles.container}>
            <div className={styles.infoContainer}>
              <Text fontWeight='bold' mb={2}>
                名前
              </Text>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='名前'
                maxLength={100}
                mb={4}
              />

              <Text fontWeight='bold' mb={2}>
                説明
              </Text>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='説明'
                maxLength={100}
                mb={4}
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <DeepBlueButton isLoading={isLoading} onClick={handleAddReportType}>
            追加
          </DeepBlueButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
