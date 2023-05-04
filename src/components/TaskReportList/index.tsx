import React, { useState, useMemo } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Button,
  Image,
  useToast,
  Box,
} from '@chakra-ui/react';
import { ITaskReport } from '../../models/taskReport';
import { TaskReportDetailModal } from '../TaskReportDetailModal';
import { AddReportModal } from './components/AddReportModal';
import { ITaskRoute } from '../../models/taskRoute';
import { TaskReportDeleteConfirmationModal } from './components/TaskReportDeleteConfirmationModal';
import { deleteTaskReport } from '../../services/apiRequests/taskReports';
import { handleFetchUpdatedTaskRoute } from '../../store/thunks/TaskRoute';
import { getDateTimeString, getJapaneseDateString } from '../../utils/date';
import { ITaskCollectionPoint } from '../../models/taskCollectionPoint';
import DeepBlueButton from '../common/DeepBlueButton';
import YellowButton from '../common/YellowButton';
import { AiOutlinePlus } from 'react-icons/ai';
import { TYPE_BASE } from '../../constants/strings';

function getCollectionPointText(tcp: ITaskCollectionPoint | undefined) {
  if (!tcp) return '';
  return `${tcp?.sequence} [${tcp?.name}]`;
}

export const TaskReportList = ({
  reportsList,
  taskRoute,
}: {
  reportsList: ITaskReport[];
  taskRoute: ITaskRoute;
}) => {
  const { task_collection_point } = taskRoute;

  const tcpMap = useMemo(() => {
    let newTcpMap: any = {};
    task_collection_point.forEach((tcp: ITaskCollectionPoint) => {
      newTcpMap[tcp.id] = tcp;
    });
    return newTcpMap;
  }, [task_collection_point]);

  const toast = useToast();

  const [selectedTaskReport, setSelectedTaskReport] = useState<
    ITaskReport | undefined
  >(undefined);

  const [isAddReportModalOpen, setAddReportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const addReportModalOpen = () => setAddReportModalOpen(true);

  const cancelRef = React.useRef();

  const onDeleteIconClicked = (reportId: number) => {
    const _taskReport = getReportFromId(reportId);
    if (_taskReport) {
      setSelectedTaskReport(_taskReport);
      setIsDeleteModalOpen(true);
    }
  };

  const onDelete = async () => {
    if (selectedTaskReport !== null) {
      try {
        await deleteTaskReport(selectedTaskReport!.id);
        handleFetchUpdatedTaskRoute(taskRoute.id);
        toast({
          title: 'Task report deleted',
          description: '',
        });
      } catch {
        toast({
          title: 'Error deleting task report',
          description: 'もう一度お試しください',
          status: 'error',
        });
      }
    }
    onDeleteModalClose();
  };

  const onDeleteModalClose = () => {
    setSelectedTaskReport(undefined);
    setIsDeleteModalOpen(false);
  };

  const onEditIconClicked = (reportId: number) => {
    const _taskReport = getReportFromId(reportId);
    if (_taskReport) {
      setAddReportModalOpen(true);
      setSelectedTaskReport(_taskReport);
    }
  };

  const onEditModalClose = () => {
    setSelectedTaskReport(undefined);
    setAddReportModalOpen(false);
  };

  const getReportFromId = (reportId: number) =>
    reportsList.find(
      (taskReportItem: ITaskReport) => reportId === taskReportItem.id
    );

  return (
    <>
      <TaskReportDetailModal
        isOpen={
          !!selectedTaskReport && !isAddReportModalOpen && !isDeleteModalOpen
        }
        onClose={() => setSelectedTaskReport(undefined)}
        taskReport={selectedTaskReport}
        taskRoute={taskRoute}
      />
      <TaskReportDeleteConfirmationModal
        taskReport={selectedTaskReport}
        onAccept={onDelete}
        cancelRef={cancelRef}
        onCancel={onDeleteModalClose}
        isOpen={isDeleteModalOpen}
      />
      <AddReportModal
        selectedTaskReport={selectedTaskReport}
        taskRoute={taskRoute}
        isOpen={isAddReportModalOpen}
        onClose={onEditModalClose}
      />
      <HStack marginBottom={4} justifyContent='space-between'>
        <YellowButton
          marginLeft='auto'
          onClick={addReportModalOpen}
          alignItems='center'
          display='flex'
        >
          レポートを追加する{' '}
          <Box display='inline-block' marginLeft='8px'>
            <AiOutlinePlus />
          </Box>
        </YellowButton>
      </HStack>
      <Table my={6} size='sm' variant='simple' colorScheme='gray'>
        <Thead>
          <Tr height='53px'>
            <Th color='table.headerColor' fontSize='12px' fontWeight='600'>
              No.
            </Th>
            <Th color='table.headerColor' fontSize='12px' fontWeight='600'>
              集積所番号
            </Th>
            <Th
              color='table.headerColor'
              fontSize='12px'
              fontWeight='600'
              width='93px'
            >
              種類
            </Th>
            <Th
              color='table.headerColor'
              fontSize='12px'
              fontWeight='600'
              width='228px'
            >
              説明
            </Th>
            <Th color='table.headerColor' fontSize='12px' fontWeight='600'>
              画像
            </Th>
            {/* 説明 */}
            <Th color='table.headerColor' fontSize='12px' fontWeight='600'>
              作成日
            </Th>
            <Th color='table.headerColor' fontSize='12px' fontWeight='600'>
              操作
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {reportsList?.map((taskReport: ITaskReport, idx: number) => {
            const reportType =
              taskRoute && taskRoute?.type === TYPE_BASE
                ? taskReport?.report_type
                : taskReport?.route_report_type;

            return (
              <Tr
                key={taskReport.id}
                _hover={{
                  backgroundColor: 'table.backgroundHover',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedTaskReport(taskReport)}
                height='53px'
              >
                <Td>{idx + 1}</Td>
                <Td>
                  {getCollectionPointText(
                    tcpMap?.[taskReport?.task_collection_point?.id]
                  )}
                </Td>
                <Td>
                  <Box
                    width='100%'
                    maxWidth='93px'
                    textOverflow='ellipsis'
                    overflow='hidden'
                    whiteSpace='nowrap'
                  >
                    {reportType?.name}
                  </Box>
                </Td>
                <Td>
                  <Box
                    width='100%'
                    maxWidth='228px'
                    textOverflow='ellipsis'
                    overflow='hidden'
                    whiteSpace='nowrap'
                  >
                    {taskReport?.description}
                  </Box>
                </Td>
                <Td>
                  <Image
                    cursor='pointer'
                    objectFit='cover'
                    src={taskReport?.image ?? 'https://via.placeholder.com/150'}
                    alt='image'
                    width='128px'
                    height='80px'
                  />
                </Td>
                <Td>{getJapaneseDateString(taskReport?.timestamp)}</Td>
                <Td>
                  <HStack>
                    <DeepBlueButton
                      backgroundColor='table.actionEditColor'
                      onClick={(e: any) => {
                        e.stopPropagation();
                        onEditIconClicked(taskReport?.id);
                      }}
                    >
                      編集
                    </DeepBlueButton>

                    <Button
                      variant='outline'
                      onClick={(e: any) => {
                        e.stopPropagation();
                        onDeleteIconClicked(taskReport?.id);
                      }}
                    >
                      削除
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </>
  );
};
