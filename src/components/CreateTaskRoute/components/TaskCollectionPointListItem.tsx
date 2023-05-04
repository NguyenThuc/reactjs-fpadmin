import * as React from 'react';
import {
  Box,
  Text,
  Divider,
  HStack,
  VStack,
  Button,
  Flex,
  Tag,
  TagLabel,
} from '@chakra-ui/react';
import { FaCheck, FaInfo } from 'react-icons/fa';
import { ITaskCollectionPoint } from '../../../models/taskCollectionPoint';
import { ITaskCollection } from '../../../models/taskCollection';
import useOnScreen from '../../../utils/useOnScreen';
import { _isAdmin } from '../../../store/selectors/App';
import { useSelector } from 'react-redux';

import bookActiveIcon from '../../../assets/book-active.png';
import bookInActiveIcon from '../../../assets/book-inactive.png';
import canActiveIcon from '../../../assets/can-active.png';
import canInActiveIcon from '../../../assets/can-inactive.png';
import boxActiveIcon from '../../../assets/box-active.png';
import boxInActiveIcon from '../../../assets/box-inactive.png';
import fabricActiveIcon from '../../../assets/fabric-active.png';
import fabricInActiveIcon from '../../../assets/fabric-inactive.png';
import milkBottleActiveIcon from '../../../assets/milkbottle-active.png';
import milkBottleInActiveIcon from '../../../assets/milkbottle-inactive.png';
import chemistryActiveIcon from '../../../assets/chemistry-active.png';
import chemistryInActiveIcon from '../../../assets/chemistry-inactive.png';
import newspaperActiveIcon from '../../../assets/newspaper-active.png';
import newspaperInActiveIcon from '../../../assets/newspaper-inactive.png';
import bottleActiveIcon from '../../../assets/bottle-active.png';
import bottleInActiveIcon from '../../../assets/bottle-inactive.png';
import DeepBlueButton from '../../common/DeepBlueButton';
import { TYPE_BASE } from '../../../constants/strings';

interface TaskCollectionPointListItemProps {
  isSelected: boolean;
  taskCollectionPoint: ITaskCollectionPoint;
  toggleTask: (taskCollection: ITaskCollection, tcpId: number) => void;
  toggleAllTasks: () => void;
  onClickPoint: () => void;
  onSelect: () => void;
}

// function getCompleteStatus(collectionPoint: ITaskCollectionPoint) {
//   let complete = true;
//   for (const tc of collectionPoint.task_collection) {
//     if (!tc.complete) {
//       complete = false;
//       return complete;
//     }
//   }
//   return complete;
// }

export const TaskCollectionPointListItem = (
  props: TaskCollectionPointListItemProps
) => {
  const {
    isSelected,
    taskCollectionPoint: collectionPoint,
    // toggleTask,
    // toggleAllTasks,
    onClickPoint,
    onSelect,
    handleClickDetailPoint,
    type,
    handleClickTaskCollection,
  } = props;

  const refTaskPoint = React.useRef(null);
  // const toggleAll = (event: any) => {
  //   event.stopPropagation();
  //   toggleAllTasks();
  // };
  const isVisible = useOnScreen(refTaskPoint);
  // const toggleCollection = (taskCollection: ITaskCollection) =>
  //   toggleTask(taskCollection, collectionPoint.id);

  // const complete = getCompleteStatus(collectionPoint);
  // const isAdmin: boolean = useSelector(_isAdmin);

  React.useEffect(() => {
    if (!isVisible && isSelected && refTaskPoint.current) {
      (refTaskPoint.current as Element).scrollIntoView();
    }
  }, [isSelected, refTaskPoint]);

  const handleClickITem = () => {
    onSelect();
    onClickPoint();
  };

  const toggleGarbageButtons = collectionPoint.task_collection.map(
    (taskCollection) => {
      const garbageName =
        type &&
        (type === TYPE_BASE
          ? taskCollection?.garbage?.name
          : taskCollection?.route_garbage?.name);
      const isCompelete = taskCollection?.complete;
      let currentColor = 'red';
      if (garbageName === '雑誌') {
        currentColor = !isCompelete ? '#3fb96d' : '#c9c9c9';
      } else if (garbageName === 'びん・缶・乾電池') {
        currentColor = !isCompelete ? '#f4cc61' : '#c9c9c9';
      } else if (garbageName === '古布') {
        currentColor = !isCompelete ? '#fd7a49' : '#c9c9c9';
      } else if (garbageName === '牛乳パック') {
        currentColor = !isCompelete ? '#5dbbe8' : '#c9c9c9';
      } else if (garbageName === 'し尿') {
        currentColor = !isCompelete ? '#aa62d8' : '#c9c9c9';
      } else if (garbageName === 'ペットボトル') {
        currentColor = !isCompelete ? '#4980ce' : '#c9c9c9';
      } else if (garbageName === 'ダンボール') {
        currentColor = !isCompelete ? '#5ed1b8' : '#c9c9c9';
      } else if (garbageName === '新聞紙') {
        currentColor = !isCompelete ? '#5ed1b8' : '#c9c9c9';
      }

      return (
        <Tag
          size='lg'
          color='white'
          background={currentColor}
          style={{
            marginBottom: 4,
            marginLeft: 0,
            marginRight: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // borderRadius: 2,
          }}
          onClick={() => {
            handleClickTaskCollection({
              taskCollection: taskCollection,
              task: collectionPoint,
            });
          }}
          key={taskCollection?.id}
        >
          <TagLabel overflow='visible' minWidth='unset'>
            {garbageName}
          </TagLabel>
        </Tag>
      );
    }
  );

  return (
    <Box
      key={collectionPoint?.id}
      padding='16px 16px 16px 24px'
      my={2}
      fontSize='0.8rem'
      // borderWidth='1px'
      userSelect='none'
      backgroundColor={isSelected ? '#F3F5F9' : '#fff'}
      ref={refTaskPoint}
      cursor='pointer'
      onClick={handleClickITem}
      borderLeft={isSelected ? '4px solid #E53E3E' : 'none'}
    >
      <HStack align='flex-start'>
        <Flex
          align='center'
          flex={1}
          justify='space-between'
          marginBottom='12px'
        >
          <HStack>
            <Text color='sidebar.background' fontSize={16}>
              {collectionPoint?.sequence}.
            </Text>
            <Text
              color={isSelected ? 'sidebar.background' : '#333'}
              fontSize={16}
              fontWeight='bold'
            >
              {collectionPoint?.name}{' '}
            </Text>
          </HStack>

          <DeepBlueButton
            onClick={() => {
              handleClickDetailPoint(collectionPoint);
            }}
            borderRadius='36px'
            size='xs'
            fontSize='12px'
            fontWeight='400'
            width='69px'
          >
            詳細
          </DeepBlueButton>
        </Flex>
      </HStack>
      <Flex wrap='wrap' justify='start'>
        {toggleGarbageButtons}
      </Flex>
    </Box>
  );
};
