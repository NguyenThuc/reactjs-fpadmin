import React, { FC, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Text } from '@chakra-ui/react';

import Routes from '../../constants/routes';

import logo from '../../assets/banner/bannerDefault.png';

import { styles } from './styles';

const {
  BASE_ROUTE,
  TASK_ROUTE,
  NOTIFICATIONS_ROUTE,
  HISTORY_ROUTE,
  MEMBER,
  COMPANY,
  REPORTTYPE,
  GARBAGE_TYPE,
  EXPORT_CSV,
} = Routes;

export const Banner: FC = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.app);

  const isVisible = useMemo(() => {
    const { pathname } = location;

    return (
      pathname.includes(BASE_ROUTE + '/list') ||
      pathname.includes(TASK_ROUTE + '/list') ||
      pathname.includes(NOTIFICATIONS_ROUTE) ||
      pathname.includes(EXPORT_CSV) ||
      pathname.includes(HISTORY_ROUTE) ||
      pathname.includes(MEMBER) ||
      pathname.includes(COMPANY) ||
      pathname.includes(REPORTTYPE) ||
      pathname.includes(GARBAGE_TYPE)
    );
  }, [location]);

  const accountType = useMemo(() => {
    if (!user?.type) {
      return '';
    }

    if (user?.type === 'Director') {
      return ' - 管理者';
    }

    return ' - 運転手';
  }, [user]);

  if (!isVisible) {
    return null;
  }

  return (
    <div style={{
      width: '100%',
      // padding: '0px 1rem 0px 1rem'
    }}>
      <div className={styles.container}>
        <Container display='flex' maxW='container.xl' padding='0px 0px'>
          <img
            src={user?.company?.logo || logo}
            alt=''
            className={styles.logo}
          />
          <div
            style={{
              marginLeft: 12,
              fontWeight: 'bold',
              color: '#fff',
              textAlign: 'left',
            }}
          >
            <Text color='sidebar.background' fontSize='16px'>
              こんにちは {user?.username} さん
            </Text>
            <Text color='header.userNameColor' fontSize='13px'>
              {user?.company ? user?.company?.name + accountType : user?.email}
            </Text>
          </div>
        </Container>
      </div>
    </div>
  );
};
