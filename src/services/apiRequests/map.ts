import { hirouAxios } from '../httpInstance';
import { SEARCH_LOCATION_URL } from '../../constants/urls';

export const searchLocationByText = async (keyword: string) => {
  try {
    const response = await hirouAxios.get(
      SEARCH_LOCATION_URL + `?location=${keyword}`
    );
    return response.data.results;
  } catch (error) {
    return [];
  }
};
