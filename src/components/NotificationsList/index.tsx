import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  Container,
  Heading,
  HStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Flex,
  Box,
  chakra,
} from '@chakra-ui/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AiOutlinePlus } from 'react-icons/ai';
import { useHistory } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

import {
  getListNotifications,
  getNotificationDetail,
  readNotification,
} from '../../services/apiRequests/notifications';

import { CreateNotificationPopup } from './components/CreateNotificationPopup';
import { NotificationDetailPopup } from './components/NotificaitonDetailPopup';
import { NewsSVG } from '../common/sidebarSVG/news';
import YellowButton from '../common/YellowButton';

export const NotificationsList: FC = () => {
  const [isOpenCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [isOpenDetailModal, setOpenDetailModal] = useState<boolean>(false);
  const [notifications, setNofications] = useState<any[]>([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const history = useHistory();

  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const getNotifications = useCallback(async () => {
    const data = await getListNotifications({ offset: 0 });

    setHasMore(!!data.next);
    setNofications(data.results);
    setLoading(false);
  }, []);

  const handleLoadMore = useCallback(async () => {
    const data = await getListNotifications({ offset: notifications.length });

    setHasMore(!!data.next);
    setNofications([...notifications, ...data.results]);
  }, [notifications]);

  const handleViewNotificationDetail = useCallback(async (notification) => {
    if (!notification.is_read) {
      await readNotification(notification.id);
      notification.is_read = true;
    }

    const data = await getNotificationDetail(notification.id);
    setSelectedNotification(data);
    setOpenDetailModal(true);
  }, []);

  useEffect(() => {
    setLoading(true);
    getNotifications();
  }, [getNotifications]);

  const tableHeaders = ['No.', 'タイトル', '内容', '画像', '作成日', ''];

  return (
    <Container maxW='container.xl' marginBottom='24px' padding='0'>
      <Box
        className='baseRoute_header'
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        marginBottom='24px'
      >
        <Box display='flex' alignItems='center' style={{ gap: '8px' }}>
          <NewsSVG height='24px' width='24px' color='#2E5FA3' />
          <Heading
            color='#0A1524'
            fontSize='22'
            fontWeight='600'
            textAlign='start'
          >
            おしらせ一覧
          </Heading>
        </Box>
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
      </Box>
      <Box
        padding='40px 48px'
        backgroundColor='white'
        boxShadow='0px 4px 10px rgba(0, 0, 0, 0.05)'
        borderRadius='10px'
      >
        <InfiniteScroll
          dataLength={notifications.length}
          next={handleLoadMore}
          scrollableTarget='scrollableDiv'
          hasMore={hasMore}
          loader={
            <Flex mt={6} mb={6} justify='center'>
              <Spinner />
            </Flex>
          }
        >
          <Table size='sm' variant='simple'>
            <Thead>
              <Tr>
                {tableHeaders.map((header) => {
                  return (
                    <Th
                      key={header}
                      color='#6F85A3'
                      fontStyle='normal'
                      fontWeight='300'
                      fontSize='12px'
                      lineHeight='100%'
                      paddingBottom='16px'
                      borderBottom='1px solid #E4E4E4'
                      borderColor='#E4E4E4'
                    >
                      {header}
                    </Th>
                  );
                })}
              </Tr>
            </Thead>

            <Tbody>
              {isLoading && (
                <Flex mt={6} mb={6}>
                  <Spinner />
                </Flex>
              )}
              {notifications.map((notification: any, index) => {
                return (
                  <Tr
                    key={index}
                    position='relative'
                    _hover={{ backgroundColor: 'blue.100', cursor: 'pointer' }}
                    onClick={() => {
                      history.push(`/notifications/${notification.id}`);
                    }}
                  >
                    <Td
                      borderBottom='1px solid #E4E4E4'
                      borderColor='#E4E4E4'
                      verticalAlign='top'
                      paddingY='24px'
                    >
                      {index + 1}
                    </Td>
                    <Td
                      borderBottom='1px solid #E4E4E4'
                      borderColor='#E4E4E4'
                      verticalAlign='top'
                      paddingY='24px'
                      maxWidth='200px'
                    >
                      <Box
                        display='flex'
                        flexDirection='row'
                        alignItems='flex-start'
                      >
                        <chakra.p
                          style={{
                            display: '-webkit-box',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontWeight: 'bold',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            color: `${
                              notification.is_read ? '#0A1524' : '#2E5FA3'
                            }`,
                            maxWidth: '200px',
                          }}
                        >
                          {notification.title}
                        </chakra.p>
                        {!notification.is_read ? (
                          <Box
                            display='inline-block'
                            padding='0px 6px'
                            backgroundColor='#3C7DD6'
                            borderRadius='5px'
                            width='32px'
                            fontSize='10px'
                            color='white'
                            marginLeft='8px'
                          >
                            未読
                          </Box>
                        ) : (
                          <></>
                        )}
                      </Box>
                    </Td>
                    <Td
                      borderBottom='1px solid #E4E4E4'
                      borderColor='#E4E4E4'
                      verticalAlign='top'
                      paddingY='24px'
                      style={{
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        maxWidth: 200,
                      }}
                    >
                      {notification.content}
                    </Td>
                    <Td
                      borderBottom='1px solid black'
                      borderColor='#E4E4E4'
                      verticalAlign='top'
                      paddingY='24px'
                    >
                      {notification.image ? (
                        <img
                          src={notification.image}
                          style={{
                            objectFit: 'cover',
                            height: 80,
                            width: 128,
                          }}
                          alt='cover'
                        />
                      ) : (
                        <div
                          style={{
                            height: 80,
                            width: 128,
                            background: '#dcdcdc',
                          }}
                        />
                      )}
                    </Td>
                    <Td
                      borderBottom='1px solid #E4E4E4'
                      borderColor='#E4E4E4'
                      verticalAlign='top'
                      paddingY='24px'
                    >
                      {notification.created_at}
                    </Td>
                    <Td
                      fontSize='24px'
                      fontWeight='500'
                      width='16px'
                      verticalAlign='top'
                      paddingY='24px'
                    >
                      <FiChevronRight
                        style={{
                          color: notification.is_read ? '#B3B3B3' : '#3C7DD6',
                        }}
                      />
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </InfiniteScroll>
      </Box>

      <CreateNotificationPopup
        isOpen={isOpenCreateModal}
        onClose={async (closedAfterCreated) => {
          setOpenCreateModal(false);
          if (closedAfterCreated) {
            setNofications([]);
            await getNotifications();
          }
        }}
      />
    </Container>
  );
};
