import { css } from '@emotion/css';

export const styles = {
  container: (logo: string) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #f3f3f3;
    border-radius: 8px;
    cursor: pointer;
    width: 250px;
    height: 250px;
    ${logo &&
    `
        border: none !important;
    `}
    &:hover {
      border: 1px solid #dcdcdc;
    }
  `,
  uploadTitle: css`
    font-size: 1rem;
    color: #dcdcdc;
  `,
  uploadInput: css`
    display: none;
  `,
};
