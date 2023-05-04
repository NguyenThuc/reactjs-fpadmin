import React, { FC, useCallback, useState, useEffect } from 'react';
import {
  Container,
  Heading,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Flex,
  Box,
} from '@chakra-ui/react';
import { AiOutlineClockCircle } from 'react-icons/ai';
import {
  getListBaseRouteHistory,
  readHistory,
} from '../../services/apiRequests/history';
import InfiniteScroll from 'react-infinite-scroll-component';
import CustomCard from '../common/Card';
import { CustomTh } from '../common/CustomTh';
import { CustomTr } from '../common/CustomTr';
import { CustomTd } from '../common/CustomTd';

type Props = {};

export const HistoryList: FC<Props> = ({}) => {
  const [histories, setHistories] = useState<any[]>([]);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const getHistories = useCallback(async () => {
    const data = await getListBaseRouteHistory({ offset: 0 });
    setHasMore(!!data.next);
    setHistories(data.results);
    setLoading(false);
  }, []);

  const handleLoadMore = useCallback(async () => {
    const data = await getListBaseRouteHistory({ offset: histories.length });

    setHasMore(!!data.next);
    setHistories([...histories, ...data.results]);
  }, [histories]);

  const handleReadHistory = useCallback(
    async (history) => {
      if (!history.is_read) {
        await readHistory(history.id);
        history.is_read = true;
      }

      setSelectedHistory(selectedHistory?.id === history.id ? null : history);
    },
    [selectedHistory]
  );

  useEffect(() => {
    setLoading(true);
    getHistories();
  }, [getHistories]);

  return (
    <Container maxW='container.xl' padding='0' marginBottom='24px'>
      <HStack marginBottom={5} justifyContent='space-between'>
        <Flex align='center' justify='center'>
          <AiOutlineClockCircle
            color='#2E5FA3'
            fontSize='26px'
            style={{ marginRight: 8 }}
          />
          <Heading
            textAlign='start'
            fontSize='22px'
            lineHeight='1'
            color='table.dataColor'
          >
            変更履歴
          </Heading>
        </Flex>
      </HStack>
      <CustomCard marginBottom='20px'>
        <InfiniteScroll
          dataLength={histories.length}
          next={handleLoadMore}
          hasMore={hasMore}
          scrollableTarget='scrollableDiv'
          loader={
            <Flex mt={6} mb={6} justify='center'>
              <Spinner />
            </Flex>
          }
        >
          <Table size='sm' variant='simple' colorScheme='gray'>
            <Thead>
              <Tr>
                <CustomTh>No.</CustomTh>
                <CustomTh>ルート名</CustomTh>
                <CustomTh>タイプ</CustomTh>
                <CustomTh>ユーザー名</CustomTh>
                <CustomTh>変更日</CustomTh>
              </Tr>
            </Thead>

            <Tbody>
              {isLoading && (
                <Flex mt={6} mb={6}>
                  <Spinner />
                </Flex>
              )}
              {histories.map((history: any, index) => {
                return (
                  <CustomTr
                    key={index}
                    position='relative'
                    // backgroundColor={
                    //   // eslint-disable-next-line no-nested-ternary
                    //   !history.is_read
                    //     ? '#f3f3f3'
                    //     : selectedHistory?.id === history.id
                    //     ? 'blue.100'
                    //     : '#fff'
                    // }
                    // _hover={{ backgroundColor: 'blue.100', cursor: 'pointer' }}
                    onClick={() => handleReadHistory(history)}
                    color={
                      !history.is_read
                        ? 'sidebar.background'
                        : 'table.dataColor'
                    }
                  >
                    <CustomTd>{index + 1}</CustomTd>
                    <CustomTd>
                      {history.route_name}
                      {!history.is_read ? (
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
                    </CustomTd>
                    <CustomTd>{history.type}</CustomTd>
                    <CustomTd>{history.username}</CustomTd>
                    <CustomTd>{history.datetime}</CustomTd>
                  </CustomTr>
                );
              })}
            </Tbody>
          </Table>
        </InfiniteScroll>
      </CustomCard>
    </Container>
  );
};
