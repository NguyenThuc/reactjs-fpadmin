import * as React from 'react';
import { Table, Tbody, Tr, Td } from '@chakra-ui/react';
import { ITaskReport } from '../../models/taskReport';
import { getJapaneseDateString } from '../../utils/date';
import { CustomTd } from '../common/CustomTd';
import { TYPE_BASE } from '../../constants/strings';

export const TaskReportTable = ({
  taskReport,
  taskRoute,
}: {
  taskReport?: ITaskReport;
  taskRoute?: any;
}) => {
  if (!taskReport) return null;

  const reportTypeData =
    taskRoute && taskRoute?.type === TYPE_BASE
      ? taskReport?.report_type
      : taskReport?.route_report_type;

  return (
    <Table size='sm' variant='simple' colorScheme='gray' my={3}>
      <Tbody>
        <Tr>
          <CustomTd fontWeight='bold'>Id</CustomTd>
          <CustomTd>{taskReport?.id}</CustomTd>
        </Tr>
        <Tr>
          <CustomTd fontWeight='bold'>内容</CustomTd>
          <CustomTd>{taskReport?.description}</CustomTd>
        </Tr>
        <Tr>
          <CustomTd fontWeight='bold'>報告種別</CustomTd>
          <CustomTd>{reportTypeData?.name}</CustomTd>
        </Tr>
        <Tr>
          <CustomTd fontWeight='bold'>作成日</CustomTd>
          <CustomTd>{getJapaneseDateString(taskReport?.timestamp)}</CustomTd>
        </Tr>
      </Tbody>
    </Table>
  );
};
