import React, { useEffect, useRef } from 'react';
import { ICollectionPoint } from '../../../../models/collectionPoint';
// import { UpdateConfirmationModal } from '../UpdateConfirmationModal';
import { Marker as Mapmarker } from 'google-maps-react';
import MarkerIcon from '../../../../assets/marker-green.png';
import SelectedMarker from '../../../../assets/marker-red.png';

interface MarkerProps {
  marker: any;
  index: number;
  updateCollectionPointCoordinates: (
    cp: ICollectionPoint,
    newCoordinates: any
  ) => void;
}

export default function Marker(props: MarkerProps) {
  const {
    marker,
    index,
    updateCollectionPointCoordinates,
    google,
    setViewport,
    viewport,
    highlightMark,
    setHighlightMark,
  } = props;

  // const cancelRef = useRef();

  const [location, setLocation] = React.useState(marker);

  // console.log('marker', marker);

  useEffect(() => {
    setLocation(marker);
  }, [marker]);
  // const [isOpen, setIsOpen] = React.useState(false);

  // const onUpdate = () => {
  //   try {
  //     updateCollectionPointCoordinates(marker.cp, {
  //       longitude: location.longitude,
  //       latitude: location.latitude,
  //     });
  //     setIsOpen(false);
  //   } catch (e) {}
  // };

  // const onCancel = () => {
  //   setLocation(marker);
  //   setIsOpen(false);
  // };

  const handleCpDrag = (props: any, mapMarker: any, e: any) => {
    setViewport({
      longitude: e.latLng.lng(),
      latitude: e.latLng.lat(),
      zoom: viewport.zoom,
    });

    setHighlightMark(marker.cp);

    const element = document.getElementById(`baserouteCp_${marker.cp.id}`);

    if (element) {
      element.scrollIntoView();
    }

    setLocation({
      longitude: e.latLng.lng(),
      latitude: e.latLng.lat(),
    });
    // setIsOpen(true);

    updateCollectionPointCoordinates(marker.cp, {
      longitude: e.latLng.lng(),
      latitude: e.latLng.lat(),
    });
  };

  if (!google) return null;

  return (
    <>
      <Mapmarker
        onClick={(props: any, mapMarker: any, e: any) => {
          setViewport({
            longitude: e.latLng.lng(),
            latitude: e.latLng.lat(),
            zoom: viewport.zoom,
          });

          setHighlightMark(marker.cp);

          const element = document.getElementById(
            `baserouteCp_${marker.cp.id}`
          );

          if (element) {
            element.scrollIntoView();
          }
        }}
        {...props}
        position={{ lat: location.latitude, lng: location.longitude }}
        draggable={true}
        title={String(index + 1) + `. ${marker.cp.name}`}
        name={String(index + 1)}
        label={{
          text: String(index + 1),
          fontWeight: 'bold',
        }}
        onDragend={handleCpDrag}
        icon={{
          url: marker.cp.id === highlightMark?.id ? SelectedMarker : MarkerIcon,
          // anchor: new google.maps.Point(10, 10),
          scaledSize: new google.maps.Size(35, 50),
        }}
        styles={{ background: '#fff' }}
      />
      {/* <UpdateConfirmationModal
        cancelRef={cancelRef}
        onAccept={onUpdate}
        onCancel={onCancel}
        isOpen={isOpen}
      /> */}
    </>
  );
}
