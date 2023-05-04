import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Flex, Center, useToast, Spinner } from '@chakra-ui/react';

import { getTaskRoute } from '../../services/apiRequests/taskRoute';

import TaskRouteMap from './components/TaskRouteMap';
import { useParams } from 'react-router-dom';
import { navigate } from '../../services/navigation';
import { ITaskRoute } from '../../models/taskRoute';
import { ITaskCollectionPoint } from '../../models/taskCollectionPoint';
import { TASK_COLLECTION_URL } from '../../constants/urls';
import { ITaskCollection } from '../../models/taskCollection';
import { hirouAxios } from '../../services/httpInstance';
import { CollectionPointsListContainer } from './components/CollectionPointsListContainer';
import { CollectionPointsDetailContainer } from './components/CollectionPointsDetailContainer';
import { TYPE_BASE, TYPE_COMPANY } from '../../constants/strings';
import cloneDeep from 'lodash.clonedeep';

const styles = {
  container: {
    maxWidth: 400,
    width: 400,
    maxHeight: '100%',
    height: '100%',
    background: '#fff',
    boxSizing: 'border-box',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
};

// TODO: Connect socket
export const CreateTaskRoute = () => {
  const [localCollectionPoints, setLocalCollectionPoints] = useState<
    ITaskCollectionPoint[]
  >([]);
  const [selectedTaskCollectionPoint, setSelectedTaskCollectionPoint] =
    useState<ITaskCollectionPoint | null>(null);

  const [localUnCollectionPoints, setLocalUnCollectionPoints] = useState<
    ITaskCollectionPoint[]
  >([]);
  const toast = useToast();

  const [route, setRoute] = useState<ITaskRoute | null>(null);
  const [locationFocus, setLocationFocus] =
    useState<ITaskCollectionPoint | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  const [isCloseCpsList, setCloseCpsList] = useState(false);
  const [isCloseCpDetail, setCloseCpDetail] = useState(false);
  const [isExpandCpDetail, setExpandCpDetail] = useState(false);
  const [isShowUnCollectedPoints, setShowUnCollectedPoints] = useState(false);
  //select detail task connection point
  const [selectedPointDetail, setSelectedPointDetail] = useState(null);

  const { taskRouteId }: { taskRouteId: string } = useParams();
  const selectedRouteId = Number(taskRouteId);

  const filterUnCollectedPoints = (tcps: ITaskCollectionPoint[]) => {
    if (!tcps) {
      return;
    }

    let unCollectedPoints: ITaskCollectionPoint[] = [];

    tcps.forEach((tcp) => {
      let isCollected = true;

      tcp.task_collection.forEach((tc) => {
        if (!tc.complete) {
          isCollected = false;
        }
      });

      if (!isCollected) {
        unCollectedPoints = [...unCollectedPoints, tcp];
      }
    });

    return unCollectedPoints;
  };

  const listTaskDone = useMemo(() => {
    const listTask = {};
    localCollectionPoints.forEach((collectionPoint) => {
      collectionPoint?.task_collection.forEach((task) => {
        const garbageList =
          route?.type === TYPE_BASE ? task?.garbage : task?.route_garbage;
        if (garbageList) {
          if (listTask[garbageList?.id] === undefined) {
            listTask[garbageList?.id] = {
              total: 0,
              complete: 0,
            };
          }
          listTask[garbageList?.id].total =
            listTask[garbageList?.id]?.total + 1;
          if (task?.complete) {
            listTask[garbageList?.id].complete =
              listTask[garbageList?.id]?.complete + 1;
          }
        }
      });
    });
    return listTask;
  }, [localCollectionPoints, route]);

  const init = useCallback(async () => {
    // try fetching the task route else redirect to list
    try {
      setLoading(true);
      const data = await getTaskRoute(selectedRouteId);
      setRoute(data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast({
        title: 'Incorrct route',
        description: 'please select an existing route',
        status: 'error',
      });
      navigate('/list');
    }
  }, [selectedRouteId, toast]);

  React.useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (isExpandCpDetail) {
      setCloseCpsList(true);
    } else {
      setCloseCpsList(false);
    }
  }, [isExpandCpDetail]);

  useEffect(() => {
    if (isCloseCpDetail) {
      setExpandCpDetail(false);
    }
  }, [isCloseCpDetail]);

  // useEffect(() => {
  //   if (isShowUnCollectedPoints) {
  //     setSelectedTaskCollectionPoint(
  //       localUnCollectionPoints?.length ? localUnCollectionPoints[0] : null
  //     );
  //     setLocationFocus(
  //       localUnCollectionPoints?.length ? localUnCollectionPoints[0] : null
  //     );
  //   }

  // }, [isShowUnCollectedPoints, localUnCollectionPoints, localCollectionPoints]);

  React.useEffect(() => {
    const cps = route?.task_collection_point.sort(
      (a: ITaskCollectionPoint, b: ITaskCollectionPoint) => {
        return a.sequence - b.sequence;
      }
    );
    setLocalCollectionPoints(cps ?? []);
    setSelectedTaskCollectionPoint(cps?.length ? cps[0] : null);
    setLocationFocus(cps?.length ? cps[0] : null);
    setLocalUnCollectionPoints(filterUnCollectedPoints(cps));
  }, [route]);

  const toggleTaskLocal = (updatedTask: ITaskCollection, tcpId: number) => {
    const localCollectionPointsCopy = cloneDeep(localCollectionPoints);
    localCollectionPointsCopy.forEach((tcp) => {
      if (tcp.id === tcpId) {
        let localCollectionsCopy = cloneDeep(tcp.task_collection);
        localCollectionsCopy = localCollectionsCopy.map((tc) => {
          if (tc.id === updatedTask.id) {
            return updatedTask;
          }
          return tc;
        });
        tcp.task_collection = localCollectionsCopy;
        if (selectedPointDetail && selectedPointDetail?.id === tcp.id) {
          setSelectedPointDetail(tcp);
        }
      }
    });
    setLocalCollectionPoints(localCollectionPointsCopy);
    const unCollectedTcp = filterUnCollectedPoints(localCollectionPointsCopy);
    setLocalUnCollectionPoints(unCollectedTcp);
  };

  const toggleAllTasksLocal = (
    updatedTasks: ITaskCollection[],
    tcpId: number
  ) => {
    const localCollectionPointsCopy = Array.from(localCollectionPoints);
    localCollectionPointsCopy.forEach((tcp) => {
      if (tcp.id === tcpId) tcp.task_collection = updatedTasks;
    });
    setLocalCollectionPoints(localCollectionPointsCopy);
    const unCollectedTcp = filterUnCollectedPoints(localCollectionPointsCopy);
    setLocalUnCollectionPoints(unCollectedTcp);
  };

  const handleHideCollectedPoints = () => {
    setSelectedTaskCollectionPoint(
      localUnCollectionPoints?.length ? localUnCollectionPoints[0] : null
    );
    setLocationFocus(
      localUnCollectionPoints?.length ? localUnCollectionPoints[0] : null
    );
  };

  const onToggleTask = async (
    taskCollection: ITaskCollection,
    tcpId: number,
    callback: Function | undefined,
    weight: string | undefined
  ) => {
    try {
      const url = `${TASK_COLLECTION_URL}${taskCollection.id}/`;
      const data = await hirouAxios.put(url, {
        complete: !taskCollection.complete,
        ...(route?.type === TYPE_COMPANY ? { weight: weight || 0 } : {}),
      });
      toggleTaskLocal(data.data, tcpId);
      if (callback) {
        callback();
      }
    } catch (e) {
      toast({
        title: 'Error updating collection',
        description: 'もう一度お試しください',
        status: 'error',
      });
      if (callback) {
        callback();
      }
    }
  };

  const handleDisplayRightSideBar = () => {
    if (isCloseCpDetail || isCloseCpDetail) {
      return {
        display: 'none',
      };
    }
    return {};
  };

  return (
    <Flex
      style={{
        position: 'relative',
        overflow: 'auto',
        height: '100%',
        maxHeight: '100%',
      }}
      backgroundColor='white'
      height='inherit'
    >
      <Center flex='1'>
        <TaskRouteMap
          baseRoute={route}
          setBaseRoute={setRoute}
          locationFocus={locationFocus}
          setLocationFocus={setLocationFocus}
          isCloseCpsList={isCloseCpsList}
          setCloseCpsList={setCloseCpsList}
          isCloseCpDetail={isCloseCpDetail}
          setCloseCpDetail={setCloseCpDetail}
          setShowUnCollectedPoints={setShowUnCollectedPoints}
          onHideCollectedPoints={handleHideCollectedPoints}
          localCollectionPoints={localCollectionPoints}
          localUnCollectionPoints={localUnCollectionPoints}
          isShowUnCollectedPoints={isShowUnCollectedPoints}
          setSelectedTaskCollectionPoint={setSelectedTaskCollectionPoint}
        />
      </Center>
      <div
        style={{
          ...styles.container,
          ...handleDisplayRightSideBar(),
        }}
      >
        <CollectionPointsListContainer
          tcps={localCollectionPoints}
          localUnCollectionPoints={localUnCollectionPoints}
          isShowUnCollectedPoints={isShowUnCollectedPoints}
          locationFocus={locationFocus}
          setLocationFocus={setLocationFocus}
          toggleAllTasksLocal={toggleAllTasksLocal}
          onToggleTask={onToggleTask}
          setSelectedTaskCollectionPoint={setSelectedTaskCollectionPoint}
          isLoading={isLoading}
          isCloseCpsList={isCloseCpsList}
          setCloseCpsList={setCloseCpsList}
          baseRoute={route}
          setSelectedPointDetail={setSelectedPointDetail}
          selectedPointDetail={selectedPointDetail}
        />
        {selectedPointDetail && (
          <CollectionPointsDetailContainer
            tcp={selectedPointDetail}
            toggleAllTasksLocal={toggleAllTasksLocal}
            onToggleTask={onToggleTask}
            isLoading={isLoading}
            isCloseCpDetail={isCloseCpDetail}
            setExpandCpDetail={setExpandCpDetail}
            isExpandCpDetail={isExpandCpDetail}
            setSelectedPointDetail={setSelectedPointDetail}
            baseRoute={route}
            listTaskDone={listTaskDone}
          />
        )}
      </div>
    </Flex>
  );
};
