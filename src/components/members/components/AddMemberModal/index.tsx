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
// import { AvatarUpload } from '../AvatarUpload';
// import { toBase64 } from '../../../../utils/toBase64';
import { addMember } from '../../../../services/apiRequests/members';

import { styles } from './styles';
import DeepBlueButton from '../../../common/DeepBlueButton';

type Props = {
  isVisible: boolean;
  setVisible: (isVisible: boolean, reloadData: boolean) => void;
};

export const AddMemberModal: FC<Props> = ({ isVisible, setVisible }) => {
  const toast = useToast();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  // const [profile, setProfile] = useState<string>('');
  const [type, setType] = useState<String>('E');
  // const [avatar, setAvatar] = useState<any>();

  // const [preview, setPreview] = useState<string>('');

  const reset = useCallback(() => {
    setUsername('');
    setEmail('');
    setFirstName('');
    setLastName('');
    // setProfile('');
    setPassword('');
  }, []);

  useEffect(() => {
    if (!isVisible) {
      reset();
    }
  }, [isVisible]);

  // const handleUploadedImage = useCallback(async (file) => {
  //   const { size, name } = file;

  //   if (size > 1000000) {
  //     toast({
  //       title: `ファイル ${name} が大きすぎます。 最大サイズは 1MB です`,
  //       description: '',
  //       status: 'error',
  //       duration: 2000,
  //     });
  //   } else {
  //     const base64Image = await toBase64(file);
  //     setPreview(base64Image as string);
  //     setAvatar(file);
  //   }
  // }, []);

  const handleAddMember = useCallback(async () => {
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
      const { isOk } = await addMember({
        username,
        password,
        email,
        firstName,
        lastName,
        type,
      });

      if (isOk) {
        toast({
          title: '会社情報の作成の成功',
          description: '',
          status: 'success',
          duration: 2000,
        });

        setVisible(false, true);
      } else {
        toast({
          title: '会社情報の作成に失敗しました',
          description: '',
          status: 'error',
          duration: 2000,
        });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [username, password, email, firstName, lastName, type]);

  return (
    <Modal
      size='xl'
      isOpen={isVisible}
      onClose={() => setVisible(false, false)}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign='center'>運転手追加</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className={styles.container}>
            {/* <div className={styles.logoContainer}>
              <AvatarUpload onUploaded={handleUploadedImage} logo={preview} />
            </div> */}
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
                // placeholder='Account Type'
              >
                <option value='E'>運転手</option>
                <option value='D'>管理者</option>
              </Select>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <DeepBlueButton isLoading={isLoading} onClick={handleAddMember}>
            運転手追加
          </DeepBlueButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
