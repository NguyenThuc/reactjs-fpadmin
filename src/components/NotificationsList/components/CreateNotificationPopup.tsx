import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  Button,
  Input,
  Textarea,
  Flex,
  Image,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { Promise } from 'bluebird';
import { ImageUpload } from './ImageUpload';
import { toBase64 } from '../../../utils/toBase64';
import { createNotification } from '../../../services/apiRequests/notifications';
import CancelModalButton from '../../common/CancelModalButton';
import YellowButton from '../../common/YellowButton';

type Props = {
  isOpen: boolean;
  onClose: (closedAfterCreated: boolean) => void;
};

export const CreateNotificationPopup: FC<Props> = ({ isOpen, onClose }) => {
  const toast = useToast();
  const { user } = useSelector((state) => state.app);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [totalSize, setTotalSize] = useState(0);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!isOpen) {
      setImages([]);
      setTitle('');
      setContent('');
      setTotalSize(0);
      setStep(1);
    }
  }, [isOpen]);

  const handleUploadedImage = useCallback(
    async (files) => {
      if (images.length + files.length <= 15) {
        let addedImages: any[] = [];
        const promises = Promise.map(files, async (file) => {
          const { size, name } = file;
          if (size > 1000000 || totalSize + size > 1000000) {
            if (size > 1000000) {
              toast({
                title: `ファイル ${name} が大きすぎます。 最大サイズは 1MB です`,
                description: '',
                status: 'error',
                duration: 2000,
              });
            }

            if (totalSize + size > 1000000) {
              toast({
                title: '画像のサイズが大きすぎます。 最大合計サイズは 1MB です',
                description: '',
                status: 'error',
                duration: 2000,
              });
            }
          } else {
            const base64Image = await toBase64(file);

            setTotalSize(totalSize + size);

            addedImages = [...addedImages, { base64: base64Image, file }];
          }
        });

        await Promise.all(promises);

        setImages([...images, ...addedImages]);
      } else {
        toast({
          title: 'アップロードできる画像の最大数は 15 です',
          description: '',
          status: 'error',
        });
      }
    },
    [images]
  );

  const handleRemoveImage = (imageIndex: number) => {
    if (!isLoading) {
      const removedImage = images[imageIndex];
      if (removedImage) {
        const newImages = images.filter((img, index) => {
          return index !== imageIndex;
        });
        const newSize = totalSize - (removedImage?.file?.size || 0);
        setImages(newImages);
        setTotalSize(newSize);
      }
    }
  };

  const handleCreateNotification = useCallback(async () => {
    setLoading(true);
    setTotalSize(0);
    const result = await createNotification({
      title,
      content,
      creator: user.id,
      images,
    });
    setLoading(false);

    if (result && result.created_date) {
      onClose(true);
      toast({
        title: '通知の作成成功',
        description: '',
        status: 'success',
        duration: 2000,
      });
    } else {
      onClose(false);
      toast({
        title: '通知の作成に失敗しました',
        description: '',
        status: 'error',
        duration: 2000,
      });
    }
  }, [title, content, user, images, onClose]);

  const displayStep1 = () => {
    return (
      <>
        <Text
          color='table.headerColor'
          fontSize='14px'
          fontWeight='600'
          marginBottom='8px'
          as='label'
          for='name'
          cursor='pointer'
          display='block'
        >
          タイトル
        </Text>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='タイトルを入力'
          maxLength={100}
          marginBottom='24px'
          id='name'
        />
        <Text
          color='table.headerColor'
          fontSize='14px'
          fontWeight='600'
          marginBottom='8px'
          as='label'
          for='content'
          cursor='pointer'
          display='block'
        >
          内容
        </Text>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='内容を入力'
          id='content'
          height='280px'
          maxHeight='280px'
          marginBottom='16px'
        />
      </>
    );
  };

  const displayStep2 = () => {
    return (
      <div
        id='create-notification-images-container'
        style={{
          overflowY: 'auto',
          whiteSpace: 'nowrap',
        }}
      >
        <Text
          color='table.headerColor'
          fontSize='14px'
          fontWeight='600'
          marginBottom='8px'
          as='label'
          for='create-notification-img-upload'
          cursor='pointer'
          display='block'
        >
          写真
        </Text>
        <ImageUpload
          disabled={images.length === 15}
          onUploaded={handleUploadedImage}
        />
        {images.map((img, index) => {
          return (
            <div
              style={{
                marginTop: 24,
              }}
              key={index}
            >
              <Text
                color='table.headerColor'
                fontSize='14px'
                fontWeight='600'
                marginBottom='8px'
                cursor='pointer'
                display='block'
              >
                写真{index + 1}
              </Text>
              <Flex align='center'>
                <Image
                  style={{
                    height: '192px',
                    width: '192px',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                  src={img.base64}
                  alt=''
                />
                <Text
                  color='sidebar.background'
                  fontSize='14px'
                  fontWeight='500'
                  cursor='pointer'
                  display='block'
                  marginLeft='24px'
                  onClick={() => {
                    handleRemoveImage(index);
                  }}
                >
                  写真を削除する
                </Text>
              </Flex>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Modal
      scrollBehavior='inside'
      isOpen={isOpen}
      onClose={() => onClose(false)}
      blockScrollOnMount={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          fontSize='16px'
          color='table.dataColor'
          borderBottom='1px solid #C6D5EB'
        >
          {step === 1 ? 'おしらせを追加（1/2）' : 'おしらせを追加（2/2）'}
        </ModalHeader>

        <ModalBody mt={4}>
          <CancelModalButton />
          {step === 1 && displayStep1()}
          {step === 2 && displayStep2()}
        </ModalBody>
        <ModalFooter>
          <Flex style={{ width: '100%' }} justify='center'>
            {step === 1 && (
              <>
                <Button
                  disabled={isLoading}
                  onClick={onClose}
                  variant='outline'
                  borderRadius='36px'
                  color='table.headerColor'
                  fontSize='16px'
                  fontWeight='400'
                  marginRight='12px'
                >
                  キャンセル
                </Button>
                <YellowButton
                  disabled={isLoading}
                  onClick={() => {
                    setStep((curStep) => curStep + 1);
                  }}
                >
                  保存して写真追加へ進む
                </YellowButton>
              </>
            )}
            {step === 2 && (
              <>
                <Button
                  disabled={isLoading}
                  onClick={() => {
                    setStep((currStep) => currStep - 1);
                    setImages([]);
                    setTotalSize(0);
                  }}
                  variant='outline'
                  borderRadius='36px'
                  color='table.headerColor'
                  fontSize='16px'
                  fontWeight='400'
                  marginRight='12px'
                  width='134px'
                  borderColor='sidebar.selectedTextColor'
                >
                  戻る
                </Button>
                <YellowButton
                  disabled={isLoading}
                  onClick={handleCreateNotification}
                >
                  保存する
                </YellowButton>
              </>
            )}
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
