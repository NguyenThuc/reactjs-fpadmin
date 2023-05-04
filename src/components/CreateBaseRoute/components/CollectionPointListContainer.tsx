import React, { FC, useState } from 'react';
import { Stack } from '@chakra-ui/react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import { ICollectionPoint } from '../../../models/collectionPoint';
import { CollectionPointListItem } from './CollectionPointListItem';
import { SearchCollectionPointModal } from './SearchCollectionPointModal';

type Props = {
  cps: ICollectionPoint[];
  onEditCps: (state: any) => void;
  onDeleteCps: (state: any) => void;
  onDragCpsEnd: (state: any) => void;
};

const styles = {
  container: {
  /*  position: 'absolute',*/
    width: 385,
    // height: '38vh',
    background: '#fff',
    borderRadius: 8,
    top: 'calc(40vh + 85px)',
    left: 10,
    zIndex: 2,
     padding: '8px 0',
    // boxShadow: 'rgb(0 0 0 / 30%) 0px 1px 4px -1px',
    overflowY: 'auto',
    boxSizing: 'border-box',
  },
};

export const CollectionPointListContainer: FC<Props> = ({
  cps = [],
  onEditCps,
  onDeleteCps,
  onDragCpsEnd,
  setViewport,
  viewport,
  highlightMark,
  setHighlightMark,
}) => {
  const [isOpenSearchModal, setOpenSearchModal] = useState(false);
  return (
    <div style={styles.container}>
      {!cps.length ? (
        <div style={{ fontSize: 14, marginTop: 16 }}>
          集積所のポイント名はなしです。
        </div>
      ) : (
        <>
        </>
      )}
      <DragDropContext onDragEnd={onDragCpsEnd}>
        <Droppable droppableId='droppable'>
          {(provided, snapshot) => (
            <Stack
              ref={provided.innerRef}
              backgroundColor={snapshot.isDraggingOver ? '#dbdbdb' : 'white'}
              {...provided.droppableProps}
            >
              {cps.map((collectionPoint, index) => (
                <CollectionPointListItem
                  onEdit={onEditCps}
                  onDelete={onDeleteCps}
                  key={collectionPoint.id}
                  collectionPoint={collectionPoint}
                  index={index}
                  viewport={viewport}
                  setViewport={setViewport}
                  highlightMark={highlightMark}
                  setHighlightMark={setHighlightMark}
                />
              ))}
            </Stack>
          )}
        </Droppable>
      </DragDropContext>

      {/* <Button onClick={onAddNewCourse} mt={4} mb={4}>
        Add new course
      </Button> */}

      <SearchCollectionPointModal
        isVisible={isOpenSearchModal}
        setVisible={setOpenSearchModal}
        cps={cps}
        onSelectCp={(cp) => {
          const [lat, lng] = cp.location.split(',');

          setViewport({
            latitude: Number(lat),
            longitude: Number(lng),
            zoom: viewport.zoom,
          });

          setHighlightMark(cp);

          document.getElementById(`baserouteCp_${cp.id}`)?.scrollIntoView();

          setOpenSearchModal(false);
        }}
      />
    </div>
  );
};
