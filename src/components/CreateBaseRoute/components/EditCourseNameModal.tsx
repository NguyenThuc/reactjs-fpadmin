import {
  Modal,
  Input,
  ModalOverlay,
  ModalHeader,
  ModalFooter,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Button,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { updateCourseName } from '../../../services/apiRequests/baseRoute';

export const EditCourseNameModal = ({
  isVisible,
  setVisible,
  editingCourse,
  onEditSuccess,
}) => {
  const [name, setName] = useState(editingCourse);
  const toast = useToast();

  useEffect(() => {
    if (editingCourse) {
      setName(editingCourse.name);
    }
  }, [editingCourse]);

  const handleSaveCourseName = async () => {
    const result = await updateCourseName(editingCourse.id, name);

    const { isOk } = result;
    if (isOk) {
      toast({
        title: 'コース名の更新成功',
        description: '',
        status: 'success',
        duration: 1000,
      });
      onEditSuccess?.(editingCourse.id, name);
      setVisible(false);
    } else {
      toast({
        title: 'コース名の更新に失敗しました',
        description: '',
        status: 'error',
        duration: 1000,
      });
    }
  };

  if (!editingCourse) {
    return null;
  }

  return (
    <Modal isOpen={true} onClose={() => setVisible(false)} size='sm'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader mb={3}>
          <ModalCloseButton />
        </ModalHeader>

        <ModalBody>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleSaveCourseName} disabled={!name}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
