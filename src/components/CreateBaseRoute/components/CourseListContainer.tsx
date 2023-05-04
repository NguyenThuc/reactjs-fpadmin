import React, { FC } from 'react';
import {Box, Button} from '@chakra-ui/react';

import { ICourse } from '../../../models/course';
import { CourseItem } from './CourseItem';
import YellowButton from "../../common/YellowButton";
import {AiOutlinePlus} from "react-icons/ai";

type Props = {
  courses: ICourse[];
  onDeleteCourse: (state: any) => void;
  onSelectCourse: (state: any) => void;
  onEditCourse: (state: any) => void;
  onAddNewCourse: () => void;
};

const styles = {
  container: {
    width: '100%',
    // height: '38vh',
    background: '#fff',
    borderRadius: 8,
    top: 90,
    left: 10,
    zIndex: 2,
    // boxShadow: 'rgb(0 0 0 / 30%) 0px 1px 4px -1px',
    overflowY: 'auto',
    boxSizing: 'border-box',
  },
};

export const CourseListContainer: FC<Props> = ({
  courses = [],
  onDeleteCourse,
  onSelectCourse,
  onAddNewCourse,
  onEditCourse,
}) => {
  return (
    <div>
      {/*{!courses.length ? (*/}
      {/*  <div style={{ fontSize: 14, marginTop: 16 }}>*/}
      {/*    コースリストはなしです。*/}
      {/*  </div>*/}
      {/*) : (*/}
      {/*  <div style={{ fontSize: 16, fontWeight: 'bold', margin: '16px 0' }}>*/}
      {/*    コース*/}
      {/*  </div>*/}
      {/*)}*/}

      {courses.map((course, index) => {
        return (
          <CourseItem
            key={course.id}
            index={index}
            onDelete={onDeleteCourse}
            onSelect={onSelectCourse}
            onEdit={onEditCourse}
            course={course}
            total={courses.length}
          />
        );
      })}

      <YellowButton
          margin='15px 75px'
          onClick={onAddNewCourse}
          alignItems='center'
          display='flex'
      >
        新しいコースを追加。{' '}
        <Box display='inline-block' marginLeft='8px'>
          <AiOutlinePlus />
        </Box>
      </YellowButton>


      {/*<Button onClick={onAddNewCourse} mt={4} mb={4}>*/}
      {/*  新しいコースを追加します。*/}
      {/*</Button>*/}
    </div>
  );
};
