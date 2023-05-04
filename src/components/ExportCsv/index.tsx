import React, { useEffect, useState } from 'react';
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
  Flex,
} from '@chakra-ui/react';

import DatePicker from '../DatePicker';

import { CSVLink, CSVDownload } from 'react-csv';
import moment from 'moment';

import { hirouAxios } from '../../services/httpInstance';
import { BASE_ROUTE_URL, ROUTE_EXPORT_CSV } from '../../constants/urls';
export const ExportCsv = () => {
  const [start_date, setStartDate] = useState<Date>(new Date());
  const [end_date, setEndDate] = useState<Date>(new Date());
  const [data, setData] = useState<any>('');
  const url = ROUTE_EXPORT_CSV;
  const dataExport = async () => {
    const formData = new FormData();
    formData.append('start_date', moment(start_date).format('YYYY-MM-DD'));
    formData.append('end_date', moment(end_date).format('YYYY-MM-DD'));
    const response = await hirouAxios.post(url, formData);
    setData(response.data);
  };
  useEffect(() => {
    dataExport();
  }, []);
  // @ts-ignore
  return (
    <Container maxW='container.xl' padding='0px 0px'>
      <HStack marginBottom={5} justifyContent='space-between'>
        <Heading textAlign='start' color='table.dataColor' fontSize='16px'>
          タスク
        </Heading>
        <Flex>
          <DatePicker
            id='start-date'
            selectedDate={start_date}
            onChange={(e: any) => setStartDate(e)}
            containerStyle={{
              width: '350px',
              boxSizing: 'border-box',
              marginRight: '15px',
            }}
          />
          <DatePicker
            id='end-date'
            selectedDate={end_date}
            onChange={(e: any) => setEndDate(e)}
            containerStyle={{
              width: '350px',
              marginRight: '15px',
            }}
          />

          <Button>
            <CSVLink
              data={data}
              filename={'export.csv'}
              className='chakra-button'
              onClick={dataExport}
            >
              CSVファイルダウンロード
            </CSVLink>
          </Button>
        </Flex>
      </HStack>
    </Container>
  );
};
