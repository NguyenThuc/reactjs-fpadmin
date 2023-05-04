import { ITaskCollectionPoint } from './taskCollectionPoint';
import { ICustomer } from './customer';
import { IGarbage } from './garbage';
import { ICourse } from './course';

export interface ITaskRoute {
  id: number;
  name: string;
  customer: ICustomer;
  courses: ICourse[];
  task_collection_point: ITaskCollectionPoint[];
  garbage: [IGarbage];
  date: string;
}
