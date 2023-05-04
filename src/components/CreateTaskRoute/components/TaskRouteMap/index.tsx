import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { Map, Marker, GoogleApiWrapper, InfoWindow } from 'google-maps-react';
import {
  Text,
  HStack,
  VStack,
  Container,
  useToast,
  Box,
  Button,
} from '@chakra-ui/react';
import { GOOGLE_MAPS_API_TOKEN } from '../../../../constants/mapbox';
import { ITaskRoute } from '../../../../models/taskRoute';
import { ITaskCollectionPoint } from '../../../../models/taskCollectionPoint';
import ActiveMarker from '../../../../assets/ActiveMarker.png';
import DefaultMarker from '../../../../assets/DefaultMarker.png';
import { AiFillSetting, AiOutlineLeft } from 'react-icons/ai';
import { CourseSelectionModal } from '../CourseSelectionModal';
import { ICourse } from '../../../../models/course';
import {
  selectTaskRouteCourse,
  getTaskRoute,
} from '../../../../services/apiRequests/taskRoute';
import { dispatchUpdateTaskRoute } from '../../../../store/dispatcher/TaskRoute';
import './styles.css';
import CustomCard from '../../../common/Card';
import DeepBlueButton from '../../../common/DeepBlueButton';
import { useHistory } from 'react-router-dom';
import { CustomSearchBar } from '../SearchBar';
import mapTypeImage from '../../../../assets/googleMapType.png';
import { CustomSpinner } from '../../../common/Spinner';
import ListImage from '../../../../assets/list.png';

interface TaskRouteMapProps {
  baseRoute: ITaskRoute | null;
  setBaseRoute: (route: ITaskRoute) => void;
  locationFocus: ITaskCollectionPoint | null;
  setLocationFocus: (task: ITaskCollectionPoint) => void;
}

