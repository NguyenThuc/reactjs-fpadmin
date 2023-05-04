import React, { useState, useCallback, useEffect } from 'react';
import {
  Container,
  Heading,
  HStack,
  Spinner,
  Flex,
  Button,
  useToast,
  Box,
} from '@chakra-ui/react';
import { getCompanyReports } from '../../services/apiRequests/companyReport';
import { CompanyReportItem } from './components/ReportTypeItem';
import { AddReportTypeModal } from './components/AddReportTypeModal';
import { EditReportTypeModal } from './components/EditReportTypeModal';
import { DeleteReportTypeModal } from './components/DeleteReportTypeModal';
import { ITaskReport } from '../../models/taskReport';
import CustomCard from '../common/Card';
import DeepBlueButton from '../common/DeepBlueButton';

export const CompanyReportList = () => {
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);
  const [types, setTypes] = useState<any[]>([]);
  const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [edittingCompanyReport, setEdittingCompanyReport] =
    useState<boolean>(false);
  const [deletingCompanyReport, setDeletingCompanyReport] =
    useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<ITaskReport[] | null>(
    null
  );

  const getCompanyReportList = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCompanyReports();
      setTypes(data);
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
  }, []);

  useEffect(() => {
    getCompanyReportList();
  }, [getCompanyReportList]);

  return (
    <Box>
      <Heading textAlign='start'>事業系 レポートの種類</Heading>
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
              <CompanyReportItem
                key={index}
                name={type.name}
                description={type.description}
                id={type.id}
                onEdit={() => {
                  setEdittingCompanyReport(true);
                  setSelectedReport(type);
                }}
                onDelete={() => {
                  setDeletingCompanyReport(true);
                  setSelectedReport(type);
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
        {isAddModalOpen && (
          <AddReportTypeModal
            isVisible={isAddModalOpen}
            setVisible={async (isVisible, isReloadData) => {
              setAddModalOpen(isVisible);

              if (isReloadData) {
                setTypes([]);
                await getCompanyReportList();
              }
            }}
          />
        )}
        {edittingCompanyReport && selectedReport && (
          <EditReportTypeModal
            isVisible={edittingCompanyReport}
            selectedReport={selectedReport}
            setVisible={async (isReloadData) => {
              setEdittingCompanyReport(false);

              if (isReloadData) {
                setTypes([]);
                await getCompanyReportList();
              }
            }}
          />
        )}
        {selectedReport && deletingCompanyReport && (
          <DeleteReportTypeModal
            isVisible={deletingCompanyReport}
            selectedReport={selectedReport}
            setVisible={async (isReloadData) => {
              setDeletingCompanyReport(false);

              if (isReloadData) {
                setTypes([]);
                await getCompanyReportList();
              }
            }}
          />
        )}
      </CustomCard>
    </Box>
  );
};
