import { ROUTE_COMPANY_CUSTOMER, ROUTE_COMPANY_GARBAGE } from '../../constants/urls';
import { hirouAxios } from '../httpInstance';


export interface IGarbageCompany {
  id: number
  route?: string
  name?: string
  description: string
}

export interface IGarbage {
  id: number
  route?: string
  name?: string
  description: string
}


export async function getCompanyCustomer(): Promise<Array<IGarbageCompany>> {
  try {
    const url = ROUTE_COMPANY_CUSTOMER;
    const response = await hirouAxios.get(
      url
    );
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
}


export async function createCompanyCustomer(
  body: Array<Omit<IGarbageCompany, 'id'>>
): Promise<Array<Omit<IGarbageCompany, 'id'>> | { error: any }> {
  try {
    const url = ROUTE_COMPANY_CUSTOMER;
    const response = await hirouAxios.post(
      url,
      body
    );
    return response.data;
  } catch (e: any) {
    if (e.response && e.response.data) {
      return { error: e.response.data }
    }
    throw new Error(e.message);
  }
}

export async function updateCompanyCustomer(
  id: string,
  body: Array<Omit<IGarbageCompany, 'id'>>
): Promise<Array<Omit<IGarbageCompany, 'id'>> | { error: any }> {
  try {
    const url = `${ROUTE_COMPANY_CUSTOMER}${id}/`;
    const response = await hirouAxios.put(
      url,
      body
    );
    return response.data;
  } catch (e) {
    if (e.response && e.response.data) {
      return { error: e.response.data }
    }
    throw new Error(e.message);
  }
}

export async function deleteCompanyCustomer(
  id: string,
): Promise<Array<Omit<IGarbageCompany, 'id'>> | { error: any }> {
  try {
    const url = `${ROUTE_COMPANY_CUSTOMER}${id}/`;
    const response = await hirouAxios.delete(
      url,
    );
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
}


export async function getCompanyGarbage(): Promise<Array<IGarbage>> {
  try {
    const url = ROUTE_COMPANY_GARBAGE;
    const response = await hirouAxios.get(
      url
    );
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function createCompanyGarbage(
  body: Array<Omit<IGarbage, 'id'>>
): Promise<Array<Omit<IGarbage, 'id'>> | { error: any }> {
  try {
    const url = ROUTE_COMPANY_GARBAGE;
    const response = await hirouAxios.post(
      url,
      body
    );
    return response.data;
  } catch (e: any) {
    if (e.response && e.response.data) {
      return { error: e.response.data }
    }
    throw new Error(e.message);
  }
}

export async function updateCompanyGarbage(
  id: string,
  body: Array<Omit<IGarbage, 'id'>>
): Promise<Array<Omit<IGarbage, 'id'>> | { error: any }> {
  try {
    const url = `${ROUTE_COMPANY_GARBAGE}${id}/`;
    const response = await hirouAxios.put(
      url,
      body
    );
    return response.data;
  } catch (e) {
    if (e.response && e.response.data) {
      return { error: e.response.data }
    }
    throw new Error(e.message);
  }
}

export async function deleteCompanyGarbage(
  id: string,
): Promise<Array<Omit<IGarbage, 'id'>> | { error: any }> {
  try {
    const url = `${ROUTE_COMPANY_GARBAGE}${id}/`;
    const response = await hirouAxios.delete(
      url,
    );
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
}