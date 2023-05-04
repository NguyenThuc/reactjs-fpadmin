import React, { useState, useCallback, useEffect } from 'react';
import {
  Container,
  Heading,
  HStack,
  Spinner,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
} from '@chakra-ui/react';

import { getCustomers } from '../../services/apiRequests/customers';

import { AddCustomerModal } from './components/AddCustomerModal';
import { DeleteCustomerModal } from './components/DeleteCustomerModal';
import { EditCustomerModal } from './components/EditCustomerModal';
import CustomCard from '../common/Card';
import DeepBlueButton from '../common/DeepBlueButton';
import { CustomTd } from '../common/CustomTd';
import { CustomTr } from '../common/CustomTr';

export const CustomerList = () => {
  const [isLoading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [deletingCustomer, setDeletingCustomer] = useState<any>(null);
  const [edittingCustomer, setEdittingCustomer] = useState<any>(null);

  const handleGetCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCustomers();

      setCustomers(data);

      setLoading(false);
    } catch (error) {}
  }, []);

  useEffect(() => {
    handleGetCustomers();
  }, [handleGetCustomers]);

  return (
    <Box width='100%' height='100%' marginTop='24px'>
      <Heading textAlign='start'>行政系 御客一覧</Heading>
      <CustomCard
        maxW='container.xl'
        paddingTop='24px'
        paddingBottom='24px'
        marginTop='24px'
      >
        <HStack marginBottom={5} justifyContent='end'>
          <DeepBlueButton onClick={() => setAddModalOpen(true)}>
            新しく追加する
          </DeepBlueButton>
        </HStack>

        <TableContainer>
          <Table size='sm' variant='simple' colorScheme='gray'>
            <Thead>
              <Tr>
                <CustomTd>Id</CustomTd>
                <CustomTd>Name</CustomTd>
                <CustomTd>Description</CustomTd>
                <CustomTd>Actions</CustomTd>
              </Tr>
            </Thead>
            <Tbody>
              {customers.map((e, i) => {
                return (
                  <CustomTr key={i}>
                    <CustomTd>{e.id}</CustomTd>
                    <CustomTd>{e.name}</CustomTd>
                    <CustomTd>{e.Description}</CustomTd>
                    <CustomTd>
                      <DeepBlueButton
                        onClick={() => setEdittingCustomer(e)}
                        mr={4}
                      >
                        編集
                      </DeepBlueButton>

                      <Button
                        onClick={() => setDeletingCustomer(e)}
                        variant='outline'
                      >
                        消去
                      </Button>
                    </CustomTd>
                  </CustomTr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
        <AddCustomerModal
          isVisible={isAddModalOpen}
          setVisible={async (isVisible, isReloadData) => {
            setAddModalOpen(isVisible);

            if (isReloadData) {
              setCustomers([]);
              await handleGetCustomers();
            }
          }}
        />
        <DeleteCustomerModal
          isVisible={!!deletingCustomer}
          id={deletingCustomer?.id}
          setVisible={async (isReloadData) => {
            setDeletingCustomer(null);

            if (isReloadData) {
              setCustomers([]);
              await handleGetCustomers();
            }
          }}
        />
        <EditCustomerModal
          isVisible={!!edittingCustomer}
          initData={edittingCustomer}
          setVisible={async (isReloadData) => {
            setEdittingCustomer(null);

            if (isReloadData) {
              setCustomers([]);
              await handleGetCustomers();
            }
          }}
        />
      </CustomCard>
    </Box>
  );
};
