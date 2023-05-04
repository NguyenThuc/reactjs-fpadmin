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
import { editCompanyReport } from '../../../../services/apiRequests/companyReport';

import { styles } from './styles';
import CancelModalButton from '../../../common/CancelModalButton';
import DeepBlueButton from '../../../common/DeepBlueButton';

type Props = {
  isVisible: boolean;
  setVisible: (reloadData: boolean) => void;
  selectedReport: any;
};

export const EditReportTypeModal: FC<Props> = ({
  isVisible,
  setVisible,
  selectedReport,
}) => {
  const toast = useToast();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const reset = useCallback(() => {
    setName(selectedReport?.name || '');
    setDescription(selectedReport?.description || '');
  }, [selectedReport]);

  useEffect(() => {
    if (isVisible) {
      reset();
    }
  }, [isVisible]);

  const handleAddCompanyReport = useCallback(async () => {
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
      const { id } = await editCompanyReport(selectedReport.id, {
        name,
        description,
      });

      if (id !== null && id !== undefined) {
        toast({
          title: '新しいレポート タイプの作成成功',
          description: '',
          status: 'success',
          duration: 2000,
        });
        setVisible(true);
      } else {
        toast({
          title: '新しいレポート タイプの作成に失敗しました',
          description: '',
          status: 'error',
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        title: '新しいレポート タイプの作成に失敗しました',
        description: '',
        status: 'error',
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  }, [name, description]);

  return (
    <Modal size='xl' isOpen={isVisible} onClose={() => setVisible(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign='center'>レポートの種類を編集</ModalHeader>
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
          <DeepBlueButton
            isLoading={isLoading}
            onClick={handleAddCompanyReport}
          >
            編集
          </DeepBlueButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
