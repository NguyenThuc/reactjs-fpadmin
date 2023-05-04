import { REPORT_TYPE_URL } from '../../constants/urls';
import { ITaskReportType } from '../../models/taskReportType';
import { hirouAxios } from '../httpInstance';

export async function getReportTypes(): Promise<ITaskReportType[]> {
  try {
    const url = REPORT_TYPE_URL;
    const response = await hirouAxios.get(url);
    return response.data;
  } catch (e) {
    return [];
  }
}

export async function addReportType({
  name,
  description,
}: {
  name: string;
  description?: string;
}): Promise<any> {
  try {
    await hirouAxios.post(REPORT_TYPE_URL, { name, description });
    return { isOk: true };
  } catch (e) {
    return { isOk: false };
  }
}

export async function editReportType({
  id,
  name,
  description,
}: {
  id: string;
  name: string;
  description?: string;
}): Promise<any> {
  try {
    await hirouAxios.put(REPORT_TYPE_URL + id + '/', { name, description });
    return { isOk: true };
  } catch (e) {
    return { isOk: false };
  }
}

export async function deleteReportType(id: string): Promise<any> {
  try {
    await hirouAxios.delete(REPORT_TYPE_URL + id + '/');
    return { isOk: true };
  } catch (e) {
    return { isOk: false };
  }
}
