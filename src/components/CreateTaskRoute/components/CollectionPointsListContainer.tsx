import React, { FC, useState } from 'react';
import {
  Text,
  useToast,
  Spinner,
  Divider,
  Flex,
  useDisclosure,
} from '@chakra-ui/react';

import { TaskCollectionPointListItem } from './TaskCollectionPointListItem';
import { TASK_COLLECTION_POINT_URL } from '../../../constants/urls';
import { hirouAxios } from '../../../services/httpInstance';

import { ITaskCollectionPoint } from '../../../models/taskCollectionPoint';
import { CompanyWeightModal } from './CompanyWeightModal';
import { TYPE_COMPANY } from '../../../constants/strings';

type Props = {
  tcps: ITaskCollectionPoint[];
  locationFocus: ITaskCollectionPoint | null;
  toggleAllTasksLocal: (state1: any, state2: any) => void;
  onToggleTask: (
    state1: any,
    state2: any,
    callback: any,
    weight?: any | undefined
  ) => void;
  setLocationFocus: (state: any) => void;
  setSelectedTaskCollectionPoint: (state: any) => void;
  isLoading: boolean;
  selectedPointDetail: any;
  setSelectedPointDetail: any;
};

export const CollectionPointsListContainer: FC<Props> = ({
  tcps = [],
  localUnCollectionPoints,
  isShowUnCollectedPoints,
  locationFocus,
  setLocationFocus,
  toggleAllTasksLocal,
  onToggleTask,
  setSelectedTaskCollectionPoint,
  isLoading,
  isCloseCpsList,
  setCloseCpsList,
  baseRoute,
  setSelectedPointDetail,
  selectedPointDetail,
}) => {
  const toast = useToast();
  const [selectTask, setSelectedTask] = useState(null);
  const [selectTaskCollection, setSelectedTaskCollection] = useState(null);
  const {
    isOpen: isOpenCompany,
    onOpen: onOpenCompany,
    onClose: onCloseCompany,
  } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const onToggleAllTasks = async (tcp: ITaskCollectionPoint) => {
    try {
      const url = `${TASK_COLLECTION_POINT_URL}${tcp.id}/bulk_complete/`;
      const data = await hirouAxios.post(url, {});
      toggleAllTasksLocal(data.data, tcp.id);
    } catch (e) {
      toast({
        title: 'Error updating collection',
        description: 'もう一度お試しください',
        status: 'error',
      });
    }
  };

  const onClickPoint = (tcp: ITaskCollectionPoint) => {
    if (tcp.location) {
      setLocationFocus(tcp);
    }
  };

  const handleClickDetailPoint = (tcp: ITaskCollectionPoint) => {
    if (tcp.location) {
      setSelectedPointDetail(tcp);
    }
  };

  const handleClickTaskCollection = ({ task, taskCollection }) => {
    if (baseRoute?.type === TYPE_COMPANY && !taskCollection?.complete) {
      setSelectedTask(task);
      setSelectedTaskCollection(taskCollection);
      onOpenCompany();
    } else {
      setLoading(true);
      onToggleTask(taskCollection, task?.id, () => {
        setLoading(false);
      });
    }
  };

  return (
    <div
      style={{
        display: selectedPointDetail ? 'none' : 'block',
      }}
    >
      {isLoading ? (
        <div>
          <Spinner mt={4} />
        </div>
      ) : (
        <>
          {baseRoute && baseRoute?.name && !isCloseCpsList && (
            <Flex
              style={{
                fontSize: 14,
                color: '#B3B3B3',
                width: '100%',
                height: 60,
              }}
              align='center'
              justify='center'
              maxWidth='400px'
              overflow='hidden'
              whiteSpace='nowrap'
              textOverflow='ellipsis'
            >
              {baseRoute && baseRoute?.name}
            </Flex>
          )}

          {!isCloseCpsList && (
            <>
              {!(isShowUnCollectedPoints ? localUnCollectionPoints : tcps)
                .length && (
                <Text mt={2} fontSize={14} fontWeight='bold'>
                  No Collection Points
                </Text>
              )}

              <div className='cps_list-container' style={{ flex: 1 }}>
                {(isShowUnCollectedPoints ? localUnCollectionPoints : tcps).map(
                  (tcp: ITaskCollectionPoint, index: Number) => {
                    return (
                      <TaskCollectionPointListItem
                        isSelected={tcp.id === locationFocus?.id}
                        toggleAllTasks={() => onToggleAllTasks(tcp)}
                        toggleTask={onToggleTask}
                        key={tcp.id}
                        taskCollectionPoint={tcp}
                        onSelect={() => setSelectedTaskCollectionPoint(tcp)}
                        onClickPoint={() => onClickPoint(tcp)}
                        handleClickDetailPoint={handleClickDetailPoint}
                        type={baseRoute?.type}
                        handleClickTaskCollection={handleClickTaskCollection}
                      />
                    );
                  }
                )}
              </div>
            </>
          )}
          {selectTaskCollection &&
            selectTask &&
            baseRoute?.type === TYPE_COMPANY && (
              <CompanyWeightModal
                isOpen={isOpenCompany}
                onClose={() => {
                  setLoading(false);
                  setSelectedTaskCollection(null);
                  setSelectedTask(null);
                  onCloseCompany();
                }}
                setLoading={setLoading}
                loading={loading}
                pointDetails={selectTaskCollection}
                onSubmit={(callback: Function | undefined, weight: string) => {
                  onToggleTask(
                    selectTaskCollection,
                    selectTask?.id,
                    callback,
                    weight
                  );
                }}
              />
            )}
        </>
      )}
    </div>
  );
};
