import { hirouAxios } from '../httpInstance';
import { NOTIFICATION_URL } from '../../constants/urls';

type Data = {
  title: string;
  content: string;
  creator: string;
  images: any[];
};

export const createNotification = async (data: Data) => {
  const { title, content, creator, images } = data;

  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', content);
  formData.append('creator', creator);

  images.forEach((img, index) => {
    formData.append('images', img.file);
  });

  try {
    const response = await hirouAxios.post(NOTIFICATION_URL, formData);

    return response.data;
  } catch (error) {
    return null;
  }
};

export const getListNotifications = async ({ limit = 50, offset = 0 }) => {
  try {
    const response = await hirouAxios.get(
      NOTIFICATION_URL + `?limit=${limit}&offset=${offset}`
    );
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getNotificationDetail = async (
  notificationId: number | string
) => {
  try {
    const response = await hirouAxios.get(
      NOTIFICATION_URL + `${notificationId}`
    );
    return response.data;
  } catch (error) {
    return null;
  }
};

export const readNotification = async (notificationId: number | string) => {
  try {
    const response = await hirouAxios.post(
      NOTIFICATION_URL + `${notificationId}/check/`
    );
    return response.data;
  } catch (error) {
    return null;
  }
};
