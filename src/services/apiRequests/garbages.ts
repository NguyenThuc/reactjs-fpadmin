import { GARBAGE_URL } from '../../constants/urls';
import { IGarbage } from '../../models/garbage';
import { hirouAxios } from '../httpInstance';

export async function getGarbages(): Promise<IGarbage[]> {
  try {
    const url = GARBAGE_URL;
    const response = await hirouAxios.get(url);
    return response.data;
  } catch (e) {
    throw Error('Garbage API failed');
  }
}

export const addGarbageType = async ({ name, description }) => {
  try {
    const url = GARBAGE_URL;
    await hirouAxios.post(url, { name, description });
    return { isOk: true };
  } catch (error) {
    return { isOk: false };
  }
};

export const deleteGarbageType = async (id) => {
  try {
    const url = GARBAGE_URL + id + '/';
    await hirouAxios.delete(url);
    return { isOk: true };
  } catch (error) {
    return { isOk: false };
  }
};

export const editGarbageType = async ({ id, name, description }) => {
  try {
    const url = GARBAGE_URL + id + '/';
    await hirouAxios.put(url, { name, description });
    return { isOk: true };
  } catch (error) {
    return { isOk: false };
  }
};
