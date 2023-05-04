import { css, keyframes } from '@emotion/css';
import { slideInUp } from 'react-animations';

const slideInUpAnimation = keyframes`${slideInUp}`;

export const styles = {
  container: css`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  box: css`
    padding: 8px 16px;
    border-radius: 25px;
    background: #fff;
    display: flex;
    align-items: center;
    cursor: pointer;
    boxshadow: rgb(0 0 0 / 30%) 0px 1px 4px -1px;
    animation: 1s ${slideInUpAnimation};
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 5vh;
  `,
  btn: css`
    cursor: pointer;

    &:hover {
      color: #3182ce !important;
    }
  `,
};
