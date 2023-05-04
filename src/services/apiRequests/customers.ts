import { CUSTOMER_URL } from '../../constants/urls';
import { ICustomer } from '../../models/customer';
import { hirouAxios } from '../httpInstance';

export async function getCustomers(): Promise<ICustomer[]> {
  try {
    const url = CUSTOMER_URL;
    const response = await hirouAxios.get(url);
    return response.data;
  } catch (e) {
    throw Error('Customer API failed');
  }
}

export const addNewCustomer = async ({ name, description }) => {
  try {
    const url = CUSTOMER_URL;
    await hirouAxios.post(url, { name, description });
    return { isOk: true };
  } catch (error) {
    return { isOk: false };
  }
};

export const deleteCustomer = async (id) => {
  try {
    const url = CUSTOMER_URL + id + '/';
    await hirouAxios.delete(url);
    return { isOk: true };
  } catch (error) {
    return { isOk: false };
  }
};

export const editCustomer = async ({ id, name, description }) => {
  try {
    const url = CUSTOMER_URL + id + '/';
    await hirouAxios.put(url, { name, description });
    return { isOk: true };
  } catch (error) {
    return { isOk: false };
  }
};
