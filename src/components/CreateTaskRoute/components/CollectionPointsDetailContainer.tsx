import {
  useToast,
  Spinner,
  Flex,
  Grid,
  GridItem,
  Box,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { TASK_COLLECTION_POINT_URL } from '../../../constants/urls';
import { hirouAxios } from '../../../services/httpInstance';
import moment from 'moment';
import '../styles.css';

import { ITaskCollectionPoint } from '../../../models/taskCollectionPoint';

import bookOutline from '../../../assets/book-outline.png';
import bottleOutline from '../../../assets/bottle-outline.png';
import boxOutline from '../../../assets/box-outline.png';
import canOutline from '../../../assets/can-outline.png';
import chemistryOutline from '../../../assets/chemistry-outline.png';
import fabricOutline from '../../../assets/fabric-outline.png';
import milkbottleOutline from '../../../assets/milkbottle-outline.png';
import newspaperOutline from '../../../assets/newspaper-outline.png';
import {
  AiFillCheckCircle,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineLeft,
} from 'react-icons/ai';
import { TYPE_BASE, TYPE_COMPANY } from '../../../constants/strings';
import { CustomSpinner } from '../../common/Spinner';
import { CompanyWeightModal } from './CompanyWeightModal';

const assets = {
  雑誌: {
    icon: bookOutline,
    color: '#3FB96D',
  },
  新聞紙: {
    icon: newspaperOutline,
    color: '#9BEB5E',
  },
  牛乳パック: {
    icon: milkbottleOutline,
    color: '#5DBBE8',
  },
  'びん・缶・乾電池': {
    icon: canOutline,
    color: '#F4CC61',
  },
  古布: {
    icon: fabricOutline,
    color: '#FD7A49',
  },
  し尿: {
    icon: chemistryOutline,
    color: '#AA62D8',
  },
  ペットボトル: {
    icon: bottleOutline,
    color: '#4980CE',
  },
  ダンボール: {
    icon: boxOutline,
    color: '#5ED1B8',
  },
};

type Props = {
  tcp: ITaskCollectionPoint | null;
  toggleAllTasksLocal: (state1: any, state2: any) => void;
  onToggleTask: (
    state1: any,
    state2: any,
    callback: any,
    weight?: any | undefined
  ) => void;
  isLoading: boolean;
};

const styles = {
  container: {
    width: '100%',
    zIndex: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    maxHeight: '100%',
    overflow: 'auto',
    // return {
    //   // position: 'absolute',
    //   // bottom: 10,
    //   // left: 10,
    //   // right: 10,
    //   // eslint-disable-next-line no-nested-ternary
    //   // height: isCloseCpDetail ? 'auto' : isExpandCpDetail ? '50vh' : '27vh',
    //   // maxHeight: isExpandCpDetail ? 500 : 300,
    // };
  },
};

const GarbageItem = ({
  text,
  color,
  isActive,
  onToggleTask,
  onToggleTaskCompany,
  baseRoute,
  baseRoutePoint,
  taskDone,
}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (baseRoute?.type === TYPE_COMPANY && !baseRoutePoint?.complete) {
      onToggleTaskCompany();
    } else {
      setLoading(true);
      onToggleTask(() => {
        setLoading(false);
      });
    }
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: '76px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
      }}
    >
      {loading && (
        <CustomSpinner
          style={{
            position: 'absolute',
          }}
        />
      )}
      <div
        onClick={handleClick}
        className='collection_point_button'
        style={{
          borderRadius: 4,
          backgroundColor: '#FFFFFF',
          width: '100%',
          height: '100%',
          maxWidth: 200,
          padding: 8,
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            flex: 1,
            fontSize: 12,
            fontWeight: 'bold',
            color: isActive ? '#B3B3B3' : color,
            textAlign: 'left',
            textOverflow: 'ellipsis',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              width: '100px',
              maxWidth: '100px',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              wordBreak: 'keep-all',
              whiteSpace: 'nowrap',
              wordWrap: 'normal',
            }}
          >
            {text}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: '#B3B3B3',
              fontWeight: 300,
            }}
          >
            {`${taskDone?.complete || 0}/${taskDone?.total || 0}`}
          </div>
          {baseRoute?.type === TYPE_COMPANY && (
            <div
              style={{
                fontSize: '12px',
                color: '#B3B3B3',
                fontWeight: 300,
              }}
            >
              {`${parseFloat(baseRoutePoint?.weight || 0)}kg`}
            </div>
          )}
        </div>
        <div>
          <AiFillCheckCircle size={24} color={isActive ? '#B3B3B3' : color} />
        </div>
      </div>
    </div>
  );
};

