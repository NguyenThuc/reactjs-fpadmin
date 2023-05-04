import { ICollectionPoint } from './collectionPoint';
import { ICustomer } from './customer';
import { IGarbage } from './garbage';
import { ICourse } from './course';

export interface IBaseRoute {
  id: number;
  name: string;
  customer: ICustomer;
  collection_point: [ICollectionPoint];
  garbage: [IGarbage];
  courses: [ICourse];
}
