import React, { useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Box,
  Button,
  useToast,
} from '@chakra-ui/react';
import { ITaskAmount } from '../../models/taskAmount';
import { TaskAmountDetailModal } from '../TaskAmountDetailModal';
import { ITaskAmountItem } from '../../models/taskAmountItem';
import { TaskAmountDeleteConfirmationModal } from './components/TaskAmountDeleteConfirmationModal';
import { AddAmountModal } from './components/AddAmountModal';
import { handleFetchUpdatedTaskRoute } from '../../store/thunks/TaskRoute';
import { deleteTaskAmount } from '../../services/apiRequests/taskAmounts';
import { ITaskRoute } from '../../models/taskRoute';
import { MdDeleteForever, MdEdit, MdAdd } from 'react-icons/md';
import { AddAmountItemModal } from './components/AddAmountItemModal';
import { deleteTaskAmountItem } from '../../services/apiRequests/taskAmountItems';
import { getJapaneseDateString } from '../../utils/date';
import YellowButton from '../common/YellowButton';
import { AiOutlinePlus } from 'react-icons/ai';

const TaskAmountItemTable = ({
  taskAmountItems,
  onEditItemIconClicked,
  onDeleteItemIconClicked,
}: {
  taskAmountItems: Array<ITaskAmountItem>;
  onEditItemIconClicked: (id: number) => void;
  onDeleteItemIconClicked: (id: number) => void;
}) => {
  return (
    <Table size='sm'>
      <Thead>
        <Tr>
          <Th>No.</Th>
          <Th>Id</Th>
          <Th>Garbage</Th>
          <Th>Gross Weight</Th>
          <Th>Vehicle Weight</Th>
          <Th>Net Weight</Th>
          <Th>操作</Th>
        </Tr>
      </Thead>
      <Tbody>
        {taskAmountItems?.map(
          (taskAmountItem: ITaskAmountItem, idx: number) => (
            <Tr
              key={taskAmountItem.id}
              _hover={{ backgroundColor: 'blue.100', cursor: 'pointer' }}
            >
              <Td>{idx + 1}</Td>
              <Td>{taskAmountItem.id}</Td>
              <Td>{taskAmountItem.garbage?.name}</Td>
              <Td>{taskAmountItem.gross_weight}</Td>
              <Td>{taskAmountItem.vehicle_weight}</Td>
              <Td>{taskAmountItem.net_weight}</Td>
              <Td>
                <HStack>
                  <Button
                    size='xs'
                    colorScheme='blue'
                    onClick={(e: any) => {
                      e.stopPropagation();
                      onEditItemIconClicked(taskAmountItem.id);
                    }}
                  >
                    <MdEdit />
                  </Button>

                  <Button
                    size='xs'
                    colorScheme='red'
                    onClick={(e: any) => {
                      e.stopPropagation();
                      onDeleteItemIconClicked(taskAmountItem.id);
                    }}
                  >
                    <MdDeleteForever />
                  </Button>
                </HStack>
              </Td>
            </Tr>
          )
        )}
      </Tbody>
    </Table>
  );
};

