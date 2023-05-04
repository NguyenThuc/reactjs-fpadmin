import React, { useMemo, useState, useEffect } from 'react';
import './styles.css';
import { Flex, Center, useToast } from '@chakra-ui/react';
import { IBaseRoute } from '../../models/baseRoute';
import { _baseRoute } from '../../store/selectors/BaseRoute';
import { useSelector } from 'react-redux';
import { ICollectionPoint } from '../../models/collectionPoint';
import { ICourse } from '../../models/course';
import { UpdateConfirmationModal } from './components/UpdateConfirmationModal';
import { hirouAxios } from '../../services/httpInstance';
import { BASE_ROUTE_URL } from '../../constants/urls';
import { dispatchUpdateBaseRoute } from '../../store/dispatcher/BaseRoute';
import RouteMap from './components/RouteMap';
import { AddCollectionPointModal } from './components/AddCollectionPointModal';
import {
  deleteCollectionPoint,
  editCollectionPoint,
} from '../../services/apiRequests/collectionPoint';
import {
  addNewCourse,
  selectCourse,
  deleteCourse,
  getBaseRoute,
} from '../../services/apiRequests/baseRoute';
import { handleFetchUpdatedBaseRoute } from '../../store/thunks/BaseRoute';
import { useParams } from 'react-router-dom';
import { navigate } from '../../services/navigation';
import { NewAddCollectionPointModal } from './components/NewAddCollectionPointModal';

