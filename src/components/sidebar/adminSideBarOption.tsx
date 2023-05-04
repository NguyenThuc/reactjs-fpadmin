import routes from '../../constants/routes';
import { CompanySVG } from '../../components/common/sidebarSVG/company';
import { ReportSVG } from '../../components/common/sidebarSVG/report';
import { DriverSVG } from '../common/sidebarSVG/driver';
import { BagIcon } from '../common/sidebarSVG/bag';
import { PeopleSVG } from '../common/sidebarSVG/people';
import { TrashSVG } from '../common/sidebarSVG/trash';

export const adminMenuItem = [
  {
    id: 'government/companies',
    name: 'マスタ',
    isAdminScreen: true,
    hideForEmployee: true,
    icon: BagIcon,
    children: [
      {
        id: 'customers/list',
        to: `${routes.CUSTOMERS}/list`,
        name: '行政系 御客一覧',
        isAdminScreen: false,
        hideForEmployee: true,
        icon: PeopleSVG,
      },
      {
        id: 'garbage/list',
        to: `${routes.GARBAGE_TYPE}/list`,
        name: '行政系 ゴミの種類',
        isAdminScreen: false,
        hideForEmployee: true,
        icon: TrashSVG,
      },
      {
        id: 'report/list',
        to: `${routes.REPORTTYPE}/list`,
        name: '行政系 レポートの種類',
        isAdminScreen: true,
        icon: ReportSVG,
      },
      {
        id: 'companies/customer-list',
        to: `${routes.COMPANY}/customer-list`,
        name: '事業系 御客一覧',
        isAdminScreen: false,
        hideForEmployee: true,
        icon: PeopleSVG,
      },
      {
        id: 'companies/garbage-list',
        to: `${routes.COMPANY}/garbage-list`,
        name: '事業系 ゴミの種類',
        isAdminScreen: false,
        hideForEmployee: true,
        icon: TrashSVG,
      },
      {
        id: 'companies/report-list',
        to: `${routes.COMPANY}/report-list`,
        name: '事業系 レポートの種類',
        isAdminScreen: true,
        icon: ReportSVG,
      },
      {
        id: 'companies/detail',
        to: `${routes.COMPANY}/detail`,
        name: '会社情報',
        isAdminScreen: false,
        hideForEmployee: true,
        icon: CompanySVG,
      },
      {
        id: 'members',
        to: `${routes.MEMBER}/list`,
        name: '運転手',
        isAdminScreen: false,
        hideForEmployee: true,
        icon: DriverSVG,
      },
    ],
  },
];
