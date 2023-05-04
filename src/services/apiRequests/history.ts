import { hirouAxios } from '../httpInstance';
import { HISTORY_URL } from '../../constants/urls';

export const getListBaseRouteHistory = async ({ limit = 100, offset = 0 }) => {
  try {
    const response = await hirouAxios.get(
      HISTORY_URL + `?limit=${limit}&offset=${offset}`
    );
    return response.data;
  } catch (error) {
    return [];
  }
};

export const readHistory = async (historyId: string | number) => {
  try {
    const response = await hirouAxios.post(HISTORY_URL + historyId + '/check/');
    return response.data;
  } catch (error) {
    return null;
  }
};
