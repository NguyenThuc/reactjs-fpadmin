import { TASK_ROUTE_URL, TASK_ROUTE_COURSE_URL } from '../../constants/urls';
import { hirouAxios } from '../httpInstance';

export async function getAllTaskRoute(params: any): Promise<any> {
  try {
    const response = await hirouAxios.get(TASK_ROUTE_URL, {
      params: { ...params, type: 'list' },
    });
    return response.data;
  } catch (e) {
    throw Error('Get all Task Route API failed');
  }
}

export async function getTaskRoute(taskRouteId: number): Promise<any> {
  const url = `${TASK_ROUTE_URL}${taskRouteId}/`;
  try {
    const response = await hirouAxios.get(url);
    return response.data;
  } catch (e) {
    throw Error('Get Task Route API failed');
  }
}

export async function selectTaskRouteCourse(
  courseId: number | string
): Promise<any> {
  try {
    const response = await hirouAxios.put(
      `${TASK_ROUTE_COURSE_URL}${courseId}/check/`
    );
    return response.data;
  } catch (error) {
    throw Error('Check Task Route Course API failed');
  }
}
