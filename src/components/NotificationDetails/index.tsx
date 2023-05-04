import React, { FC, useEffect, useState } from 'react';
import {
  Flex,
  Box,
  Text,
  Heading,
} from '@chakra-ui/react';
import { AiFillFileImage, AiOutlinePlus } from 'react-icons/ai';
import moment from 'moment';
import { useParams } from 'react-router';
import { getNotificationDetail } from '../../services/apiRequests/notifications';
import CustomCard from '../common/Card';
import { NewsSVG } from '../common/sidebarSVG/news';
import YellowButton from '../common/YellowButton';
import { Link } from 'react-router-dom';
import { CreateNotificationPopup } from '../NotificationsList/components/CreateNotificationPopup';
import { CustomSpinner } from '../common/Spinner';

type IData = {
  images: string[];
  title: string;
  content: string;
  created_date: string;
  creator: string;
};

type Params = {
  id: string;
};

type NotiDetails = {
  id?: string;
  content?: string;
  created_at?: string;
  created_date?: string;
  creator?: string;
  images?: Array<string>;
  title?: string;
};

export const NotificationDetails = () => {
  const params: Params = useParams();
  const [details, setDetails] = useState<NotiDetails>({});
  const [loading, setLoading] = useState(false);
  const [isOpenCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState(0);

  useEffect(() => {
    const handleFetchNotiDetails = async () => {
      try {
        setLoading(true);
        const results = await getNotificationDetail(params.id);
        setDetails(results);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    handleFetchNotiDetails();
  }, [params.id]);

  // useEffect(() => {
  //   if (isOpen) {
  //     setPreviewImage(0);
  //   }
  // }, [isOpen, data]);

  return (
    <Box width='100%'>
      {loading && <CustomSpinner />}
      <Flex marginBottom='24px' width='100%' justify='space-between'>
        <Flex align='center'>
          <NewsSVG height='24px' width='24px' color='#2E5FA3' />
          <Heading
            color='#0A1524'
            fontSize='22'
            fontWeight='600'
            textAlign='start'
            marginLeft='12px'
          >
            おしらせ一覧
          </Heading>
        </Flex>
        <YellowButton onClick={() => setOpenCreateModal(true)}>
          <Flex align='center' justify='center'>
            新規作成{' '}
            <AiOutlinePlus
              style={{
                fill: 'white',
                width: 20,
                height: 20,
                marginLeft: 8,
              }}
            />
          </Flex>
        </YellowButton>
      </Flex>
      <Box
        color='sidebar.background'
        fontSize='12px'
        textAlign='left'
        marginBottom='24px'
        fontWeight='500'
      >
        <Link to='/notifications/list'>おしらせ一覧に戻る</Link>
      </Box>
      <CustomCard marginBottom='20px'>
        <Flex
          align='center'
          justify='space-between'
          marginBottom='24px'
          paddingBottom='24px'
          borderBottom='1px solid #E4E4E4'
        >
          <Text fontWeight='bold' fontSize='2xl'>
            {details?.title}
          </Text>
          <Text color='gray' fontSize='xs'>
            作成日:{' '}
            {details?.created_date
              ? moment(details.created_date, 'YYYY-MM-DD').format(
                  'YYYY-MM-DD HH:mm'
                )
              : ''}
          </Text>
        </Flex>
        <Flex mb={10}>
          <Box>
            {details?.images?.[0] ? (
              <div
                style={{
                  width: 320,
                  height: 320,
                  minWidth: 320,
                  minHeight: 320,
                  marginBottom: 24,
                  marginRight: 32,
                }}
              >
                <div
                  style={{
                    backgroundImage: `url(${details?.images?.[previewImage]})`,
                    height: '100%',
                    width: '100%',
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
                  minWidth: 320,
                  minHeight: 320,
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
            {!!details?.images?.length && (
              <div
                style={{
                  width: 320,
                  minWidth: 320,
                  maxWidth: 320,
                  overflowX: 'auto'
                }}
              >
                <div
                  style={{
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    flexWrap: 'nowrap',
                  }}
                >
                  {details?.images?.map((image, index) => {
                    return (
                      <div
                        onClick={() => setPreviewImage(index)}
                        style={{
                          display: 'block',
                          marginRight: 8,
                          borderRadius: 8,
                          borderWidth: index === previewImage ? 4 : 0,
                          borderColor: '#3C7DD6',
                          cursor: 'pointer',
                          width: 96,
                          height: 96,
                          minWidth: 96
                        }}
                      >
                        <div
                          style={{
                            backgroundImage: `url(${image})`,
                            height: '100%',
                            width: '100%',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Box>
          <Box
            style={{
              flex: 1,
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              maxHeight: '950px',
            }}
          >
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <Text fontSize='sm'>{details?.content}</Text>
            </div>
          </Box>
        </Flex>
      </CustomCard>
      <CreateNotificationPopup
        isOpen={isOpenCreateModal}
        onClose={async (closedAfterCreated) => {
          setOpenCreateModal(false);
        }}
      />
    </Box>
  );
};
