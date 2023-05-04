import { COMPANY_URL } from '../../constants/urls';
import { ICompany } from '../../models/company';
import { hirouAxios } from '../httpInstance';

export async function getCompanies({
  limit = 10,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
}): Promise<{
  count: number;
  next?: string;
  previous?: string;
  results: ICompany[];
}> {
  try {
    const url = COMPANY_URL;
    const response = await hirouAxios.get(
      url + `?limit=${limit}&offset=${offset}`
    );
    return response.data;
  } catch (e) {
    return {
      results: null,
    };
  }
}

export async function getCompanyInformation(companyId: number): Promise<any> {
  try {
    const url = COMPANY_URL;
    const response = await hirouAxios.get(url + companyId);
    return response.data;
  } catch (e) {
    return null;
  }
}

export const addCompany = async (data) => {
  try {
    const formData = new FormData();
    formData.append('logo', data.logo);
    formData.append('name', data.name);
    formData.append('address', data.address);
    formData.append('website', data.website);
    formData.append('phone_number', data.phone);

    await hirouAxios.post(COMPANY_URL, formData);

    return { isOk: true };
  } catch (error) {
    return { isOk: false };
  }
};

export const editCompany = async (data) => {
  try {
    const formData = new FormData();
    if (data.logo) {
      formData.append('logo', data.logo);
    }

    formData.append('name', data.name);
    formData.append('address', data.address);
    formData.append('website', data.website);
    formData.append('phone_number', data.phone);

    await hirouAxios.put(COMPANY_URL + `${data.id}/`, formData);

    return { isOk: true };
  } catch (error) {
    return { isOk: false };
  }
};
