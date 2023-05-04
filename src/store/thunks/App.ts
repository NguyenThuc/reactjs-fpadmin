import {
  ACCESS_TOKEN,
  USERNAME,
  USER_GROUPS,
  USER_ID,
  USER_COMPANY,
  USER_TYPE,
  USER_EMAIL,
} from '../../constants/cookie';
import { LOGIN_URL } from '../../constants/urls';
import { ILoginForm, IGroupResponse } from '../../models/user';
import { getCookie, removeAllCookies, setCookie } from '../../services/cookie';
import { hirouAxios } from '../../services/httpInstance';
import { dispatchLogin, dispatchLogout } from '../dispatcher';

export const checkLogin = () => {
  const accesstoken = getCookie(ACCESS_TOKEN);
  const username = getCookie(USERNAME);
  const userid = getCookie(USER_ID);
  const userGroups = getCookie(USER_GROUPS);
  const userCompany = getCookie(USER_COMPANY);
  const userType = getCookie(USER_TYPE);
  const userEmail = getCookie(USER_EMAIL);
  if (accesstoken && username) {
    dispatchLogin({
      company: userCompany,
      token: accesstoken,
      id: userid,
      username,
      email: userEmail,
      groups: userGroups,
      type: userType,
    });
  } else handleLogout();
};

export const handleLogout = () => {
  removeAllCookies();
  dispatchLogout();
};

export const handleLogin = async (data: ILoginForm) => {
  removeAllCookies();
  try {
    const { username, password } = data;
    const response = await hirouAxios.post(LOGIN_URL, {
      username,
      password,
    });

    const userData = response.data;

    if (userData.key) {
      setCookie(ACCESS_TOKEN, userData.key);
      setCookie(USERNAME, userData.user.username);
      setCookie(USER_ID, userData.user.id);
      setCookie(USER_COMPANY, userData.user.company);
      setCookie(USER_TYPE, userData.user.type);
      setCookie(USER_EMAIL, userData.user.email);

      let groups = [];
      if (userData.user.groups) {
        groups = userData.user.groups.map(
          (groupItem: IGroupResponse) => groupItem.name
        );
        setCookie(USER_GROUPS, groups);
      }

      dispatchLogin({
        token: userData.key,
        email: userData.user.email,
        groups,
        firstName: userData.user.first_name,
        lastName: userData.user.last_name,
        id: userData.user.id,
        profile: userData.user.profile,
        username: userData.user.username,
        company: userData.user.company,
        type: userData.user.type,
      });
    }
  } catch (e) {
    throw e;
  }
};
