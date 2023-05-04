import React, { FC, useCallback, useState } from 'react';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useToast,
  Text,
  ModalHeader,
} from '@chakra-ui/react';
import { deleteMember } from '../../../../services/apiRequests/members';

type Props = {
  isVisible: boolean;
  setVisible: (isVisible: boolean, reloadData: boolean) => void;
  memberId: number;
};

export const DeleteMemberModal: FC<Props> = ({
  isVisible,
  setVisible,
  memberId,
}) => {
  const toast = useToast();
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleDeleteMember = useCallback(async () => {
    try {
      setLoading(true);
      const { isOk } = await deleteMember(memberId);

      if (isOk) {
        toast({
          title: '運転手の削除に成功しました。',
          description: '',
          status: 'success',
          duration: 2000,
        });

        setVisible(false, true);
      } else {
        toast({
          title: '運転手の削除に失敗しました。',
          description: '',
          status: 'error',
          duration: 2000,
        });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  return (
    <Modal
      size='md'
      isOpen={isVisible}
      onClose={() => {
        if (isLoading) {
          return;
        }

        setVisible(false, false);
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader />
        <ModalBody>
          <Text fontSize={18} textAlign='center' fontWeight='bold' mb={2}>
            この運転手を削除してもよろしいですか。
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme='gray'
            disabled={isLoading}
            mr={4}
            onClick={() => setVisible(false, false)}
          >
            キャンセル
          </Button>
          <Button
            colorScheme='red'
            isLoading={isLoading}
            onClick={handleDeleteMember}
          >
            削除
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
