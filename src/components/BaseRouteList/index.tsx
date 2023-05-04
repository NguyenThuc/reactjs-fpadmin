import React, { useState, useEffect } from 'react';
import {
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Spinner,
  Button,
  useToast,
  TableCellProps,
  ButtonProps,
  Flex,
  Box,
  chakra,
} from '@chakra-ui/react';
import style from './styles.module.css';
import { handleFetchBaseRoute } from '../../store/thunks/BaseRoute';
import { IBaseRoute } from '../../models/baseRoute';
import { _baseRoute } from '../../store/selectors/BaseRoute';
import { useSelector } from 'react-redux';
import { IGarbage } from '../../models/garbage';
import { MdDeleteForever, MdEdit } from 'react-icons/md';
import { CreateBaseRouteModal } from './components/CreateBaseRouteModal';
import { BaseRouteDeleteConfirmationModal } from './components/BaseRouteDeleteConfirmationModal';
import { deleteBaseRoute } from '../../services/apiRequests/baseRoute';
import { navigate } from '../../services/navigation';
import { RouteSVG } from '../common/sidebarSVG/route';
import { CreateNewBaseRouteModal } from './components/CreateNewBaseRouteModal';

export const BaseRouteList = () => {
  const baseRoutesData: any = useSelector(_baseRoute);
  const [isCreateRouteModalOpen, setCreateRouteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<IBaseRoute | null>(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const cancelRef = React.useRef();
  const toast = useToast();

  const [searchKey, setSearchKey] = useState<string>('');
  const [initBaseRoutes, setInitBaseRoutes] = useState([]);
  const [baseRoutes, setBaseRoutes] = useState([]);

  useEffect(() => {
    setBaseRoutes(baseRoutesData?.data || []);
    setInitBaseRoutes(baseRoutesData?.data || []);
  }, [baseRoutesData]);

  useEffect(() => {
    handleFetchBaseRoute();
  }, []);

  const selectBaseRoute = (baseRouteId: number) => navigate(`${baseRouteId}`);

  const getRouteFromId = (baseRouteId: number) =>
    baseRoutesData.data.find(
      (baseRoute: IBaseRoute) => baseRoute.id === baseRouteId
    );

  const onDeleteIconClicked = (baseRouteId: number) => {
    const _baseRoute = getRouteFromId(baseRouteId);
    if (_baseRoute) {
      setSelectedRoute(_baseRoute);
      setIsDeleteModalOpen(true);
    }
  };

  const onDelete = async () => {
    if (selectedRoute !== null) {
      try {
        await deleteBaseRoute(selectedRoute.id);
        handleFetchBaseRoute();
        toast({
          title: 'ベースルートを削除しました',
          description: '',
        });
      } catch {
        toast({
          title: 'ベースルート削除中にエラーが発生しました。',
          description: 'もう一度お試しください',
          status: 'error',
        });
      }
    }
    onDeleteModalClose();
  };

  const onDeleteModalClose = () => {
    setSelectedRoute(null);
    setIsDeleteModalOpen(false);
  };

  const onEditIconClicked = (baseRouteId: number) => {
    const _baseRoute = getRouteFromId(baseRouteId);
    if (_baseRoute) {
      setSelectedRoute(_baseRoute);
      setCreateRouteModalOpen(true);
    }
  };

  const onEditModalClose = () => {
    setSelectedRoute(null);
    setCreateRouteModalOpen(false);
  };

  const listOfTableHeaders = ['No.', 'Id', 'ルート名', '品目', '顧客', '操作'];

  const tableDataStyles = (isEmphasized?: boolean): TableCellProps => {
    return {
      fontWeight: isEmphasized ? 600 : 300,
      fontSize: '14px',
      color: '#0A1524',
    };
  };

  const actionButtonStyles = (colorScheme: 'blue' | 'white'): ButtonProps => ({
    fontSize: '14px',
    fontWeight: 600,
    color: colorScheme === 'white' ? '#6F85A3' : 'white',
    padding: '8px 16px',
    border: colorScheme === 'white' ? '1px solid #C6D5EB' : 'none',
    backgroundColor: colorScheme === 'white' ? 'white' : '',
    minWidth: '80px',
  });

  let content = <Spinner />;
  if (baseRoutesData.isLoaded) {
    content = (
      <Table size='sm' variant='simple'>
        <Thead>
          <Tr>
            {listOfTableHeaders.map((tableHeader) => {
              return (
                <Th
                  key={tableHeader}
                  color='#6F85A3'
                  fontStyle='normal'
                  fontWeight='300'
                  fontSize='12px'
                  lineHeight='100%'
                  paddingBottom='16px'
                >
                  {tableHeader}
                </Th>
              );
            })}
          </Tr>
        </Thead>
        <Tbody>
          {baseRoutes.map((baseRoute: IBaseRoute, idx: number) => (
            <Tr
              key={baseRoute.id}
              _hover={{ backgroundColor: 'blue.100', cursor: 'pointer' }}
              onClick={() => selectBaseRoute(baseRoute.id)}
            >
              <Td {...tableDataStyles()}>{idx + 1}</Td>
              <Td {...tableDataStyles()}>{baseRoute.id}</Td>
              <Td {...tableDataStyles(true)}>{baseRoute.name}</Td>
              <Td {...tableDataStyles()}>
                {baseRoute.garbage
                  .map((_garbage: IGarbage) => _garbage.name)
                  .join(', ')}
              </Td>
              <Td {...tableDataStyles()}>{baseRoute.customer?.name ?? '--'}</Td>
              <Td>
                <HStack>
                  <Button
                    colorScheme='blue'
                    onClick={(e: any) => {
                      e.stopPropagation();
                      onEditIconClicked(baseRoute.id);
                    }}
                    {...actionButtonStyles('blue')}
                  >
                    編集
                  </Button>

                  <Button
                    variant='outline'
                    colorScheme='blue'
                    onClick={(e: any) => {
                      e.stopPropagation();
                      onDeleteIconClicked(baseRoute.id);
                    }}
                    {...actionButtonStyles('white')}
                  >
                    削除
                  </Button>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
  }

  const onOpen = () => {
    // setSelectedRoute(null);
    // setCreateRouteModalOpen(true);
    setOpenCreateModal(true);
  };

  return (
    <Container maxW='container.xl' padding={0} paddingBottom='20px'>
      <Box
        className={style.baseRoute_header}
        display='flex'
        alignItems='center'
        style={{ gap: '8px' }}
      >
        <RouteSVG />
        <Heading
          color='#0A1524'
          fontSize='22'
          fontWeight='600'
          textAlign='start'
        >
          ルート一覧
        </Heading>
      </Box>
      <HStack marginBottom={5} justifyContent='space-between' marginTop='32px'>
        <Flex width='50%'>
          <div className={style.baseRoute_searchBar}>
            <input
              className={style.baseRoute_searchBar_input}
              value={searchKey}
              placeholder='拠点ルート検索'
              onChange={(e) => {
                setSearchKey(e.target.value);
                const keyword = e.target.value.toLocaleLowerCase();

                setTimeout(() => {
                  if (keyword) {
                    const filteredBaseRoutes = initBaseRoutes.filter(
                      (baseRoute: any) => {
                        const customerName = baseRoute.customer?.name
                          ? baseRoute.customer?.name.toLowerCase()
                          : null;
                        const customerDescription = baseRoute.customer
                          ?.description
                          ? baseRoute.customer?.description.toLowerCase()
                          : null;
                        const baseRouteName = baseRoute.name.toLowerCase();

                        return (
                          baseRouteName.includes(keyword) ||
                          customerDescription?.includes(keyword) ||
                          customerName?.includes(keyword)
                        );
                      }
                    );

                    setBaseRoutes(filteredBaseRoutes);
                  } else {
                    setBaseRoutes(baseRoutesData.data);
                  }
                }, 300);
              }}
            />
          </div>
          <chakra.button
            width='100px'
            height='45px'
            backgroundColor='#2E5FA3'
            borderRadius='0px 10px 10px 0px'
            fontSize='13px'
            color='white'
          >
            絞り込む
          </chakra.button>
        </Flex>
        <Button
          onClick={onOpen}
          background='linear-gradient(274.1deg, #D1992F 0%, #CED12F 100%)'
          boxShadow='8px 8px 24px rgba(15, 124, 182, 0.3)'
          borderRadius='36px'
          width='239px'
          height='52px'
          fontSize='13px'
          fontWeight='400'
          variant='unstyled'
          color='white'
        >
          新規作成
        </Button>
        <CreateBaseRouteModal
          baseRoute={selectedRoute}
          isOpen={isCreateRouteModalOpen}
          onClose={onEditModalClose}
        />
        {openCreateModal && (
          <CreateNewBaseRouteModal
            isOpen={openCreateModal}
            onClose={() => {
              setOpenCreateModal(false);
            }}
          />
        )}
      </HStack>
      <div className={style['baseRoute-table-wrapper']}>{content}</div>
      <BaseRouteDeleteConfirmationModal
        onAccept={onDelete}
        cancelRef={cancelRef}
        onCancel={onDeleteModalClose}
        isOpen={isDeleteModalOpen}
      />
    </Container>
  );
};
