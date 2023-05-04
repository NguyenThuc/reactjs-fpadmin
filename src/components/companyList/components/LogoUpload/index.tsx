import React, { FC, useCallback } from 'react';
import { styles } from './styles';

type Props = {
  onUploaded: (image: any) => void;
  logo: string;
};

export const LogoUpload: FC<Props> = ({ onUploaded, logo }) => {
  const handleTriggerUpload = useCallback(() => {
    const input = document.getElementById('create-notification-img-upload');
    const form = document.getElementById('create-notification-img-upload-form');

    form?.reset();
    input?.click();
  }, []);

  const handleUpload = useCallback(
    (event) => {
      const image = event.target.files[0];

      onUploaded(image);

      event.target.files = null;
    },
    [onUploaded]
  );

  return (
    <div className={styles.container(logo)} onClick={handleTriggerUpload}>
      {!logo && <div className={styles.uploadTitle}>Upload logo here!</div>}

      {!!logo && (
        <img
          src={logo}
          style={{ height: '100%', width: '100%', objectFit: 'contain' }}
          alt='logo'
        />
      )}

      <form id='create-notification-img-upload-form'>
        <input
          onChange={handleUpload}
          className={styles.uploadInput}
          id='create-notification-img-upload'
          type='file'
          accept='image/*'
        />
      </form>
    </div>
  );
};
