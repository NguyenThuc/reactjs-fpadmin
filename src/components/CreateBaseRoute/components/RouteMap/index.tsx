import React, {useState, useEffect, useMemo, useRef} from 'react';
import { GOOGLE_MAPS_API_TOKEN } from '../../../../constants/mapbox';
import {Container, VStack, Button, Box, Tabs, TabList, Tab, TabPanel, TabPanels, HStack, Text} from '@chakra-ui/react';
import './styles.css';
import { IBaseRoute } from '../../../../models/baseRoute';
import { ICollectionPoint } from '../../../../models/collectionPoint';
import { ICourse } from '../../../../models/course';
import CustomMarker from '../Marker';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
import SearchMarkerIcon from '../../../../assets/marker-red.png';
import { MapSearchbar } from '../../../MapSearchBar';
import { CourseListContainer } from '../CourseListContainer';
import { CollectionPointListContainer } from '../CollectionPointListContainer';
import { UndoDeletedCourse } from '../UndoDeletedCourse';
import { EditCourseNameModal } from '../EditCourseNameModal';
import mapTypeImage from "../../../../assets/googleMapType.png";
import {AiOutlineLeft} from "react-icons/ai";
import { useHistory } from 'react-router-dom';
interface RouteMapProps {
  baseRoute: IBaseRoute;
  tempMarker: any;
  setTempMarker: (state: any) => void;
  setAddCPModalOpen: (state: boolean) => void;
  updateCollectionPointCoordinates: (
    cp: ICollectionPoint,
    newCoordinates: any
  ) => void;
  courses: ICourse[];
  onDeleteCourse: (state: any) => void;
  onSelectCourse: (state: any) => void;
  onAddNewCourse: () => void;
  cps: ICollectionPoint[];
  onEditCps: (state: any) => void;
  onDeleteCps: (state: any) => void;
  onDragCpsEnd: (state: any) => void;
  undoCollectionPointAction: string | null;
  setUndoCollectionPointAction: (state: any) => void;
  onUndoDragCollectionPointAction: () => void;
  onCloseUndoCollectionPointPopup: () => void;
  onUndoDeleteCollectionPoint: () => void;
  onUndoMarker: () => void;
}

