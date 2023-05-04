import { MEMBER_URL } from '../../constants/urls';
import { IMember } from '../../models/member';
import { hirouAxios } from '../httpInstance';

export async function getMembers({
  limit = 10,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
}): Promise<{
  count: number;
  next?: string;
  previous?: string;
  results: IMember[];
}> {
  try {
    const url = MEMBER_URL;
    const response = await hirouAxios.get(
      url + `?limit=${limit}&offset=${offset}`
    );
    return response.data;
  } catch (e) {
    throw Error('company API failed');
  }
}

export async function getMemberInformation(memberId: number): Promise<any> {
  try {
    const url = MEMBER_URL;
    const response = await hirouAxios.get(url + memberId);
    return response.data;
  } catch (e) {
    throw Error('company API failed');
  }
}

export const addMember = async (data) => {
  try {
    const formData = new FormData();
    formData.append('username', data.username.trim());
    formData.append('password', data.password);
    formData.append('type', data.type);
    formData.append('email', data.email);
    formData.append('first_name', data.firstName);
    formData.append('last_name', data.lastName);

    await hirouAxios.post(MEMBER_URL, formData);

    return { isOk: true };
  } catch (error) {
    return { isOk: false };
  }
};

export const getMemberDetail = async (memberId: number) => {
  try {
    const url = MEMBER_URL;
    const response = await hirouAxios.get(url + `${memberId}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const updateMember = async (data) => {
  try {
    const formData = new FormData();
    formData.append('username', data.username.trim());
    formData.append('password', data.password);
    formData.append('type', data.type);
    formData.append('email', data.email);
    formData.append('first_name', data.firstName);
    formData.append('last_name', data.lastName);

    await hirouAxios.put(MEMBER_URL + `${data.id}/`, formData);

    return { isOk: true };
  } catch (error) {
    return { isOk: false };
  }
};

export const deleteMember = async (memberId: number) => {
  try {
    const url = MEMBER_URL;
    await hirouAxios.delete(url + `${memberId}`);
    return { isOk: true };
  } catch (error) {
    return { isOk: false };
  }
};
