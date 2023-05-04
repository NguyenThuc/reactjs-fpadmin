import * as React from 'react';
import {
  Box,
  Text,
  Divider,
  HStack,
  VStack,
  Button,
  Flex,
} from '@chakra-ui/react';
import { MdDeleteForever } from 'react-icons/md';
import { AiFillEdit } from 'react-icons/ai';
import { FaCheck, FaMap } from 'react-icons/fa';
import { ICourse } from '../../../models/course';

interface CoureItemProps {
  course: ICourse;
  index: number;
  onDelete: (course: ICourse) => void;
  onSelect: (course: ICourse) => void;
  onEdit: (course: ICourse) => void;
  total: number;
}

export const CourseItem = (props: CoureItemProps) => {
  const { course, index, onDelete, onSelect, onEdit, total } = props;

  const onDeleteClick = () => onDelete(course);
  const onSelectClick = () => onSelect(course);
  const onEditClick = () => onEdit(course);
  return (
    <Box
      style={{ cursor: 'pointer' ,padding: "0" }}
      fontSize='0.8rem'
      userSelect='none'
      onClick={onSelectClick}
    >
      <HStack height='85px' padding='30px' borderLeft={course.checked ? '4px solid red' : ''} background={course.checked ? '#F3F5F9' : ''} color={course.checked ? '#2E5FA3' : '#0A1524'} align='flex-start'>
        <VStack align='stretch' p={1} paddingX={0} flex={1}>
          <HStack>
            <Text style={{ fontWeight: 'bold' }}>{index + 1}.</Text>
            <Text>{course.name}</Text>
          </HStack>
        </VStack>

        <Flex p={1}>
          <Button
            border='1px'
            mr={2}
            padding='15px'
            //colorScheme='gray'
            borderColor='#E2E8F0'
            borderRadius='20px'
            lineHeight='4'
            variant='outline'
            size='sm'
            _active={{
              borderColor: '#E3E8F0',
            }}
            _hover={{
              borderColor: '#E3E8F0',

            }}
            _focus={{
              borderColor: '#E3E8F0',
            }}
            onClick={(e) => {
              e.stopPropagation();
              onEditClick();
            }}
          >
            編集
          </Button>
          {!course.checked && total >= 2 && (
            <Button
              border='1px'
              mr={2}
              padding='15px'
              colorScheme='red'
              borderColor='#E3E8F0'
              borderRadius='20px'
              lineHeight='4'
              variant='outline'
              size='sm'
              _active={{
                borderColor: 'red',
              }}
              _hover={{
                borderColor: 'red',
              }}
              _focus={{
                borderColor: 'red',
              }}
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick();
              }}
            >
              編集
            </Button>
          )}

          {/*{course.checked && (*/}
          {/*  <FaCheck style={{ marginRight: 12 }} size={24} color='#55CA87' />*/}
          {/*)}*/}
        </Flex>
      </HStack>
    </Box>
  );
};
