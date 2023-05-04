import React, { useMemo } from 'react';
import { Flex, Button, Box, Text } from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { IUser } from '../../models/user';
import { handleLogout } from '../../store/thunks/App';
import { MdArrowBack } from 'react-icons/md';
import { goBack } from '../../services/navigation';
import Routes from '../../constants/routes';
import { useLocation } from 'react-router-dom';
import { HeaderAvatarSVG } from './sidebarSVG/headerAvatarSVG';

const showBackButton = (pathname: string) => {
  return (
    pathname.includes(`${Routes.TASK_ROUTE}/map`) ||
    (pathname.includes(Routes.BASE_ROUTE) &&
      pathname !== `${Routes.BASE_ROUTE}/list`)
  );
};

const Header = (props: any) => {
  const { user, ...rest } = props;
  const { pathname } = useLocation();

  const showBack = useMemo(() => showBackButton(pathname), [pathname]);

  return (
    <Flex
      as='nav'
      align='center'
      justify='start'
      wrap='wrap'
      padding={4}
      height='71px'
      {...rest}
      borderBottom='1px solid #C6D5EB'
    >
      <Box display="flex" alignItems='center' justifyContent='space-between' flexGrow={1} paddingLeft="258px">
        {user && (
          <>
            <Flex alignItems='center'>
              <HeaderAvatarSVG />
              <Text marginLeft='10px' color='header.userNameColor' fontSize='14px'>{user.username}</Text>
            </Flex>
            <Button
              variant='outline'
              onClick={handleLogout}
              size='sm'
              borderRadius='48px'
              borderColor='#D9D9D9'
              backgroundColor='#F5F5F5'
            >
              ログアウト
            </Button>
          </>
        )}
      </Box>
    </Flex >
  );
};

export default Header;