export const CollectionPointsDetailContainer: FC<Props> = ({
  tcp,
  onToggleTask,
  toggleAllTasksLocal,
  isLoading,
  isCloseCpDetail,
  setExpandCpDetail,
  isExpandCpDetail,
  setSelectedPointDetail,
  baseRoute,
  listTaskDone,
}) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const {
    isOpen: isOpenCompany,
    onOpen: onOpenCompany,
    onClose: onCloseCompany,
  } = useDisclosure();
  const [selectedCompanyPoint, setSelectedCompanyPoint] = useState(null);

  const onToggleAllTasks = async () => {
    try {
      setLoading(true);
      const url = `${TASK_COLLECTION_POINT_URL}${tcp?.id}/bulk_complete/`;
      const data = await hirouAxios.post(url, {});
      toggleAllTasksLocal(data?.data, tcp?.id);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast({
        title: 'Error updating collection',
        description: 'もう一度お試しください',
        status: 'error',
      });
    }
  };

  const handleGoBack = () => {
    setSelectedPointDetail(null);
  };

  const baseRouteType = baseRoute?.type;

  return (
    <div style={styles.container}>
      <div
        style={{
          flex: 1,
          height: '100%',
          maxWidth: '400px',
          maxHeight: '100%',
          display: 'block',
          background: '#fff',
          boxSizing: 'border-box',
        }}
      >
        {isLoading ? (
          <Spinner alignSelf='center' />
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              position: 'relative',
            }}
          >
            {loading && <CustomSpinner style={{ position: 'absolute' }} />}
            <Flex
              style={{
                fontSize: 14,
                color: '#B3B3B3',
                width: '100%',
                height: 60,
              }}
              align='center'
              maxWidth='400px'
              overflow='hidden'
              whiteSpace='nowrap'
              textOverflow='ellipsis'
              padding='0px 24px 0px 24px'
              justify='space-between'
            >
              <Button
                size='xs'
                borderRadius='50%'
                width='24px'
                height='24px'
                padding='0px'
                variant='link'
                onClick={handleGoBack}
              >
                <AiOutlineLeft color='black' size='18' />
              </Button>
              <Box
                overflow='hidden'
                whiteSpace='nowrap'
                textOverflow='ellipsis'
                width='150px'
                maxWidth='150px'
                flexGrow='1'
                textAlign='center'
              >
                {tcp && tcp?.name}
              </Box>
              <Box width='24px' height='24px'></Box>
            </Flex>

            {/* <div
              onClick={() => {
                if (isCloseCpDetail) {
                  return;
                }

                setExpandCpDetail(!isExpandCpDetail);
              }}
              // className='opacity_button_hover'
              style={{ padding: '4px 40%', cursor: 'pointer' }}
            >
              <Divider
                background='#dcdcdc'
                opacity={1}
                height={1}
                borderRadius={8}
              />
            </div> */}
            {!isCloseCpDetail && !tcp && (
              <div style={{ marginTop: 16, fontWeight: 'bold', fontSize: 18 }}>
                Collection point data is empty
              </div>
            )}
            {!isCloseCpDetail && tcp && (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '24px',
                  backgroundColor: '#F3F5F9',
                  height: '100%',
                }}
              >
                {/* {tcp?.image ? (
                  <div
                    style={{
                      height: '20vh',
                      width: '20vh',
                      maxHeight: 234,
                      maxWidth: 234,
                      borderRadius: 8,
                      backgroundImage: `url(${tcp?.image})`,
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                      borderWidth: 1,
                      borderColor: '#dcdcdc',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: '20vh',
                      width: '20vh',
                      maxHeight: 234,
                      maxWidth: 234,
                      borderRadius: 8,
                      background: '#f3f3f3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FaMapMarkedAlt fontSize={50} color='#dcdcdc' />
                  </div>
                )} */}
                <div
                  style={{
                    flex: 1,
                    height: '100%',
                    paddingRight: 0,
                    display: 'flex',
                    alignItems: 'flex-start',
                    flexDirection: 'column',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      flex: 1,
                      display: 'block',
                    }}
                  >
                    <Grid
                      style={{
                        width: '100%',
                      }}
                      rowGap='4px'
                      columnGap='4px'
                      templateColumns='repeat(2, 1fr)'
                    >
                      {tcp?.task_collection.map((e, i) => {
                        const garbageItem =
                          baseRouteType &&
                          (baseRouteType === TYPE_BASE
                            ? e?.garbage
                            : e?.route_garbage);
                        return (
                          <>
                            <GarbageItem
                              icon={assets[garbageItem?.name]?.icon}
                              text={garbageItem?.name}
                              color={assets[garbageItem?.name]?.color}
                              isActive={e?.complete}
                              onToggleTask={(
                                callback: Function | undefined
                              ) => {
                                onToggleTask(e, tcp?.id, callback);
                              }}
                              key={e.id}
                              onToggleTaskCompany={() => {
                                setSelectedCompanyPoint(e);
                                onOpenCompany();
                              }}
                              baseRoute={baseRoute}
                              baseRoutePoint={e}
                              taskDone={listTaskDone[garbageItem?.id]}
                            />
                          </>
                        );
                      })}
                    </Grid>
                    {baseRoute?.type === TYPE_BASE && (
                      <div
                        className='collection_point_button'
                        onClick={onToggleAllTasks}
                        style={{
                          marginTop: '24px',
                          width: '100%',
                          fontSize: 14,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#2E5FA3',
                        }}
                      >
                        <AiOutlineCheckCircle style={{ marginRight: 10 }} />{' '}
                        すべてをチェック
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div
              className='cps_list-container'
              style={{ width: '100%', padding: '24px' }}
            >
              {tcp?.image && (
                <Flex justify='center' marginBottom='32px'>
                  <Box width='198px' height='198px'>
                    <img
                      src={tcp?.image}
                      alt={tcp?.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                      onError={(e) => {
                        if (e?.target) {
                          const container = e.target.closest('div');
                          container.style.display = 'none';
                        }
                      }}
                    />
                  </Box>
                </Flex>
              )}
              <Flex
                align='center'
                fontSize='16px'
                height='32px'
                fontWeight='600'
                textAlign='left'
              >
                <AiOutlineClockCircle
                  size='18'
                  color='#2E5FA3'
                  style={{
                    marginRight: '8px',
                  }}
                />
                収集履歴
              </Flex>
              <Grid templateColumns='1fr 1fr 1fr' width='100%'>
                <GridItem
                  height='40px'
                  borderBottom='1px solid #E4E4E4'
                  padding='4px'
                ></GridItem>
                <GridItem
                  fontSize='12px'
                  height='40px'
                  borderBottom='1px solid #E4E4E4'
                  padding='4px'
                >
                  <Flex
                    justify='flex-start'
                    align='center'
                    height='100%'
                    color='table.headerColor'
                  >
                    収集時間
                  </Flex>
                </GridItem>
                <GridItem
                  fontSize='12px'
                  height='40px'
                  borderBottom='1px solid #E4E4E4'
                  padding='4px'
                >
                  <Flex
                    justify='flex-start'
                    align='center'
                    height='100%'
                    color='table.headerColor'
                  >
                    収集ユーザー
                  </Flex>
                </GridItem>
                {tcp?.task_collection.map((e, i) => {
                  const garbageItem =
                    baseRouteType &&
                    (baseRouteType === TYPE_BASE
                      ? e?.garbage
                      : e?.route_garbage);
                  return (
                    <React.Fragment key={e?.id}>
                      <GridItem padding='4px' borderBottom='1px solid #E4E4E4'>
                        <Flex
                          style={{
                            textAlign: 'left',
                            fontSize: 14,
                            fontWeight: 'bold',
                          }}
                          justify='start'
                          align='center'
                          height='100%'
                        >
                          {garbageItem?.name}
                        </Flex>
                      </GridItem>
                      <GridItem padding='4px' borderBottom='1px solid #E4E4E4'>
                        <Flex
                          style={{ fontSize: 14, textAlign: 'left' }}
                          justify='start'
                          align='center'
                          height='100%'
                        >
                          {e?.timestamp
                            ? moment(e?.timestamp).format('YYYY-MM-DD HH:mm')
                            : '無し'}
                        </Flex>
                      </GridItem>
                      <GridItem padding='4px' borderBottom='1px solid #E4E4E4'>
                        <Flex
                          style={{ fontSize: 14, textAlign: 'left' }}
                          justify='start'
                          align='center'
                          height='100%'
                        >
                          {e?.users?.username || '無し'}
                        </Flex>
                      </GridItem>
                    </React.Fragment>
                  );
                })}
              </Grid>
              {selectedCompanyPoint && (
                <CompanyWeightModal
                  isOpen={isOpenCompany}
                  onClose={() => {
                    setLoading(false);
                    setSelectedCompanyPoint(null);
                    onCloseCompany();
                  }}
                  setLoading={setLoading}
                  loading={loading}
                  pointDetails={selectedCompanyPoint}
                  onSubmit={(
                    callback: Function | undefined,
                    weight: string
                  ) => {
                    onToggleTask(
                      selectedCompanyPoint,
                      tcp?.id,
                      callback,
                      weight
                    );
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
