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
  Select,
} from '@chakra-ui/react';
import { updateMember } from '../../../../services/apiRequests/members';

import { styles } from './styles';
import { IMember } from '../../../../models/member';
import DeepBlueButton from '../../../common/DeepBlueButton';

type Props = {
  isVisible: boolean;
  setVisible: (isVisible: boolean, reloadData: boolean) => void;
  initialData: IMember;
  memberId: number;
};

export const EditMemberModal: FC<Props> = ({
  isVisible,
  setVisible,
  initialData,
  memberId,
}) => {
  const toast = useToast();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>(initialData.username);
  const [password, setPassword] = useState<string>(initialData.password);
  const [email, setEmail] = useState<string>(initialData.email || '');
  const [firstName, setFirstName] = useState<string>(
    initialData.last_name || ''
  );
  const [lastName, setLastName] = useState<string>(
    initialData.first_name || ''
  );
  const [type, setType] = useState<String>(
    initialData.type === 'Director' ? 'D' : 'E'
  );

  const reset = useCallback(() => {
    setUsername(initialData.username);
    setEmail(initialData.email || '');
    setFirstName(initialData.first_name || '');
    setLastName(initialData.last_name || '');
    setType(initialData.type === 'Director' ? 'D' : 'E');
    setPassword(initialData.password);
  }, [initialData]);

  useEffect(() => {
    reset();
  }, [isVisible]);

  const handleEditMember = useCallback(async () => {
    try {
      if (!username) {
        toast({
          title: 'ユーザー名を空にすることはできません',
          description: '',
          status: 'error',
          duration: 2000,
        });

        return;
      }

      if (!password) {
        toast({
          title: 'パスワードを空にすることはできません',
          description: '',
          status: 'error',
          duration: 2000,
        });

        return;
      }

      if (password.length < 8) {
        toast({
          title:
            'パスワードは文字数が8文字以上で、文字、数字と特殊文字を含める必要があります。',
          description: '',
          status: 'error',
          duration: 2000,
        });

        return;
      }

      setLoading(true);
      const { isOk } = await updateMember({
        id: memberId,
        username,
        password,
        email,
        firstName,
        lastName,
        type,
      });

      if (isOk) {
        toast({
          title: '運転手の更新に成功しました。',
          description: '',
          status: 'success',
          duration: 2000,
        });

        setVisible(false, true);
      } else {
        toast({
          title: '運転手の更新に失敗しました。',
          description: '',
          status: 'error',
          duration: 2000,
        });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [username, password, email, firstName, lastName, type, memberId]);

  return (
    <Modal
      size='xl'
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
        <ModalHeader textAlign='center'>運転手の情報を更新します。</ModalHeader>
        <ModalCloseButton disabled={isLoading} />
        <ModalBody>
          <div className={styles.container}>
            <div className={styles.infoContainer}>
              <Text fontWeight='bold' mb={2}>
                ユーザー名
              </Text>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='ユーザー名'
                maxLength={100}
                mb={4}
              />

              <Text fontWeight='bold' mb={2}>
                パスワード
              </Text>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='*******'
                maxLength={100}
                mb={4}
              />

              <Text fontWeight='bold' mb={2}>
                姓
              </Text>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder='姓'
                maxLength={100}
                mb={4}
              />

              <Text fontWeight='bold' mb={2}>
                名
              </Text>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder='名'
                maxLength={100}
                mb={4}
              />
              <Text fontWeight='bold' mb={2}>
                メールアドレス
              </Text>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='abc@mail.com'
                maxLength={100}
                mb={4}
              />
              <Text fontWeight='bold' mb={2}>
                アカウント種類
              </Text>
              <Select
                mb={4}
                value={type as string}
                onChange={(e) => setType(e.target.value)}
              >
                <option value='E'>運転手</option>
                <option value='D'>管理者</option>
              </Select>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <DeepBlueButton isLoading={isLoading} onClick={handleEditMember}>
            更新
          </DeepBlueButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
