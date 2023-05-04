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
import { editGarbageType } from '../../../../services/apiRequests/garbages';

import { styles } from './styles';
import CancelModalButton from '../../../common/CancelModalButton';
import DeepBlueButton from '../../../common/DeepBlueButton';

type Props = {
  isVisible: boolean;
  setVisible: (reloadData: boolean) => void;
  initData: any;
};

export const EditGarbageTypeModal: FC<Props> = ({
  isVisible,
  setVisible,
  initData,
}) => {
  const toast = useToast();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const reset = useCallback(() => {
    setName(initData?.name || '');
    setDescription(initData?.description || '');
  }, [initData]);

  useEffect(() => {
    if (isVisible) {
      reset();
    }
  }, [isVisible]);

  const handleEditGarbageType = useCallback(async () => {
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
      const { isOk } = await editGarbageType({
        id: initData.id,
        name,
        description,
      });

      if (isOk) {
        toast({
          title: 'ガベージ タイプの編集成功',
          description: '',
          status: 'success',
          duration: 2000,
        });

        setVisible(true);
      } else {
        toast({
          title: 'ガベージ タイプの編集に失敗しました',
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
    <Modal size='xl' isOpen={isVisible} onClose={() => setVisible(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign='center'>ゴミの種類を編集</ModalHeader>
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
          <DeepBlueButton isLoading={isLoading} onClick={handleEditGarbageType}>
            編集
          </DeepBlueButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
