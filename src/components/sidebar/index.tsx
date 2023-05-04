import * as React from 'react';
import { Flex, Heading, Text, Box } from '@chakra-ui/react';
import { Link, NavLink, useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { _isAdmin } from '../../store/selectors/App';
import routes from '../../constants/routes';
import { NewLogo } from '../common/NewLogo';
import { historySVG } from '../common/sidebarSVG/history';
import { CalendarSVG } from '../common/sidebarSVG/calendar';
import { RouteSVG } from '../common/sidebarSVG/route';
import { NewsSVG } from '../common/sidebarSVG/news';
import { CompanySVG } from '../common/sidebarSVG/company';
import { DriverSVG } from '../common/sidebarSVG/driver';
import { ReportSVG } from '../common/sidebarSVG/report';
import { adminMenuItem } from './adminSideBarOption';
import style from './style.module.css';
import Menu, { Item as MenuItem, SubMenu } from 'rc-menu';
import 'rc-menu/assets/index.css';
import { isElement } from 'react-dom/test-utils';

const LOGO_HEIGHT = 182;

interface ISIDE_BAR_ITEM {
  id: string;
  to?: string;
  name: string;
  isAdminScreen: boolean;
  icon?: any;
  hideForEmployee?: boolean;
  children?: ISIDE_BAR_ITEM;
}

const SIDE_BAR_OPTIONS: Array<ISIDE_BAR_ITEM> = [
  {
    id: 'task-routes',
    to: `${routes.TASK_ROUTE}/list`,
    name: 'スケジュール',
    isAdminScreen: false,
    icon: CalendarSVG,
  },
  {
    id: 'base-routes',
    to: `${routes.BASE_ROUTE}/list`,
    name: 'ルート作成',
    isAdminScreen: true,
    icon: RouteSVG,
  },
  {
    id: 'export-csv',
    to: `${routes.EXPORT_CSV}`,
    name: '月次集計',
    icon: ReportSVG,
    isAdminScreen: false,
    hideForEmployee: true,
  },
  {
    id: 'notifications',
    to: `${routes.NOTIFICATIONS_ROUTE}/list`,
    name: 'おしらせ',
    isAdminScreen: true,
    icon: NewsSVG,
  },
  {
    id: 'history',
    to: `${routes.HISTORY_ROUTE}/list`,
    name: '変更履歴',
    isAdminScreen: true,
    icon: historySVG,
  },
  ...adminMenuItem,
];

export function Sidebar() {
  const isAdmin: boolean = useSelector(_isAdmin);
  const { user } = useSelector((state) => state.app);
  const { pathname } = useLocation();
  const history = useHistory();

  if (
    !(
      pathname.includes(routes.TASK_ROUTE) ||
      pathname.includes(routes.BASE_ROUTE) ||
      pathname.includes(routes.INFORMATIOM_ROUTE) ||
      pathname.includes(routes.NOTIFICATIONS_ROUTE) ||
      pathname.includes(routes.EXPORT_CSV) ||
      pathname.includes(routes.HISTORY_ROUTE) ||
      pathname.includes(routes.COMPANY) ||
      pathname.includes(routes.MEMBER) ||
      pathname.includes(routes.REPORTTYPE) ||
      pathname.includes(routes.GARBAGE_TYPE) ||
      pathname.includes(routes.CUSTOMERS)
    ) ||
    pathname.includes(`${routes.TASK_ROUTE}/map`) ||
    (pathname.includes(routes.BASE_ROUTE) &&
      pathname !== `${routes.BASE_ROUTE}/list` &&
      pathname !== `${routes.COMPANY}/customer-list`)
  ) {
    return null;
  }

  return (
    <Box className={style.sidebar}>
      <Box
        position={'fixed'}
        w={230}
        bg='sidebar.background'
        left={26}
        top={21}
        bottom={21}
        borderRadius={10}
      >
        <Box height='100%' width='100%'>
          <Link to='/'>
            <Flex
              align='center'
              mr={5}
              w='100%'
              h={LOGO_HEIGHT}
              justify='center'
              background='linear-gradient(0deg, #2E87A3 -98.9%, #2E5FA3 83.52%)'
              borderTopRadius={10}
            >
              <Heading as='h1' size='lg' letterSpacing={'tighter'}>
                <NewLogo w='126px' h='22px' pointerEvents='none' />
              </Heading>
            </Flex>
          </Link>
          <Box
            w='100%'
            bg='sidebar.background'
            height={`calc(100% - ${LOGO_HEIGHT}px)`}
            maxHeight={`calc(100% - ${LOGO_HEIGHT}px)`}
            overflow='auto'
            borderRadius={10}
          >
            <Menu
              mode='inline'
              style={{ border: 'none', boxShadow: 'none', color: 'white' }}
              className={style.menuContainer}
            >
              {SIDE_BAR_OPTIONS.map((option) => {
                if (
                  (option.isAdminScreen && !isAdmin) ||
                  (option.hideForEmployee && user?.type !== 'Director')
                ) {
                  return null;
                }

                const isSelected = pathname.includes(option.id);
                const IconComponent = option.icon;
                return (
                  <React.Fragment key={option.id}>
                    {option?.children ? (
                      <SubMenu
                        className={style.menuSubMenu}
                        title={
                          <span
                            className='submenu-title-wrapper'
                            style={{
                              fontSize: 14,
                              display: 'inline-flex',
                              justifyItems: 'flex-start',
                              alignItems: 'center',
                            }}
                          >
                            {option.icon && (
                              <span
                                style={{
                                  marginRight: 10,
                                  display: 'inline-block',
                                }}
                              >
                                {
                                  <IconComponent
                                    color={isSelected && '#C6D5EB'}
                                  />
                                }
                              </span>
                            )}
                            {option.name}
                          </span>
                        }
                        key={option.id}
                      >
                        {option.children &&
                          Array.isArray(option.children) &&
                          option.children.map((child) => {
                            const isSubSelected = pathname.includes(child.id);
                            const IconChildComponent = child.icon;

                            if (
                              (child.isAdminScreen && !isAdmin) ||
                              (child.hideForEmployee &&
                                user?.type !== 'Director')
                            ) {
                              return null;
                            }

                            return (
                              <MenuItem
                                key={child.id}
                                onClick={() => {
                                  history.push(child.to);
                                }}
                                className={style.menuItem}
                                style={{
                                  backgroundColor: isSubSelected
                                    ? '#275089'
                                    : 'unset',
                                }}
                              >
                                <Flex
                                  align='center'
                                  justify='start'
                                  width='100%'
                                  height='100%'
                                  wordBreak='break-word'
                                  whiteSpace='pre-wrap'
                                  fontSize='14px'
                                >
                                  {child.icon && (
                                    <span style={{ marginRight: 10 }}>
                                      {
                                        <IconChildComponent
                                          color={isSubSelected && '#C6D5EB'}
                                        />
                                      }
                                    </span>
                                  )}
                                  {child.name}
                                </Flex>
                                {isSubSelected && (
                                  <Box
                                    position='absolute'
                                    bg='sidebar.selectedLine'
                                    width='8px'
                                    height='18px'
                                    left='-4px'
                                    top='50%'
                                    transform='translateY(-50%)'
                                    borderRadius='2px'
                                  ></Box>
                                )}
                              </MenuItem>
                            );
                          })}
                      </SubMenu>
                    ) : (
                      <MenuItem
                        key={option.id}
                        onClick={() => {
                          history.push(option.to);
                        }}
                        className={style.menuItem}
                        style={{
                          backgroundColor: isSelected ? '#275089' : 'unset',
                        }}
                      >
                        <Flex
                          align='center'
                          justify='start'
                          width='100%'
                          height='100%'
                          wordBreak='break-word'
                          whiteSpace='pre-wrap'
                          fontSize='14px'
                        >
                          {option.icon && (
                            <span style={{ marginRight: 10 }}>
                              {
                                <IconComponent
                                  color={isSelected && '#C6D5EB'}
                                />
                              }
                            </span>
                          )}
                          {option.name}
                        </Flex>
                        {isSelected && (
                          <Box
                            position='absolute'
                            bg='sidebar.selectedLine'
                            width='8px'
                            height='18px'
                            left='-4px'
                            top='50%'
                            transform='translateY(-50%)'
                            borderRadius='2px'
                          ></Box>
                        )}
                      </MenuItem>
                    )}
                  </React.Fragment>
                );
              })}
            </Menu>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
