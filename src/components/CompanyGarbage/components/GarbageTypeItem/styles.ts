import { css } from '@emotion/css';

export const styles = {
  container: css`
    width: 100%;
    height: 50px;
    max-width: 800px;
    border-radius: 12px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32px 24px;
    margin-bottom: 24px;
    box-shadow: rgb(0 0 0 / 22%) 0px 3px 10px;
    cursor: pointer;

    &:hover {
      background: #2b6cb0;
      color: #fff;
    }
  `,
};
