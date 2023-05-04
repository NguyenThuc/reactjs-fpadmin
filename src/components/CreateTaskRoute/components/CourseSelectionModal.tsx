import React, { FC, useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Divider,
} from '@chakra-ui/react';
import { AiFillCheckCircle, AiOutlineCheck } from 'react-icons/ai';
import { ImMap } from 'react-icons/im';
import { ICourse } from '../../../models/course';
import CancelModalButton from '../../common/CancelModalButton';

type Props = {
  isVisible: boolean;
  setVisible: (isVisible: boolean) => void;
  courses: ICourse[];
  onSubmit: (courseId: number | string | undefined) => void;
};

export const CourseSelectionModal: FC<Props> = ({
  isVisible,
  setVisible,
  courses,
  onSubmit,
}) => {
  const [checkedCourse, setCheckedCourse] = useState<ICourse | null>(null);

  const currentCheckedCourse = courses.find(
    (course: ICourse) => course.checked
  );

  useEffect(() => {
    if (!isVisible) {
      setCheckedCourse(null);
    }

    if (isVisible) {
      setCheckedCourse(
        courses.find((course: ICourse) => course.checked) || null
      );
    }
  }, [isVisible, courses]);

  const handleCloseModal = () => {
    if (checkedCourse && currentCheckedCourse?.id !== checkedCourse?.id) {
      onSubmit(checkedCourse?.id);
    } else {
      setVisible(false);
    }
  };

  return (
    <Modal isOpen={isVisible} onClose={handleCloseModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader borderBottom='1px solid #C6D5EB' textAlign='left'>
          コース選択
        </ModalHeader>
        <CancelModalButton top={4} />
        <ModalBody>
          {courses.map((course, index) => {
            return (
              <>
                <div
                  onClick={() => setCheckedCourse(course)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  key={index}
                >
                  <div style={{ flex: 1, fontWeight: 'bold' }}>
                    <p
                      style={{
                        color:
                          course.id === checkedCourse?.id
                            ? '#2E5FA3'
                            : '#0A1524',
                      }}
                    >
                      {course.name}
                    </p>
                    <p
                      style={{
                        color: 'gray',
                        fontWeight: 'normal',
                        fontSize: 14,
                        margin: '4px 0',
                      }}
                    >
                      {course.created_by}
                    </p>
                  </div>
                  <AiFillCheckCircle
                    fontSize={20}
                    color={
                      course.id === checkedCourse?.id ? '#2E5FA3' : '#E4E4E4'
                    }
                  />
                </div>
                <Divider mt={4} mb={4} />
              </>
            );
          })}
        </ModalBody>

        {/* <ModalFooter>
          <Button
            disabled={!checkedCourse}
            colorScheme='blue'
            mr={3}
            onClick={() => onSubmit(checkedCourse?.id)}
          >
            Apply
          </Button>
        </ModalFooter> */}
      </ModalContent>
    </Modal>
  );
};
