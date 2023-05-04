import { ROUTE_COMPANY_REPORT } from '../../constants/urls';
import { ITaskReport } from '../../models/taskReport';
import { hirouAxios } from '../httpInstance';

export async function getCompanyReports(
  taskRouteId?: number | undefined
): Promise<ITaskReport[]> {

  let url = `${ROUTE_COMPANY_REPORT}`;

  if (taskRouteId !== undefined) {
    url = url + `?task_route=${taskRouteId}/`
  }
  
  try {
    const response = await hirouAxios.get(url);
    return response.data;
  } catch (e) {
    throw Error('Get Company Reports API failed');
  }
}

export async function addCompanyReport(data: any): Promise<any> {
  try {
    const url = ROUTE_COMPANY_REPORT;
    const response = await hirouAxios.post(url, data);
    return response.data;
  } catch (e) {
    throw Error('Create Company Report API failed');
  }
}

export async function editCompanyReport(
  reportId: number,
  data: any
): Promise<any> {
  if (!reportId) throw Error('Please provide report id');

  try {
    const url = `${ROUTE_COMPANY_REPORT}${reportId}/`;
    const response = await hirouAxios.put(url, data, {
      'Content-Type': 'multipart/form-data',
    });
    return response.data;
  } catch (e) {
    throw Error('Update Company Report API failed');
  }
}

export async function deleteTaskReport(reportId: number): Promise<any> {
  if (!reportId) throw Error('Please provide report id');
  try {
    const url = `${ROUTE_COMPANY_REPORT}${reportId}/`;
    const response = await hirouAxios.delete(url);
    return response?.data;
  } catch (e) {
    throw Error(e?.response?.data?.detail || 'Delete Company Report API failed');
  }
}
