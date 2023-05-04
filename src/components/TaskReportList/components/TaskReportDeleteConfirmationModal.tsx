import * as React from 'react';
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
  Button,
} from '@chakra-ui/react';
import { TaskReportTable } from '../../TaskReportTable';
import { ITaskReport } from '../../../models/taskReport';

interface TaskReportDeleteConfirmationModalProps {
  taskReport?: ITaskReport;
  isOpen: boolean;
  cancelRef: any;
  onCancel: () => void;
  onAccept: () => void;
}

export const TaskReportDeleteConfirmationModal = (
  props: TaskReportDeleteConfirmationModalProps
) => {
  const { isOpen, cancelRef, onCancel, onAccept, taskReport } = props;

  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={isOpen}
      onClose={onCancel}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            Delete Task Report ?
          </AlertDialogHeader>
          <AlertDialogBody>
            This functions is irreversible
            <TaskReportTable taskReport={taskReport} />
          </AlertDialogBody>
          <AlertDialogFooter justifyContent="space-between">
            <Button
              backgroundColor='sidebar.selectedLine'
              onClick={onAccept}
              ml={3}
              style={{
                borderRadius: '36px',
              }}
              width='234px'
              _hover=""
            >
              削除
            </Button>
            <Button
              variant='outline'
              ref={cancelRef}
              onClick={onCancel}
              style={{
                borderRadius: '36px',
              }}
            >
              キャンセル1
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
