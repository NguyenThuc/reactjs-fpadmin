import { css } from '@emotion/css';

export const styles = {
  companyInformationContainer: css`
    flex: 1;
    display: flex;
    justify-content: center;
  `,
  informationTable: css`
    width: 100%;
    border: 1px solid #dcdcdc;
    border-radius: 12px;
    margin-left: 32px;
    padding: 16px 32px;
  `,
  tableRow: (isShowBorder: boolean) => css`
    flex: 1;
    display: flex;
    text-align: left;
    font-size: 18px;
    padding: 24px 0px;
    ${isShowBorder ? 'border-bottom: 1px solid #dcdcdc;' : ''}
  `,
  label: css`
    width: 200px;
  `,
  content: css`
    flex: 1;
    font-weight: bold;
  `,
};
