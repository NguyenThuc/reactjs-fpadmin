import React, { FC, useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  Flex,
  Box,
  Text,
  Divider,
} from '@chakra-ui/react';
import { AiFillFileImage } from 'react-icons/ai';
import moment from 'moment';

type IData = {
  images: string[];
  title: string;
  content: string;
  created_date: string;
  creator: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: IData | null;
};

export const NotificationDetailPopup: FC<Props> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [previewImage, setPreviewImage] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setPreviewImage(0);
    }
  }, [isOpen, data]);

  return (
    <Modal size='2xl' isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader />

        <ModalBody mt={4}>
          <ModalCloseButton />
          <Flex mb={10}>
            <Box style={{ flex: 1, height: 300 }}>
              {data?.images[0] ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    height: 240,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      backgroundImage: `url(${data?.images[previewImage]})`,
                      height: 240,
                      width: 240,
                      borderRadius: 8,
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    height: '100%',
                    width: '100%',
                    background: '#f3f3f3',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AiFillFileImage size={50} color='#dcdcdc' />
                </div>
              )}
              {!!data?.images.length && (
                <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                  {data?.images.map((image, index) => {
                    return (
                      <div
                        onClick={() => setPreviewImage(index)}
                        style={{
                          display: 'inline-block',
                          marginRight: 8,
                          borderRadius: 8,
                          borderWidth: index === previewImage ? 1 : 0,
                          borderColor: '#2B6CB0',
                          cursor: 'pointer',
                        }}
                      >
                        <div
                          style={{
                            backgroundImage: `url(${image})`,
                            height: 50,
                            width: 50,
                            borderRadius: 8,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </Box>
            <Box
              ml={6}
              style={{
                flex: 1,
                height: 300,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Text fontWeight='bold' fontSize='2xl'>
                {data?.title}
              </Text>
              <Text color='gray' fontSize='xs'>
                作成日:{' '}
                {data?.created_date
                  ? moment(data.created_date, 'YYYY-MM-DD').format(
                      'YYYY-MM-DD HH:mm'
                    )
                  : ''}
              </Text>
              <Divider mt={3} mb={3} />
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <Text fontSize='sm'>{data?.content}</Text>
              </div>
              <Divider />
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
