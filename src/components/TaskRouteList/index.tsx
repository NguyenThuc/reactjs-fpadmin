import React, { useEffect } from 'react';
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
import { FiChevronRight } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { navigate } from '../../services/navigation';
import { handleFetchTaskRoute } from '../../store/thunks/TaskRoute';
import { _taskRoute } from '../../store/selectors/TaskRoute';
import { ITaskRoute } from '../../models/taskRoute';
import { IGarbage } from '../../models/garbage';
import DatePicker from '../DatePicker';
import {
  getDateString,
  getJapaneseDateStringDate,
  getJapaneseStringDate,
} from '../../utils/date';
import { formatTaskName } from '../../utils/formatName';
import DeepBlueButton from '../common/DeepBlueButton';
import { CustomSpinner } from '../common/Spinner';
import { CustomTh } from '../common/CustomTh';
import { CustomTr } from '../common/CustomTr';
import { CustomTd } from '../common/CustomTd';

export const TaskRouteList = () => {
  const taskRoutesData: any = useSelector(_taskRoute);
  const [date, setDate] = React.useState<Date>(new Date());

  const fetchData = React.useCallback(() => {
    const dateParam = getDateString(date);
    handleFetchTaskRoute({ date: dateParam });
  }, [date]);

  useEffect(() => fetchData(), [fetchData, date]);

  const onChangeDate = (d: any) => {
    setDate(d);
    const dateParam = getDateString(d);
    navigate({ search: `?date=${dateParam}` });
  };

  const selectTaskRoute = (taskRouteId: number) => navigate(`${taskRouteId}`);
  let content;
  if (taskRoutesData.isLoaded) {
    if (taskRoutesData?.data.length === 0) {
      content = (
        <Heading size='sm'>
          {getJapaneseDateStringDate(date.toLocaleDateString())}{' '}
          にタスクがありません。
        </Heading>
      );
    } else {
      content = (
        <Table size='sm' variant='simple' colorScheme='gray'>
          <Thead>
            <Tr height='53px'>
              <CustomTh>No.</CustomTh>
              <CustomTh>Id</CustomTh>
              <CustomTh>ルート名</CustomTh>
              <CustomTh>顧客</CustomTh>
              <CustomTh>品目</CustomTh>
              <CustomTh>作成日</CustomTh>
              <CustomTh></CustomTh>
            </Tr>
          </Thead>
          <Tbody>
            {taskRoutesData?.data?.map((taskRoute: ITaskRoute, idx: number) => (
              <CustomTr
                key={taskRoute.id}
                onClick={() => selectTaskRoute(taskRoute.id)}
              >
                <CustomTd>{idx + 1}</CustomTd>
                <CustomTd>{taskRoute.id}</CustomTd>
                <CustomTd>{formatTaskName(taskRoute)}</CustomTd>
                <CustomTd>{taskRoute.customer?.name ?? '--'}</CustomTd>
                <CustomTd width='300px'>
                  {taskRoute.garbage
                    .map((_garbage: IGarbage) => _garbage.name)
                    .join(', ')}
                </CustomTd>
                <CustomTd>{getJapaneseStringDate(taskRoute.date)}</CustomTd>
                <CustomTd width='16px'>
                  <FiChevronRight />
                </CustomTd>
              </CustomTr>
            ))}
          </Tbody>
        </Table>
      );
    }
  } else {
    content = <Spinner />;
  }

  return (
    <Container maxW='container.xl' padding='0px 0px' marginBottom='24px'>
      <HStack marginBottom={5} justifyContent='space-between'>
        <Heading textAlign='start' color='table.dataColor' fontSize='16px'>
          タスク
        </Heading>
        <Flex>
          <DatePicker
            id='published-date'
            selectedDate={date}
            onChange={onChangeDate}
            showPopperArrow={true}
            containerStyle={{
              width: '428px',
            }}
          />
          <DeepBlueButton
            isLoading={!taskRoutesData?.isLoaded}
            loadingText='Loading'
            onClick={() => onChangeDate(date)}
            marginLeft='0px'
            borderTopLeftRadius='0px'
            borderBottomLeftRadius='0px'
            backgroundColor='sidebar.background'
            width='100px'
          >
            更新
          </DeepBlueButton>
        </Flex>
      </HStack>
      <Container
        maxW='container.xl'
        borderRadius='10px'
        boxShadow='0px 4px 10px rgba(0, 0, 0, 0.05)'
        background='#FFFFFF'
        padding='40px 48px 40px 48px'
      >
        {content}
      </Container>
    </Container>
  );
};