// TODO: Connect socket
export const CreateBaseRoute = () => {
  const [isSeqUpdateModalOpen, setIsSeqUpdateModalOpen] = useState(false);
  const [localCollectionPoints, setLocalCollectionPoints] = useState<
    ICollectionPoint[]
  >([]);
  const [localCourse, setLocalCourse] = useState<ICourse[]>([]);
  const cancelRef = React.useRef();
  const toast = useToast();

  const [selectedCollectionPoint, setSelectedCollectionPoint] =
    useState<ICollectionPoint | null>(null);
  const [isAddCPModalOpen, setAddCPModalOpen] = useState(false);
  const [undoCollectionPointAction, setUndoCollectionPointAction] = useState<
    'drag' | 'delete' | 'marker' | null
  >(null);
  const [prevLocalCollectionPoints, setPrevLocalCollectionPoints] = useState<
    ICollectionPoint[]
  >([]);
  const [prevDeletedCollectionPoints, setPrevDeletedCollectionPoint] =
    useState<ICollectionPoint | null>(null);
  const [prevMarker, setPrevMarker] = useState<ICollectionPoint | null>(null);

  const [tempMarker, setTempMarker] = useState<any>(null);

  const baseRoutesData: any = useSelector(_baseRoute);

  const { baseRouteId }: { baseRouteId: string } = useParams();
  const selectedRouteId = Number(baseRouteId);

  const [viewport, setViewport] = useState(null);
  const [highlightMark, setHighlightMark] = useState(null);

  const route: IBaseRoute = useMemo(() => {
    const baseRoute = baseRoutesData.data.find(
      (baseRoute: IBaseRoute) => baseRoute.id === selectedRouteId
    );
    return baseRoute;
  }, [baseRoutesData, selectedRouteId]);

  useEffect(() => {
    async function init() {
      // try fetching the route else redirect to list
      try {
        await handleFetchUpdatedBaseRoute(selectedRouteId);
      } catch (e) {
        toast({
          title: 'Incorrct route',
          description: 'please select an existing route',
          status: 'error',
        });
        navigate('/list');
      }
    }

    init();
  }, [selectedRouteId, toast]);

  useEffect(() => {
    if (!viewport) {
      if (localCollectionPoints.length) {
        const firstCp = localCollectionPoints[0];
        const [lat, lng] = firstCp.location.split(',');
        setViewport({
          latitude: Number(lat),
          longitude: Number(lng),
          zoom: 12,
        });
        setHighlightMark(firstCp);
      } else {
        setViewport({
          latitude: 35.679467,
          longitude: 139.771008,
          zoom: 12,
        });
      }
    }
  }, [localCollectionPoints, viewport]);

  useEffect(() => {
    const cps = route?.collection_point.sort(
      (a: ICollectionPoint, b: ICollectionPoint) => {
        return a.sequence - b.sequence;
      }
    );

    const cs = (route?.courses || []).sort((a: any, b: any) => {
      return a.id - b.id;
    });
    setLocalCollectionPoints(cps);
    setLocalCourse(cs);
  }, [route, viewport]);

  const reorder = (
    list: ICollectionPoint[] | ICourse[],
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = async (e: any) => {
    if (!e.destination || undoCollectionPointAction) return;
    if (e.destination.index === e.source.index) return;
    const items = reorder(
      localCollectionPoints,
      e.source.index,
      e.destination.index
    );
    setPrevLocalCollectionPoints(localCollectionPoints);
    setLocalCollectionPoints(items);

    try {
      const list = items.map((cp) => cp.id);
      const url = `${BASE_ROUTE_URL}${route.id}/reorder_points/`;
      const data = { points: list };
      const response = await hirouAxios.post(url, data);
      const _data = response.data;
      dispatchUpdateBaseRoute(_data);
      setUndoCollectionPointAction('drag');
    } catch (e) {
      setPrevLocalCollectionPoints([]);
      toast({
        title: 'アップデート中にエラーが発生しました。',
        description: 'もう一度お試しください',
        status: 'error',
      });
    }
    // setIsSeqUpdateModalOpen(true);
  };

  const onUndoDragCollectionPointAction = async () => {
    setLocalCollectionPoints(prevLocalCollectionPoints);

    const list = prevLocalCollectionPoints.map((cp) => cp.id);
    setPrevLocalCollectionPoints([]);
    setUndoCollectionPointAction(null);
    const url = `${BASE_ROUTE_URL}${route.id}/reorder_points/`;
    const data = { points: list };
    const response = await hirouAxios.post(url, data);
    const _data = response.data;
    dispatchUpdateBaseRoute(_data);
  };

  const onCloseUndoCollectionPointPopup = async () => {
    if (undoCollectionPointAction === 'drag') {
      setPrevLocalCollectionPoints([]);
    }

    if (undoCollectionPointAction === 'delete') {
      try {
        if (prevDeletedCollectionPoints) {
          await deleteCollectionPoint(prevDeletedCollectionPoints.id);
          handleFetchUpdatedBaseRoute(selectedRouteId);
        }
        setPrevDeletedCollectionPoint(null);
      } catch {
        // toast({
        //   title: 'Error deleting collection point',
        //   description: 'もう一度お試しください',
        //   status: 'error',
        // });
      }
    }

    if (undoCollectionPointAction === 'marker') {
      setPrevMarker(null);
    }

    setUndoCollectionPointAction(null);
  };

  const handleEditClicked = (cp: ICollectionPoint) => {
    if (undoCollectionPointAction) {
      return;
    }

    const _cp = getCPFromId(cp.id);
    if (_cp) {
      setSelectedCollectionPoint(_cp);
      setAddCPModalOpen(true);
    }
  };

  const onEditModalClose = () => {
    setSelectedCollectionPoint(null);
    setAddCPModalOpen(false);
    setTempMarker(null);
  };

  const getCPFromId = (cpId: number) =>
    route.collection_point.find((cp: ICollectionPoint) => cp.id === cpId);

  const handleDeleteClicked = (cp: ICollectionPoint) => {
    if (undoCollectionPointAction) return;

    const _cp = getCPFromId(cp.id);
    if (_cp) {
      setSelectedCollectionPoint(_cp);

      setPrevDeletedCollectionPoint(_cp);
      setPrevLocalCollectionPoints(localCollectionPoints);

      const newLocalCollectionPoints = localCollectionPoints.filter(
        (cp) => cp.id !== _cp.id
      );

      setLocalCollectionPoints(newLocalCollectionPoints);

      setUndoCollectionPointAction('delete');

      // toast({
      //   title: 'Collection point deleted',
      //   description: '',
      //   duration: 1000,
      // });
    }
  };

  const onUndoDeleteCollectionPoint = () => {
    setLocalCollectionPoints(prevLocalCollectionPoints);
    setPrevLocalCollectionPoints([]);
    setPrevDeletedCollectionPoint(null);
    setUndoCollectionPointAction(null);
  };

  const handleAddNewCourse = async () => {
    try {
      const course = await addNewCourse(selectedRouteId);

      setLocalCourse([...localCourse, course]);

      toast({
        title: 'コースを作成できました。',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'コースを作成できません。もう一度お試しください。',
        status: 'error',
        duration: 2000,
      });
    }
  };

  const handleSelectCourse = async (
    selectedCourse: ICourse,
    courseList: ICourse[]
  ) => {
    try {
      const newCourse = await selectCourse(selectedCourse.id);

      const newBaseRoute = await getBaseRoute(Number(baseRouteId));

      const cps = newBaseRoute.collection_point.sort(
        (a: ICollectionPoint, b: ICollectionPoint) => {
          return a.sequence - b.sequence;
        }
      );

      setLocalCollectionPoints(cps);

      const newLocalCourse = courseList.map((course: ICourse) => {
        if (course.id === newCourse.id) {
          return newCourse;
        }

        return {
          ...course,
          checked: false,
        };
      });

      return newLocalCourse;
    } catch (error) {
      toast({
        title: 'コースが選択できません。',
        status: 'error',
      });
    }
  };

  const handleDeleteCourse = async (selectedCourse: ICourse) => {
    try {
      await deleteCourse(selectedCourse.id);
      const courses = localCourse.filter(
        (course: ICourse) => course.id !== selectedCourse.id
      );

      setLocalCourse(courses as ICourse[]);

      toast({
        title: 'コースは削除できました。',
        status: 'success',
      });
    } catch (error) {
      toast({
        title: 'コースは削除できませんでした。',
        status: 'error',
      });
    }
  };

  const handleCheckCourse = async (selectedCourse: ICourse) => {
    const newLocalCourse = await handleSelectCourse(
      selectedCourse,
      localCourse
    );
    setLocalCourse(newLocalCourse as ICourse[]);
  };

  const updateCollectionPointCoordinates = async (
    cp: ICollectionPoint,
    newCoordinates: any
  ) => {
    try {
      const _cp = getCPFromId(cp.id);
      if (_cp) {
        setPrevMarker(_cp);
        const { longitude, latitude } = newCoordinates;
        const newLocation = `${latitude},${longitude}`;
        await editCollectionPoint(_cp.id, {
          name: _cp.name,
          address: _cp.address,
          memo: _cp.memo,
          location: newLocation,
          sequence: _cp.sequence,
        });
        handleFetchUpdatedBaseRoute(selectedRouteId);
        setUndoCollectionPointAction('marker');
        // toast({
        //   title: '更新された収集ポイント',
        //   description: '',
        //   status: 'success',
        //   duration: 1000,
        // });
      }
    } catch (e) {
      toast({
        title: 'エラー',
        description: 'ログイン情報をご確認ください。',
        status: 'error',
        duration: 1000,
      });
    }
  };

  const onUndoMarker = async () => {
    if (!prevMarker) return;
    try {
      await editCollectionPoint(prevMarker.id, {
        name: prevMarker.name,
        address: prevMarker.address,
        memo: prevMarker.memo,
        location: prevMarker.location,
        sequence: prevMarker.sequence,
      });

      handleFetchUpdatedBaseRoute(selectedRouteId);

      setLocalCollectionPoints(
        localCollectionPoints.map((e) => {
          if (e.id === prevMarker.id) {
            return {
              ...e,
              ...prevMarker,
            };
          }

          return e;
        })
      );

      setUndoCollectionPointAction(null);
      setPrevMarker(null);
    } catch (error) {}
  };

  return (
    <Flex backgroundColor='white' height='inherit'>
      <Center flex='1'>
        {!!viewport && (
          <RouteMap
            viewport={viewport}
            highlightMark={highlightMark}
            setHighlightMark={setHighlightMark}
            setViewport={setViewport}
            tempMarker={tempMarker}
            setTempMarker={setTempMarker}
            setAddCPModalOpen={setAddCPModalOpen}
            baseRoute={route}
            updateCollectionPointCoordinates={updateCollectionPointCoordinates}
            courses={localCourse}
            setCourses={setLocalCourse}
            onDeleteCourse={handleDeleteCourse}
            onSelectCourse={handleCheckCourse}
            onAddNewCourse={handleAddNewCourse}
            cps={localCollectionPoints}
            onDeleteCps={handleDeleteClicked}
            onEditCps={handleEditClicked}
            onDragCpsEnd={onDragEnd}
            undoCollectionPointAction={undoCollectionPointAction}
            setUndoCollectionPointAction={setUndoCollectionPointAction}
            onUndoDragCollectionPointAction={onUndoDragCollectionPointAction}
            onCloseUndoCollectionPointPopup={onCloseUndoCollectionPointPopup}
            onUndoDeleteCollectionPoint={onUndoDeleteCollectionPoint}
            onUndoMarker={onUndoMarker}
          />
        )}
      </Center>
      {/* <AddCollectionPointModal
        collectionPoint={selectedCollectionPoint}
        marker={tempMarker}
        baseRouteId={route?.id}
        isOpen={isAddCPModalOpen}
        onClose={onEditModalClose}
        maxSequence={localCollectionPoints.length}
        route={route}
      /> */}
      {isAddCPModalOpen && (
        <NewAddCollectionPointModal
          collectionPoint={selectedCollectionPoint}
          marker={tempMarker}
          baseRouteId={route?.id}
          isOpen={isAddCPModalOpen}
          onClose={onEditModalClose}
          maxSequence={localCollectionPoints.length}
          route={route}
        />
      )}
      {/* <UpdateConfirmationModal
        onAccept={onSeqUpdate}
        cancelRef={cancelRef}
        onCancel={onSeqUpdateModalClose}
        isOpen={isSeqUpdateModalOpen}
      /> */}
      {/* <CollectionPointDeleteConfirmationModal
        onAccept={onHideSelectedCollectionPoint}
        cancelRef={cancelRef}
        onCancel={onDeleteModalClose}
        isOpen={isDeleteModalOpen}
      /> */}
    </Flex>
  );
};
