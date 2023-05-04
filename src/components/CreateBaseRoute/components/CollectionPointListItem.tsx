import * as React from 'react';
import { Box, Text, Image, HStack, VStack, Button } from '@chakra-ui/react';
import { MdDeleteForever, MdEdit } from 'react-icons/md';
import { TiLocationArrow, TiDocumentText } from 'react-icons/ti';
import { Draggable } from 'react-beautiful-dnd';
import { ICollectionPoint } from '../../../models/collectionPoint';

interface CollectionPointListItemProps {
  collectionPoint: ICollectionPoint;
  index: number;
  onEdit: (collectionPoint: ICollectionPoint) => void;
  onDelete: (collectionPoint: ICollectionPoint) => void;
}

export const CollectionPointListItem = (
  props: CollectionPointListItemProps
) => {
  const {
    collectionPoint,
    index,
    onEdit,
    onDelete,
    setViewport,
    viewport,
    setHighlightMark,
    highlightMark,
  } = props;

  const onEditClick = () => onEdit(collectionPoint);
  const onDeleteClick = () => onDelete(collectionPoint);

  return (
    <Draggable
      key={collectionPoint.id}
      draggableId={String(collectionPoint.id)}
      index={index}
    >
      {(provided, snapshot) => (
        <Box
          id={`baserouteCp_${collectionPoint.id}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          fontSize='0.8rem'
          width='385px'
          padding='20px'
          borderLeft= {snapshot.isDragging || highlightMark?.id === collectionPoint?.id ? '4px solid red' : ''}
          userSelect='none'
          backgroundColor={
            snapshot.isDragging || highlightMark?.id === collectionPoint?.id
              ? '#F3F5F9'
              : 'white'
          }

          style={provided.draggableProps.style}
        >
          <HStack
            onClick={() => {
              const [lat, lng] = collectionPoint.location.split(',');

              setViewport({
                latitude: Number(lat),
                longitude: Number(lng),
                zoom: viewport.zoom,
              });

              setHighlightMark(collectionPoint);
            }}
            align='flex-start'
          >
            <Text fontWeight='bold' color='#2E5FA3' lineHeight='25px' fontSize={14} >
              {collectionPoint.sequence}</Text>
            {collectionPoint.image ? (
              <Image
                minHeight='40px'
                minWidth='60px'
                height='40px'
                width='60px'
                src={collectionPoint.image}
                alt='image'
                objectFit='contain'
                fontSize='10px'
                backgroundColor='gray.100'
                borderRadius={8}
              />
            ) : (
              <div
                style={{
                  height: 40,
                  width: 60,
                  background: '#dcdcdc',
                  borderRadius: 8,
                }}
              ></div>
            )}

            <VStack align='stretch' p={1} paddingX={0} flex={1}>
              <HStack ml={1}>
                <Text  fontSize={14} color= { snapshot.isDragging || highlightMark?.id === collectionPoint?.id
                    ? '#2E5FA3'
                    : 'black'} >{collectionPoint.name} </Text>
              </HStack>
            </VStack>

            <VStack  display='inline-block' >

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
                  float='left'
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

              <Button
                  border='1px'
                  mr={2}
                  marginTop='0px!important'
                  padding='15px'
                  float='left'
                  //colorScheme='gray'
                  borderColor='red'
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
                    onDeleteClick();
                  }}
              >
                編集
              </Button>
              {/*<Button colorScheme='red' size='xs' onClick={onDeleteClick}>*/}
              {/*  /!*<MdDeleteForever />*!/*/}
              {/*</Button>*/}
            </VStack>
          </HStack>
        </Box>
      )}
    </Draggable>
  );
};
