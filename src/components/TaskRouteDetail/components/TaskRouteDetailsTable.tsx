import * as React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { ITaskRoute } from '../../../models/taskRoute';
import { IGarbage } from '../../../models/garbage';
import { ITaskCollectionPoint } from '../../../models/taskCollectionPoint';
import { ITaskCollection } from '../../../models/taskCollection';
import { getDateTimeHour } from '../../../utils/date';

function heading(item: any) {
  return (
    <Th
      color='table.headerColor'
      fontSize='12px'
      fontWeight='600'
      key={item?.id}
    >
      {item?.text || item?.name}
    </Th>
  );
}

function value(text: string | number) {
  return <Td>{text}</Td>;
}

export const TaskRouteDetailsTable = ({ route }: { route: ITaskRoute }) => {
  const { task_collection_point, garbage: garbages } = route;
  const task_collection_points = task_collection_point.sort(
    (a: ITaskCollectionPoint, b: ITaskCollectionPoint) =>
      a.sequence - b.sequence
  );
  const getTimeCollection = (
    iGarbage: IGarbage,
    task_collections: Array<ITaskCollection>
  ) => {
    const item = task_collections.find(
      ({ garbage }) => garbage.id === iGarbage.id
    );
    if (!item) {
      return '-';
    }
    const { timestamp } = item;
    return timestamp ? getDateTimeHour(timestamp) : '-';
  };

  return (
    <>
      <Table size='sm' variant='simple' colorScheme='gray'>
        <Thead>
          <Tr height='53px'>
            {heading({ text: '集積所番号' })}
            {heading({ text: '名前' })}
            {heading({ text: '住所' })}
            {garbages?.map((item: IGarbage) => heading(item))}
          </Tr>
        </Thead>
        <Tbody>
          {task_collection_points.map((item: ITaskCollectionPoint) => (
            <Tr
              key={item.id}
              _hover={{
                backgroundColor: 'table.backgroundHover',
                cursor: 'pointer',
              }}
              height='53px'
            >
              {value(item.sequence)}
              {value(item.name)}
              {value(item.address)}
              {garbages?.map((garbage: IGarbage) =>
                value(getTimeCollection(garbage, item.task_collection))
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
};