export const TaskAmountList = ({
  amountsList,
  taskRoute,
}: {
  amountsList: ITaskAmount[];
  taskRoute: ITaskRoute;
}) => {
  const [selectedTaskAmount, setSelectedTaskAmount] = useState<
    ITaskAmount | undefined
  >(undefined);
  const [selectedTaskAmountItem, setSelectedTaskAmountItem] = useState<
    ITaskAmountItem | undefined
  >(undefined);

  const toast = useToast();

  const [isAddAmountModalOpen, setAddAmountModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isAddAmountItemModalOpen, setAddAmountItemModalOpen] = useState(false);

  const addAmountModalOpen = () => setAddAmountModalOpen(true);

  const cancelRef = React.useRef();

  const onDeleteIconClicked = (amountId: number) => {
    const _taskAmount = getAmountFromId(amountId);
    if (_taskAmount) {
      setSelectedTaskAmount(_taskAmount);
      setIsDeleteModalOpen(true);
    }
  };

  const onDelete = async () => {
    if (selectedTaskAmount) {
      if (selectedTaskAmountItem) {
        // delete task amount item
        try {
          await deleteTaskAmountItem(selectedTaskAmountItem!.id);
          handleFetchUpdatedTaskRoute(taskRoute.id);
          toast({
            title: 'Task amount item deleted',
            description: '',
          });
        } catch {
          toast({
            title: 'Error deleting task amount',
            description: 'もう一度お試しください',
            status: 'error',
          });
        }
      } else {
        // delete task amount
        try {
          await deleteTaskAmount(selectedTaskAmount!.id);
          handleFetchUpdatedTaskRoute(taskRoute.id);
          toast({
            title: 'Task amount deleted',
            description: '',
          });
        } catch {
          toast({
            title: 'Error deleting task amount',
            description: 'もう一度お試しください',
            status: 'error',
          });
        }
      }
    }
    onDeleteModalClose();
  };

  const onDeleteModalClose = () => {
    setSelectedTaskAmount(undefined);
    setSelectedTaskAmountItem(undefined);
    setIsDeleteModalOpen(false);
  };

  const onEditIconClicked = (amountId: number) => {
    const _taskAmount = getAmountFromId(amountId);
    if (_taskAmount) {
      setAddAmountModalOpen(true);
      setSelectedTaskAmount(_taskAmount);
    }
  };

  const onEditModalClose = () => {
    setSelectedTaskAmount(undefined);
    setAddAmountModalOpen(false);
  };

  const onEditItemModalClose = () => {
    setSelectedTaskAmount(undefined);
    setSelectedTaskAmountItem(undefined);
    setAddAmountItemModalOpen(false);
  };

  const onEditItemIconClicked = (amountItemId: number, amountId: number) => {
    const _taskAmount = getAmountFromId(amountId);
    if (!_taskAmount) return;

    const _taskAmountItem = getAmountItemFromId(_taskAmount, amountItemId);
    if (_taskAmountItem) {
      setAddAmountItemModalOpen(true);
      setSelectedTaskAmount(_taskAmount);
      setSelectedTaskAmountItem(_taskAmountItem);
    }
  };

  const onDeleteItemIconClicked = (amountItemId: number, amountId: number) => {
    const _taskAmount = getAmountFromId(amountId);
    if (!_taskAmount) return;

    const _taskAmountItem = getAmountItemFromId(_taskAmount, amountItemId);
    if (_taskAmountItem) {
      setSelectedTaskAmount(_taskAmount);
      setSelectedTaskAmountItem(_taskAmountItem);
      setIsDeleteModalOpen(true);
    }
  };

  const onAddIconClicked = (amountId: number) => {
    const _taskAmount = getAmountFromId(amountId);
    if (_taskAmount) {
      setAddAmountItemModalOpen(true);
      setSelectedTaskAmount(_taskAmount);
    }
  };

  const getAmountFromId = (amountId: number) =>
    amountsList.find(
      (taskAmountItem: ITaskAmount) => amountId === taskAmountItem.id
    );
  const getAmountItemFromId = (taskAmount: ITaskAmount, amountItemId: number) =>
    taskAmount.amount_item.find(
      (taskAmountItem: ITaskAmountItem) => amountItemId === taskAmountItem.id
    );

  return (
    <>
      <TaskAmountDetailModal
        isOpen={
          !!selectedTaskAmount && !isAddAmountModalOpen && !isDeleteModalOpen
        }
        onClose={() => setSelectedTaskAmount(undefined)}
        taskAmount={selectedTaskAmount}
      />
      <TaskAmountDeleteConfirmationModal
        taskAmount={selectedTaskAmount}
        taskAmountItem={selectedTaskAmountItem}
        onAccept={onDelete}
        cancelRef={cancelRef}
        onCancel={onDeleteModalClose}
        isOpen={isDeleteModalOpen}
      />
      <AddAmountModal
        selectedTaskAmount={selectedTaskAmount}
        taskRoute={taskRoute}
        isOpen={isAddAmountModalOpen}
        onClose={onEditModalClose}
      />
      <AddAmountItemModal
        selectedTaskAmountItem={selectedTaskAmountItem}
        taskRoute={taskRoute}
        taskAmount={selectedTaskAmount}
        isOpen={isAddAmountItemModalOpen}
        onClose={onEditItemModalClose}
      />

      <HStack marginBottom={4} justifyContent='space-between'>
        <YellowButton
          onClick={addAmountModalOpen}
          marginLeft="auto"
          alignItems="center"
          display="flex"
        >搬入量を追加する <Box display="inline-block" marginLeft="4px"><AiOutlinePlus /></Box></YellowButton>
      </HStack>

      {amountsList?.map((taskAmount: ITaskAmount, idx: number) => (
        <>
          <Table my={10} size='sm' variant='simple' colorScheme="gray">
            <Thead>
              <Tr height='53px'>
                {/* <Th>No.</Th> */}
                <Th color='table.headerColor' fontSize='12px' fontWeight='600'>Id</Th>
                <Th color='table.headerColor' fontSize='12px' fontWeight='600'>車両</Th>
                <Th color='table.headerColor' fontSize='12px' fontWeight='600'>作成日</Th>
                <Th color='table.headerColor' fontSize='12px' fontWeight='600'>作業種別</Th>
                <Th color='table.headerColor' fontSize='12px' fontWeight='600'>取引種別</Th>
                <Th color='table.headerColor' fontSize='12px' fontWeight='600'>操作</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr
                key={taskAmount.id}
                _hover={{ backgroundColor: 'table.backgroundHover', cursor: 'pointer' }}
                onClick={() => setSelectedTaskAmount(taskAmount)}
                height='53px'
              >
                {/* <Td>{idx + 1}</Td> */}
                <Td>{taskAmount.id}</Td>
                <Td>{taskAmount.vehicle?.registration_number ?? '-'}</Td>
                <Td>{getJapaneseDateString(taskAmount.timestamp)}</Td>
                <Td>{taskAmount.work_type ?? '-'}</Td>
                <Td>{taskAmount.deal_type ?? '-'}</Td>
                <Td>
                  <HStack>
                    <Button
                      size='sm'
                      colorScheme='green'
                      onClick={(e: any) => {
                        e.stopPropagation();
                        onAddIconClicked(taskAmount.id);
                      }}
                    >
                      <MdAdd />
                    </Button>

                    <Button
                      size='sm'
                      colorScheme='blue'
                      onClick={(e: any) => {
                        e.stopPropagation();
                        onEditIconClicked(taskAmount.id);
                      }}
                    >
                      <MdEdit />
                    </Button>

                    <Button
                      size='sm'
                      colorScheme='red'
                      onClick={(e: any) => {
                        e.stopPropagation();
                        onDeleteIconClicked(taskAmount.id);
                      }}
                    >
                      <MdDeleteForever />
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            </Tbody>
          </Table>
          {taskAmount.amount_item.length > 0 && (
            <TaskAmountItemTable
              onEditItemIconClicked={(amountItemId: number) =>
                onEditItemIconClicked(amountItemId, taskAmount.id)
              }
              onDeleteItemIconClicked={(amountItemId: number) =>
                onDeleteItemIconClicked(amountItemId, taskAmount.id)
              }
              taskAmountItems={taskAmount.amount_item}
            />
          )}
        </>
      ))}
    </>
  );
};
