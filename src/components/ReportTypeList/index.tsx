import React, { useState, useCallback, useEffect } from 'react';
import {
  Container,
  Heading,
  HStack,
  Spinner,
  Flex,
  Button,
  Box,
} from '@chakra-ui/react';
import { getReportTypes } from '../../services/apiRequests/reportTypes';
import { ReportTypeItem } from './components/ReportTypeItem';
import { AddReportTypeModal } from './components/AddReportTypeModal';
import { EditReportTypeModal } from './components/EditReportTypeModal';
import { DeleteReportTypeModal } from './components/DeleteReportTypeModal';
import CustomCard from '../common/Card';
import DeepBlueButton from '../common/DeepBlueButton';

export const ReportTypeList = () => {
  const [isLoading, setLoading] = useState(false);
  const [types, setTypes] = useState<any[]>([]);
  const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [edittingReportType, setEdittingReportType] = useState<any>(null);
  const [deletingReportType, setDeletingReportType] = useState<any>(null);

  const getReportTypeList = useCallback(async () => {
    setLoading(true);
    const data = await getReportTypes();

    setTypes(data);

    setLoading(false);
  }, []);

  useEffect(() => {
    getReportTypeList();
  }, [getReportTypeList]);

  return (
    <Box>
      <Heading textAlign='start'>行政系 レポートの種類</Heading>
      <CustomCard marginTop='24px'>
        <HStack marginBottom={5} justifyContent='end'>
          <DeepBlueButton onClick={() => setAddModalOpen(true)}>
            新しく追加する
          </DeepBlueButton>
        </HStack>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            width: '100%',
            marginTop: 32,
          }}
        >
          {types.map((type: any, index) => {
            return (
              <ReportTypeItem
                key={index}
                name={type.name}
                description={type.description}
                id={type.id}
                onEdit={() => {
                  setEdittingReportType(type);
                }}
                onDelete={() => {
                  setDeletingReportType(type);
                }}
              />
            );
          })}
          {isLoading && (
            <Flex mt={6} mb={6} justify='center'>
              <Spinner />
            </Flex>
          )}
        </div>
        <AddReportTypeModal
          isVisible={isAddModalOpen}
          setVisible={async (isVisible, isReloadData) => {
            setAddModalOpen(isVisible);

            if (isReloadData) {
              setTypes([]);
              await getReportTypeList();
            }
          }}
        />
        <EditReportTypeModal
          isVisible={!!edittingReportType}
          initData={edittingReportType}
          setVisible={async (isReloadData) => {
            setEdittingReportType(null);

            if (isReloadData) {
              setTypes([]);
              await getReportTypeList();
            }
          }}
        />
        <DeleteReportTypeModal
          isVisible={!!deletingReportType}
          id={deletingReportType?.id}
          setVisible={async (isReloadData) => {
            setDeletingReportType(null);

            if (isReloadData) {
              setTypes([]);
              await getReportTypeList();
            }
          }}
        />
      </CustomCard>
    </Box>
  );
};