const TaskRouteMap = (props: TaskRouteMapProps) => {
  const toast = useToast();
  const history = useHistory();
  const mapRef = useRef();
  const {
    baseRoute,
    locationFocus,
    setLocationFocus,
    setBaseRoute,
    setCloseCpsList,
    setCloseCpDetail,
    isCloseCpDetail,
    setShowUnCollectedPoints,
    onHideCollectedPoints,
    setSelectedTaskCollectionPoint,
    localUnCollectionPoints,
    isShowUnCollectedPoints,
  } = props;
  const [activeMarker, setActiveMarker] = useState(null);
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [viewport, setViewport] = useState({
    latitude: 35.679467,
    longitude: 139.771008,
    zoom: 12,
  });

  const [markers, setMarkers] = useState<any>([]);
  const [searchedMarker, setSearchedMarker] = useState<any>(null);
  const [google, setGoogle] = useState();
  const [mapType, setMapType] = useState('roadmap');
  const [zoomLevel, setZoomLevel] = useState(12);

  const [isCourseSelectionVisible, setCourseSelectionVisible] =
    useState<boolean>(false);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loadingCourseSelection, setLoadingCourseSelection] = useState(false);

  useEffect(() => {
    if (locationFocus?.location) {
      const [lat, lng] = locationFocus.location.split(',');
      setViewport({
        latitude: Number(lat),
        longitude: Number(lng),
        zoom: 16,
      });
    }
  }, [locationFocus]);

  useEffect(() => {
    if (!baseRoute) return;
    const _markers: any[] = [];

    let cps = isShowUnCollectedPoints
      ? localUnCollectionPoints
      : baseRoute?.task_collection_point;

    cps = cps.sort((a: ITaskCollectionPoint, b: ITaskCollectionPoint) => {
      return a.sequence - b.sequence;
    });

    cps?.forEach((cp: ITaskCollectionPoint) => {
      const [lat, lng] = cp.location.split(',');
      const _marker = {
        longitude: Number(lng),
        latitude: Number(lat),
        cp,
      };
      _markers.push(_marker);
    });

    setMarkers(_markers);

    if (cps.length > 0) {
      const firstCp = cps[0];
      const [lat, lng] = firstCp.location.split(',');

      setViewport({
        latitude: Number(lat),
        longitude: Number(lng),
        zoom: 16,
      });
    }
    setCourses(baseRoute.courses);
  }, [baseRoute, localUnCollectionPoints, isShowUnCollectedPoints]);

  const onFocusMaker = (marker: any, activeMarker) => {
    setActiveMarker(activeMarker);
    setShowingInfoWindow(true);
    const { cp, task_collection } = marker;
    setViewport((currentState) => ({ ...currentState, zoom: 15 }));
    setLocationFocus({ ...cp, task_collection });
    setSelectedTaskCollectionPoint(cp);
  };

  const onInfoWindowClose = () => {
    setShowingInfoWindow(false);
    setActiveMarker(null);
  };

  const handleSelectTaskRouteCourse = async (
    courseId: string | number | undefined
  ) => {
    try {
      if (!courseId) {
        return;
      }
      setLoadingCourseSelection(true);

      await selectTaskRouteCourse(courseId);

      let newTaskRouteData = null;

      if (baseRoute) {
        newTaskRouteData = await getTaskRoute(baseRoute?.id);
      }

      if (newTaskRouteData) {
        dispatchUpdateTaskRoute(newTaskRouteData);
        setBaseRoute(newTaskRouteData);

        setCourses(newTaskRouteData.courses);
      }

      setCourseSelectionVisible(false);
      setLoadingCourseSelection(false);

      toast({
        title: 'Switch course success',
        status: 'success',
      });
    } catch (error) {
      setLoadingCourseSelection(false);
      setCourseSelectionVisible(false);
      toast({
        title: "Can't switch course. please try again",
        status: 'error',
      });
    }
  };

  const markersView = useMemo(() => {
    if (!google) return null;

    return markers.map((marker: any, index: number) => {
      const isSelected = locationFocus?.id === marker.cp.id;
      return (
        <Marker
          {...props}
          key={`marker-${index}-${marker.cp.id}`}
          position={{ lat: marker.latitude, lng: marker.longitude }}
          draggable={false}
          title={String(marker.cp.sequence + 1)}
          name={String(marker.cp.sequence + 1)}
          onClick={(_, activeMarker) => onFocusMaker(marker, activeMarker)}
          icon={{
            url: isSelected ? ActiveMarker : DefaultMarker,
            // anchor: new google.maps.Point(10, 10),
            scaledSize: isSelected
              ? new google.maps.Size(30, 50)
              : new google.maps.Size(50, 50),
          }}
        >
          <div id={`marker-${marker.id}`} />
        </Marker>
      );
    });
  }, [markers, google, onFocusMaker, locationFocus]);

  const searchedMarkerView = useMemo(() => {
    if (!google || !searchedMarker) return null;

    return (
      <Marker position={{ lat: searchedMarker.lat, lng: searchedMarker.lng }} />
    );
  }, [searchedMarker]);

  const infoWindowView = useMemo(() => {
    return (
      <InfoWindow
        visible={showingInfoWindow}
        marker={activeMarker}
        onClose={onInfoWindowClose}
      >
        <VStack
          align='stretch'
          p={1}
          paddingX={0}
          flex={1}
          alignItems={'center'}
        >
          <HStack minWidth={100}>
            <Text color='black' fontWeight='bold' flexGrow={0} fontSize={16}>
              # {locationFocus?.sequence}
            </Text>
            <Text flexGrow={0} color='black' fontWeight='bold' fontSize={16}>
              |
            </Text>
            <Text
              color='black'
              fontWeight='bold'
              flexGrow={1}
              textAlign='center'
            >
              {locationFocus?.name}{' '}
            </Text>
          </HStack>
        </VStack>
      </InfoWindow>
    );
  }, [showingInfoWindow, activeMarker, locationFocus]);

  return (
    <Container
      position='relative'
      height='100%'
      width='100%'
      maxW='unset'
      m={0}
      p={0}
    >
      <Box
        position='absolute'
        left='10px'
        top='10px'
        zIndex='10'
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <Button
          width='48px'
          height='48px'
          borderRadius='50%'
          fontSize='16px'
          variant='outline'
          backgroundColor='white'
          border='none'
          color='sidebar.background'
          onClick={() => {
            history.push('/task-routes');
          }}
          marginRight='16px'
        >
          <AiOutlineLeft size={25} />
        </Button>
        <CustomCard
          display='flex'
          width='286px'
          padding='6px 6px 6px 12px'
          alignItems='center'
          justifyContent='flex-end'
          borderRadius='36px'
        >
          <Text
            fontSize='10px'
            fontWeight='500'
            color='table.headerColor'
            marginRight='12px'
          >
            表示モード
          </Text>
          <DeepBlueButton
            className='map_option_button'
            onClick={() => {
              setCloseCpsList(!isCloseCpDetail);
              setCloseCpDetail(!isCloseCpDetail);
            }}
            borderRadius='48px'
            fontSize='12px'
            style={{
              ...(isCloseCpDetail ? {} : { backgroundColor: '#ffff' }),
            }}
            {...(isCloseCpDetail ? {} : { variant: 'outline' })}
            minWidth='96px'
            marginRight='4px'
          >
            マップのみ
          </DeepBlueButton>
          <DeepBlueButton
            className='map_option_button'
            onClick={() => {
              setShowUnCollectedPoints(!isShowUnCollectedPoints);
              onHideCollectedPoints?.();
            }}
            borderRadius='48px'
            fontSize='12px'
            style={{
              ...(isShowUnCollectedPoints ? {} : { backgroundColor: '#ffff' }),
            }}
            {...(isShowUnCollectedPoints ? {} : { variant: 'outline' })}
            minWidth='96px'
          >
            未回収地点
          </DeepBlueButton>
        </CustomCard>
      </Box>
      <Box
        position='absolute'
        zIndex='10'
        bottom='30px'
        right='10px'
        display='flex'
      >
        {!!courses.length && (
          <div
            className='map_option_button'
            onClick={() => setCourseSelectionVisible(true)}
            style={{
              marginRight: '8px',
              background: '#fff',
              zIndex: 10,
              height: 48,
              width: 48,
              borderRadius: 30,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'rgb(0 0 0 / 30%) 0px 1px 4px -1px',
            }}
          >
            <img
              src={ListImage}
              alt='menu'
              style={{
                height: '28px',
                width: '28px',
                objectFit: 'contain',
              }}
            />
          </div>
        )}
        {/* <div
          className='map_option_button'
          onClick={() => {
            const { map } = mapRef.current;
            if (zoomLevel === 20) {
              return;
            }

            const zoom = zoomLevel + 1;
            setZoomLevel(zoom);
            map.setZoom(zoom);
          }}
          style={{
            marginRight: '8px',
            background: '#fff',
            zIndex: 10,
            height: 48,
            width: 48,
            borderRadius: 30,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'rgb(0 0 0 / 30%) 0px 1px 4px -1px',
          }}
        >
          <FaPlus size={25} color={zoomLevel === 20 ? '#dcdcdc' : '#333'} />
        </div> */}

        {/* <div
          className='map_option_button'
          onClick={() => {
            const { map } = mapRef.current;
            if (zoomLevel === 1) {
              return;
            }

            const zoom = zoomLevel - 1;
            setZoomLevel(zoom);
            map.setZoom(zoom);
          }}
          style={{
            marginRight: '8px',
            background: '#fff',
            zIndex: 10,
            height: 48,
            width: 48,
            borderRadius: 30,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'rgb(0 0 0 / 30%) 0px 1px 4px -1px',
          }}
        >
          <FaMinus size={25} color={zoomLevel === 1 ? '#dcdcdc' : '#333'} />
        </div> */}
      </Box>
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '16px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CustomSearchBar
          onSelectLocation={(location) => {
            setViewport({
              latitude: location.lat,
              longitude: location.lng,
              zoom: 16,
            });

            setSearchedMarker(location);
          }}
        />
      </div>
      <Box
        position='absolute'
        left='10px'
        bottom='30px'
        zIndex='10'
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <div
          className='map_option_button'
          onClick={() => {
            const { map } = mapRef.current;
            const type = mapType === 'roadmap' ? 'satellite' : 'roadmap';
            setMapType(type);
            map.setMapTypeId(type);
          }}
          style={{
            marginRight: '8px',
            zIndex: 10,
            height: 48,
            width: 48,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'rgb(0 0 0 / 30%) 0px 1px 4px -1px',
            border:
              mapType === 'satellite' ? '3px solid #55CA87' : '3px solid white',
          }}
        >
          {/* <FaMap size={25} color={mapType === 'satellite' ? '#fff' : '#333'} /> */}
          <img
            src={mapTypeImage}
            alt='mapType'
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
      </Box>

      <GoogleProvider onChange={(google: any) => setGoogle(google)} />
      {google && (
        <Map
          ref={mapRef}
          google={google}
          mapType='roadmap'
          initialCenter={{ lat: viewport.latitude, lng: viewport.longitude }}
          center={{ lat: viewport.latitude, lng: viewport.longitude }}
          zoom={zoomLevel}
          onClick={onInfoWindowClose}
          mapTypeControl={false}
          zoomControl={false}
          fullscreenControl={false}
          rotateControl={false}
          panControl={false}
          streetViewControl={false}
          onMaptypeidChanged={(map, state) => {
            const { mapTypeId } = state;
            setMapType(
              ['hybrid', 'satellite'].includes(mapTypeId)
                ? 'satellite'
                : 'roadmap'
            );
          }}
        >
          {markersView}
          {searchedMarkerView}
          {infoWindowView}
        </Map>
      )}

      <CourseSelectionModal
        courses={courses}
        isVisible={isCourseSelectionVisible}
        setVisible={setCourseSelectionVisible}
        onSubmit={handleSelectTaskRouteCourse}
      />
      {loadingCourseSelection && <CustomSpinner />}
    </Container>
  );
};

function Wrapper(props: any) {
  useEffect(() => {
    props.onChange(props.google);
  }, [props]);
  return null;
}

const GoogleProvider = GoogleApiWrapper({
  apiKey: GOOGLE_MAPS_API_TOKEN,
  language: 'ja',
  region: 'JP',
})(Wrapper);

export default TaskRouteMap;
