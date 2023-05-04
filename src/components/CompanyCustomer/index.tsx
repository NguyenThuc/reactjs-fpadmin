import { Box } from '@chakra-ui/layout';
import {
  Table,
  TableContainer,
  Thead,
  Tr,
  Td,
  Tbody,
  Th,
} from '@chakra-ui/table';
import { useDisclosure } from '@chakra-ui/hooks';
import { useToast, Button, Flex, Heading } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import {
  getCompanyCustomer,
  IGarbageCompany,
  createCompanyCustomer,
  updateCompanyCustomer,
  deleteCompanyCustomer,
} from '../../services/apiRequests/garbageCompany';
import { CreateCompanyCustomerModal } from './components/CreateCompanyCustomerModal';
import { CustomSpinner } from '../common/Spinner';
import { DeleteCustomerModal } from './components/DeleteCustomerModal';
import DeepBlueButton from '../common/DeepBlueButton';
import CustomCard from '../common/Card';

export const CompanyCustomer = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [garbageCompany, setGarbageCompany] = useState<Array<IGarbageCompany>>(
    []
  );
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenUpdate,
    onOpen: onOpenUpdate,
    onClose: onCloseUpdate,
  } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<IGarbageCompany | null>(
    null
  );

  const handleFetchCompanyCustomer = async () => {
    try {
      setLoading(true);
      const results = await getCompanyCustomer();
      if (results) {
        setGarbageCompany(results);
      } else {
        throw new Error('Get Garbage Company Failed');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: error.message,
        description: '',
        status: 'error',
        duration: 2000,
      });
    }
  };

  const handleCreateCompanyCustomer = async (
    body: Array<Omit<IGarbageCompany, 'id'>>,
    callback: Function,
    errorCallback: Function
  ) => {
    try {
      setLoading(true);
      const results = await createCompanyCustomer(body);
      setLoading(false);
      if (!results.error) {
        toast({
          title: '新しい顧客を追加しました',
          description: '',
          status: 'success',
          duration: 2000,
        });
        if (callback) {
          callback();
        }
        handleFetchCompanyCustomer();
      } else {
        if (errorCallback) {
          const { error } = results;
          errorCallback(error);
        }
        throw new Error('新しい顧客を追加できませんでした');
      }
    } catch (err) {
      setLoading(false);
      toast({
        title: err.message,
        description: '',
        status: 'error',
        duration: 2000,
      });
    }
  };

  const handleUpdateCompanyCustomer = async (
    id: string,
    body: Array<Omit<IGarbageCompany, 'id'>>,
    callback: Function,
    errorCallback: Function
  ) => {
    try {
      setLoading(true);
      const results = await updateCompanyCustomer(id, body);
      setLoading(false);
      if (!results.error) {
        toast({
          title: '顧客を編集しました',
          description: '',
          status: 'success',
          duration: 2000,
        });
        if (callback) {
          callback();
        }
        handleFetchCompanyCustomer();
      } else {
        if (errorCallback) {
          const { error } = results;
          errorCallback(error);
        }
        throw new Error('新しい顧客を追加できませんでした');
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: error.message,
        description: '',
        status: 'error',
        duration: 2000,
      });
    }
  };

  const handleDeleteCustomer = async (id: string, callback: Function) => {
    try {
      setLoading(true);
      const results = await deleteCompanyCustomer(id);
      setLoading(false);
      toast({
        title: '顧客を削除しました',
        description: '',
        status: 'success',
        duration: 2000,
      });
      if (callback) {
        callback();
      }
      handleFetchCompanyCustomer();
    } catch (error) {
      setLoading(false);
      toast({
        title: '顧客を削除できませんでした',
        description: '',
        status: 'error',
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    handleFetchCompanyCustomer();
  }, []);

  return (
    <div>
      <Flex justify='space-between' mb={4}>
        <Heading textAlign='start'>事業系 御客一覧</Heading>
      </Flex>
      {isLoading && <CustomSpinner />}
      <CustomCard>
        <Flex justify='end'>
          <DeepBlueButton textAlign='right' onClick={onOpen}>
            新しく追加する
          </DeepBlueButton>
        </Flex>

        <TableContainer>
          <Table variant='simple' colorScheme='gray'>
            <Thead borderBottom='1px solid #E4E4E4'>
              <Tr>
                <Th color='table.headerColor' fontSize='12px' fontWeight='600'>
                  ID
                </Th>
                <Th color='table.headerColor' fontSize='12px' fontWeight='600'>
                  Name
                </Th>
                <Th color='table.headerColor' fontSize='12px' fontWeight='600'>
                  Description
                </Th>
                <Th color='table.headerColor' fontSize='12px' fontWeight='600'>
                  操作
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {garbageCompany &&
                Array.isArray(garbageCompany) &&
                garbageCompany.map((companyInfo) => {
                  return (
                    <Tr key={companyInfo.id}>
                      <Td
                        color='table.dataColor'
                        fontSize='14px'
                        fontWeight='500'
                      >
                        {companyInfo?.id}
                      </Td>
                      <Td
                        color='table.dataColor'
                        fontSize='14px'
                        fontWeight='500'
                      >
                        {companyInfo?.name}
                      </Td>
                      <Td
                        color='table.dataColor'
                        fontSize='14px'
                        fontWeight='500'
                      >
                        {companyInfo?.description}
                      </Td>
                      <Td>
                        <Box>
                          <DeepBlueButton
                            mr={2}
                            onClick={() => {
                              setSelectedItem(companyInfo);
                              onOpenUpdate();
                            }}
                          >
                            編集
                          </DeepBlueButton>
                          <Button
                            variant='outline'
                            onClick={() => {
                              setSelectedItem(companyInfo);
                              onOpenDelete();
                            }}
                          >
                            削除
                          </Button>
                        </Box>
                      </Td>
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </TableContainer>
      </CustomCard>
      <CreateCompanyCustomerModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleCreateCompanyCustomer}
      />
      {selectedItem && (
        <CreateCompanyCustomerModal
          isOpen={isOpenUpdate}
          onClose={() => {
            setSelectedItem(null);
            onCloseUpdate();
          }}
          companyDetails={selectedItem}
          onSubmit={handleUpdateCompanyCustomer}
        />
      )}
      <DeleteCustomerModal
        isOpen={isOpenDelete}
        onClose={() => {
          setSelectedItem(null);
          onCloseDelete();
        }}
        companyDetails={selectedItem}
        onSubmit={handleDeleteCustomer}
      />
    </div>
  );
};
