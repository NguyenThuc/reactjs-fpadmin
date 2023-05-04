import React, { useMemo, useState, useEffect } from 'react';
import {
  Container,
  Heading,
  HStack,
  useToast,
  Spinner,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Text,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { navigate } from '../../services/navigation';
import { handleFetchUpdatedTaskRoute } from '../../store/thunks/TaskRoute';
import { _taskRoute } from '../../store/selectors/TaskRoute';
import { ITaskRoute } from '../../models/taskRoute';
import { useParams } from 'react-router-dom';
import { getTaskReports } from '../../services/apiRequests/taskReports';
import { ITaskReport } from '../../models/taskReport';
import { TaskReportList } from '../TaskReportList';
import { ITaskAmount } from '../../models/taskAmount';
import { getTaskAmounts } from '../../services/apiRequests/taskAmounts';
import { TaskAmountList } from '../TaskAmountList';
import { TaskRouteDetailsTable } from './components/TaskRouteDetailsTable';
import { _isAdmin } from '../../store/selectors/App';
import { formatTaskName } from '../../utils/formatName';
import { FaRoute } from 'react-icons/fa';
import { getJapaneseStringDate } from '../../utils/date';
import { IGarbage } from '../../models/garbage';
import { CalendarSVG } from '../common/sidebarSVG/calendar';
import BlueButton from '../common/BlueButton';
import { Field } from 'formik';
import { FiMapPin } from 'react-icons/fi';

export const TaskRouteDetail = () => {
  const { taskRouteId }: { taskRouteId: string } = useParams();
  const selectedRouteId = Number(taskRouteId);

  const toast = useToast();
  const taskRoutesData: number = useSelector(_taskRoute);
  const isAdmin: boolean = useSelector(_isAdmin);

  const [taskreports, setTaskReports] = useState<ITaskReport[]>([]);
  const [taskAmounts, setTaskAmounts] = useState<ITaskAmount[]>([]);
  const route: ITaskRoute = useMemo(() => {
    const taskRoute = taskRoutesData.data.find(
      (taskRoute: ITaskRoute) => taskRoute.id === selectedRouteId
    );
    return taskRoute;
  }, [taskRoutesData, selectedRouteId]);

  useEffect(() => {
    async function getReports() {
      try {
        const reportsData: ITaskReport[] = await getTaskReports(
          selectedRouteId
        );
        setTaskReports(reportsData);
      } catch (e) {
        toast({
          title: 'Error fetching task reports',
          description: '',
          status: 'error',
        });
      }
    }

    async function getAmounts() {
      try {
        const amounts: ITaskAmount[] = await getTaskAmounts(selectedRouteId);
        setTaskAmounts(amounts);
      } catch (e) {
        toast({
          title: 'Error fetching task amounts',
          description: '',
          status: 'error',
        });
      }
    }

    getReports();
    getAmounts();
  }, [route, toast]);

  useEffect(() => {
    async function init() {
      // try fetching the route else redirect to list
      try {
        await handleFetchUpdatedTaskRoute(selectedRouteId);
      } catch (e) {
        toast({
          title: 'Incorrct route',
          description: 'please select an existing task route',
          status: 'error',
        });
        navigate('/list');
      }
    }

    init();
  }, [selectedRouteId, setTaskReports, toast]);

  if (!route) return <Spinner />;

  const goToRouteMap = () => navigate(`/task-routes/map/${route.id}`);

  return (
    <Container maxW='container.xl' pb={6} rowSpan='2' marginBottom='24px'>
      <Flex
        marginTop='30px'
        marginBottom='24px'
        alignItems='center'
        justifyContent='space-between'
      >
        <HStack alignItems='center'>
          <Heading textAlign='start'>
            <Flex alignItems='center'>
              <CalendarSVG color='#2E5FA3' />{' '}
              <Text color='table.dataColor' fontSize='22px'>
                {route.name ? formatTaskName(route) : 'Task name'}
              </Text>
            </Flex>
          </Heading>
        </HStack>
        <BlueButton
          alignSelf='flex-start'
          rightIcon={<FiMapPin />}
          onClick={goToRouteMap}
        >
          マップを開く
        </BlueButton>
      </Flex>

      <Container
        maxW='container.xl'
        borderRadius='10px'
        boxShadow='0px 4px 10px rgba(0, 0, 0, 0.05)'
        background='#FFFFFF'
        padding='32px'
        marginBottom='24px'
      >
        <Table my={6} size='sm' variant='simple' colorScheme='gray'>
          <Thead>
            <Tr height='53px'>
              <Th color='table.headerColor' fontSize='12px' fontWeight='600'>
                No
              </Th>
              <Th color='table.headerColor' fontSize='12px' fontWeight='600'>
                Id
              </Th>
              <Th color='table.headerColor' fontSize='12px' fontWeight='600'>
                ルート名
              </Th>
              <Th color='table.headerColor' fontSize='12px' fontWeight='600'>
                顧客
              </Th>
              <Th
                color='table.headerColor'
                fontSize='12px'
                fontWeight='600'
                width='300px'
              >
                品目
              </Th>
              <Th color='table.headerColor' fontSize='12px' fontWeight='600'>
                作成日
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr
              key={route.id}
              _hover={{
                backgroundColor: 'table.backgroundHover',
                cursor: 'pointer',
              }}
              height='53px'
            >
              <Td>1</Td>
              <Td>{route.id}</Td>
              <Td>{formatTaskName(route)}</Td>
              <Td>{route.customer?.name ?? '--'}</Td>
              <Td>
                {route.garbage
                  .map((_garbage: IGarbage) => _garbage.name)
                  .join(', ')}
              </Td>
              <Td>{getJapaneseStringDate(route.date)}</Td>
            </Tr>
          </Tbody>
        </Table>
      </Container>
      <Container
        maxW='container.xl'
        borderRadius='10px'
        boxShadow='0px 4px 10px rgba(0, 0, 0, 0.05)'
        background='#FFFFFF'
        padding='32px'
      >
        <Tabs>
          <TabList width='250px'>
            <Tab width='124px'>收集状況</Tab>
            {isAdmin && (
              <>
                <Tab width='124px'>報告</Tab>
                {/* <Tab width="124px">
                  搬入量
                </Tab> */}
              </>
            )}
          </TabList>
          <TabPanels>
            <TabPanel>
              <TaskRouteDetailsTable route={route} />
            </TabPanel>
            <TabPanel>
              {isAdmin && (
                <TaskReportList taskRoute={route} reportsList={taskreports} />
              )}
            </TabPanel>
            {/* <TabPanel>
              {isAdmin && (
                <TaskAmountList taskRoute={route} amountsList={taskAmounts} />
              )}
            </TabPanel> */}
          </TabPanels>
        </Tabs>
      </Container>
    </Container>
  );
};
