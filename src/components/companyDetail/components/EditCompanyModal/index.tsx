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
import { LogoUpload } from '../../../companyList/components/LogoUpload';
import { toBase64 } from '../../../../utils/toBase64';
import { editCompany } from '../../../../services/apiRequests/company';

import { styles } from './styles';
import { ICompany } from '../../../../models/company';

type Props = {
  isVisible: boolean;
  setVisible: (isVisible: boolean, isReloadData: boolean) => void;
  company: ICompany | null;
};

export const EditCompanyModal: FC<Props> = ({
  isVisible,
  setVisible,
  company,
}) => {
  const toast = useToast();
  const [logo, setLogo] = useState<string>('');
  const [preview, setPreview] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [website, setWebsite] = useState<string>('');

  const reset = useCallback(() => {
    setLogo('');
    setName(company?.name || '');
    setAddress(company?.address || '');
    setPhone(company?.phone_number || '');
    setWebsite(company?.website || '');
    setPreview(company?.logo || '');
  }, [company]);

  useEffect(() => {
    if (isVisible) {
      reset();
    }
  }, [isVisible]);

  const handleUploadedImage = useCallback(async (file) => {
    const { size, name } = file;

    if (size > 1000000) {
      toast({
        title: `ファイル ${name} が大きすぎます。 最大サイズは 1MB です`,
        description: '',
        status: 'error',
        duration: 2000,
      });
    } else {
      const base64Image = await toBase64(file);
      setPreview(base64Image as string);
      setLogo(file);
    }
  }, []);

  const handleUpdateCompanyInformation = useCallback(async () => {
    const result = await editCompany({
      logo,
      name,
      website,
      address,
      phone,
      id: company?.id,
    });

    const { isOk } = result;

    if (isOk) {
      toast({
        title: '会社情報の更新成功',
        description: '',
        status: 'success',
        duration: 2000,
      });

      setVisible(false, true);
    } else {
      toast({
        title: '会社情報の更新に失敗しました',
        description: '',
        status: 'error',
        duration: 2000,
      });
    }
  }, [logo, name, website, address, phone, company]);

  return (
    <Modal
      size='4xl'
      isOpen={isVisible}
      onClose={() => setVisible(false, false)}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign='center'>会社情報の更新</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className={styles.container}>
            <div className={styles.logoContainer}>
              <LogoUpload onUploaded={handleUploadedImage} logo={preview} />
            </div>
            <div className={styles.infoContainer}>
              <Text fontWeight='bold' mb={2}>
                会社名
              </Text>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Company's name"
                maxLength={100}
                mb={4}
              />

              <Text fontWeight='bold' mb={2}>
                Webサイト
              </Text>
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder='https://company.com.vn'
                maxLength={100}
                mb={4}
              />

              <Text fontWeight='bold' mb={2}>
                住所
              </Text>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder='A3 Tokyo, JP'
                maxLength={100}
                mb={4}
              />

              <Text fontWeight='bold' mb={2}>
                電話番号
              </Text>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder='385-841-988'
                maxLength={20}
                mb={4}
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button onClick={handleUpdateCompanyInformation}>更新</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