const RouteMap = (props: RouteMapProps) => {
  const mapRef = useRef();
  const history = useHistory();
  const {
    baseRoute,
    tempMarker,
    setAddCPModalOpen,
    setTempMarker,
    updateCollectionPointCoordinates,
    courses,
    setCourses,
    onDeleteCourse,
    onSelectCourse,
    onAddNewCourse,
    cps,
    onDeleteCps,
    onEditCps,
    onDragCpsEnd,
    undoCollectionPointAction,
    onUndoDragCollectionPointAction,
    onCloseUndoCollectionPointPopup,
    onUndoDeleteCollectionPoint,
    onUndoMarker,
    viewport,
    setViewport,
    highlightMark,
    setHighlightMark,
  } = props;
  const [markers, setMarkers] = useState<any>([]);
  const [searchedMarker, setSearchedMarker] = useState<any>(null);
  const [google, setGoogle] = useState();
  // const [deletedCp, setDeletedCp] = useState(null);
  const [mapType, setMapType] = useState('roadmap');
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    if (!baseRoute) return;
    const _markers: any[] = [];

    // const collectionsPoints = baseRoute?.collection_point.sort(
    //   (a: ICollectionPoint, b: ICollectionPoint) => {
    //     return a.sequence - b.sequence;
    //   }
    // );

    cps?.forEach((cp: ICollectionPoint) => {
      const [lat, lng] = cp.location.split(',');
      const _marker = {
        longitude: Number(lng),
        latitude: Number(lat),
        cp,
      };
      _markers.push(_marker);
    });
    setMarkers(_markers);
  }, [baseRoute, cps]);

  const add = (e: any) => {
    e.stopPropagation();
    setAddCPModalOpen(true);
  };

  const markersView = useMemo(() => {
    return markers.map((marker: any, index: number) => (
      <CustomMarker
        updateCollectionPointCoordinates={updateCollectionPointCoordinates}
        key={`marker-${index}-${marker.cp.id}`}
        index={index}
        marker={marker}
        setViewport={setViewport}
        viewport={viewport}
        highlightMark={highlightMark}
        setHighlightMark={setHighlightMark}
      />
    ));
  }, [markers, updateCollectionPointCoordinates]);

  const searchedMarkerView = useMemo(() => {
    if (!google || !searchedMarker) return null;

    return (
      <Marker
        position={{ lat: searchedMarker.lat, lng: searchedMarker.lng }}
        icon={{
          url: SearchMarkerIcon,
          scaledSize: new google.maps.Size(35, 50),
        }}
      />
    );
  }, [searchedMarker]);

  const onEditCourse = (_edittingCourse) => {
    setEditingCourse(_edittingCourse);
  };

  console.log(editingCourse);

  const tempMarkerUpdate = (props: any, marker: any, e: any) => {
    setTempMarker({
      longitude: e.latLng.lng(),
      latitude: e.latLng.lat(),
    });

    setViewport({
      longitude: e.latLng.lng(),
      latitude: e.latLng.lat(),
      zoom: viewport.zoom,
    });
  };

  return (
    <Container
      position='relative'
      height='100%'
      width='100%'
      maxW='unset'
      m={0}
      p={0}
    >
      <GoogleProvider onChange={(google: any) => setGoogle(google)} />
      <div
          style={{
            position: 'absolute',
            top: '10px',
            // right: '16px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
      >
        <Box bg='#2E5FA3' w='400px' p={4} color='white' marginLeft={15} borderRadius='18px'>
        <Button
            width='48px'
            float='left'
            height='48px'
            borderRadius='50%'
            fontSize='16px'
            variant='outline'
            backgroundColor='white'
            border='none'
            color='sidebar.background'
            onClick={() => {
              history.push('/base-routes/list');
            }}
            marginRight='16px'
        >
          <AiOutlineLeft size={25} />
        </Button>
          <Text fontSize='15px' float='left'> 場所を検索 場所を検索 場所を検索</Text>
        </Box>
      </div>
      <MapSearchbar
          onSelectLocation={(location) => {
            setViewport({
              latitude: location.lat,
              longitude: location.lng,
              zoom: 12,
            });
            setSearchedMarker(location);
          }}
      />
      <EditCourseNameModal
        isVisible={!!editingCourse}
        setVisible={() => {
          setEditingCourse(null);
        }}
        editingCourse={editingCourse}
        onEditSuccess={(id, newName) => {
          const newCourses = courses.map((e) => {
            if (e.id === id) {
              return {
                ...e,
                name: newName,
              };
            }

            return e;
          });

          setCourses(newCourses);
        }}
      />
      {!!undoCollectionPointAction && (
        <UndoDeletedCourse
          onClose={onCloseUndoCollectionPointPopup}
          onUndo={() => {
            if (undoCollectionPointAction === 'drag') {
              onUndoDragCollectionPointAction?.();
            }

            if (undoCollectionPointAction === 'delete') {
              onUndoDeleteCollectionPoint?.();
            }

            if (undoCollectionPointAction === 'marker') {
              onUndoMarker?.();
            }
          }}
        />
      )}

      <Map
          ref={mapRef}
          google={google}
          mapType='roadmap'
          initialCenter={{ lat: viewport.latitude, lng: viewport.longitude }}
          center={{ lat: viewport.latitude, lng: viewport.longitude }}
          zoom={viewport.zoom}
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
      </Map>

      <Tabs display='flex' flexDirection='column' overflow='auto' w='385px' height='100%'  position='absolute' paddingLeft='0' right = '0' background='#fff' fontSize='16px' fontWeight='bold'>
        <TabList style={{borderBottom:"none" ,display:'flex' ,justifyContent:"center" , padding:'20px 0' }}>
          <Tab _focus={{boxShadow: 'none'}} style={{    borderBottomWidth: "5px" , fontSize:'16px' ,fontWeight:'bold'}}>コース一覧</Tab>
          <Tab _focus={{boxShadow: 'none'}}  style={{    borderBottomWidth: "5px", fontSize:'16px', fontWeight:'bold'}}>回収スポット</Tab>
        </TabList>
        <TabPanels style={{paddingLeft :"0"}}>
          <TabPanel style={{ padding:'0'}}>
            <CourseListContainer
                courses={courses}
                onDeleteCourse={(course) => {
                  onDeleteCourse?.(course);
                }}
                onSelectCourse={onSelectCourse}
                onAddNewCourse={onAddNewCourse}
                onEditCourse={onEditCourse}
            />
          </TabPanel>
          <TabPanel style={{   padding:'0'}}>
            <CollectionPointListContainer
                cps={cps}
                onDeleteCps={onDeleteCps}
                onEditCps={onEditCps}
                onDragCpsEnd={onDragCpsEnd}
                viewport={viewport}
                setViewport={setViewport}
                highlightMark={highlightMark}
                setHighlightMark={setHighlightMark}
            />
          </TabPanel>

        </TabPanels>
      </Tabs>
      <Box
        position='absolute'
        // p={2}
        top={20.5}
        style={{
          left: 620,
        }}
      >
        {/*<VStack>*/}
        {/*  <Button*/}
        {/*    borderRadius={8}*/}
        {/*    width={115}*/}
        {/*    onClick={add}*/}
        {/*    disabled={!tempMarker}*/}
        {/*  >*/}
        {/*    追加33*/}
        {/*  </Button>*/}
        {/*</VStack>*/}
      </Box>


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
              border:  mapType === 'satellite' ? '3px solid #55CA87' : '3px solid white'
            }}
        >
          {/* <FaMap size={25} color={mapType === 'satellite' ? '#fff' : '#333'} /> */}
          <img src={mapTypeImage} alt="mapType" style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }} />
        </div>
      </Box>
    </Container>
  );
};

function Wrapper(props: any) {
  useEffect(() => {
    props.onChange(props.google);
  }, []);
  return null;
}

const GoogleProvider = GoogleApiWrapper({
  apiKey: GOOGLE_MAPS_API_TOKEN,
  language: 'ja',
  region: 'JP',
})(Wrapper);

export default RouteMap;
