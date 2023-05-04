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
import { LogoUpload } from '../LogoUpload';
import { toBase64 } from '../../../../utils/toBase64';
import { addCompany } from '../../../../services/apiRequests/company';

import { styles } from './styles';

type Props = {
  isVisible: boolean;
  setVisible: (isVisible: boolean, reloadData: boolean) => void;
};

export const AddCompanyModal: FC<Props> = ({ isVisible, setVisible }) => {
  const toast = useToast();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [logo, setLogo] = useState<string>('');
  const [preview, setPreview] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [website, setWebsite] = useState<string>('');

  const reset = useCallback(() => {
    setLogo('');
    setName('');
    setAddress('');
    setPhone('');
    setWebsite('');
  }, []);

  useEffect(() => {
    if (!isVisible) {
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

  const handleAddCompany = useCallback(async () => {
    try {
      setLoading(true);
      const { isOk } = await addCompany({
        logo,
        name,
        website,
        address,
        phone,
      });

      if (isOk) {
        toast({
          title: 'Create company success',
          description: '',
          status: 'success',
          duration: 2000,
        });

        setVisible(false, true);
      } else {
        toast({
          title: 'Create company failed',
          description: '',
          status: 'error',
          duration: 2000,
        });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [logo, name, website, address, phone]);

  return (
    <Modal
      size='4xl'
      isOpen={isVisible}
      onClose={() => setVisible(false, false)}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign='center'>Add new company</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className={styles.container}>
            <div className={styles.logoContainer}>
              <LogoUpload onUploaded={handleUploadedImage} logo={preview} />
            </div>
            <div className={styles.infoContainer}>
              <Text fontWeight='bold' mb={2}>
                Company name
              </Text>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Company's name"
                maxLength={100}
                mb={4}
              />

              <Text fontWeight='bold' mb={2}>
                Website
              </Text>
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder='https://company.com.vn'
                maxLength={100}
                mb={4}
              />

              <Text fontWeight='bold' mb={2}>
                Address
              </Text>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder='A3 Tokyo, JP'
                maxLength={100}
                mb={4}
              />

              <Text fontWeight='bold' mb={2}>
                Phone
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
          <Button onClick={handleAddCompany}>Add</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
