import { Button } from '@chakra-ui/button';
import React, { FC, useCallback, useState } from 'react';
import { AiOutlineCamera } from 'react-icons/ai';

type Props = {
  onUploaded: (image: any) => void;
  disabled: boolean;
};

const styles = {
  container: (disabled: boolean) => ({
    height: 75,
    width: 75,
    display: 'inline-block',
    cursor: 'pointer',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: disabled ? '#dcdcdc' : '#2B6CB0',
    paddingLeft: 17.5,
    paddingTop: 17.5,
  }),
  uploadInput: {
    display: 'none',
  },
};

export const ImageUpload: FC<Props> = ({ onUploaded, disabled }) => {
  const handleTriggerUpload = useCallback(() => {
    const input = document.getElementById('create-notification-img-upload');
    const form = document.getElementById('create-notification-img-upload-form');

    form?.reset();
    input?.click();
  }, []);

  const handleUpload = useCallback(
    (event) => {
      if (disabled) {
        return;
      }

      const images = event.target.files;

      onUploaded(images);

      event.target.files = null;
    },
    [onUploaded, disabled]
  );

  return (
    <div
      className='notification-list_upload-image-button'
      onClick={handleTriggerUpload}
      // style={styles.container(disabled)}
    >
      {/* <AiFillFileImage color={disabled ? '#dcdcdc' : '#2B6CB0'} size={35} /> */}
      <Button
        disabled={disabled}
        variant='outline'
        borderRadius='27px'
        color='sidebar.background'
        fontSize='13px'
        fontWeight='400'
        width='129px'
        height='33px'
      >
        写真を選択 <AiOutlineCamera style={{ height: 18, width: 18, color: '#6F85A3', fontWeight: 600, marginLeft: 10 }} />
      </Button>
      <form id='create-notification-img-upload-form'>
        <input
          disabled={disabled}
          onChange={handleUpload}
          style={styles.uploadInput}
          id='create-notification-img-upload'
          type='file'
          accept='image/*'
          multiple
        />
      </form>
    </div>
  );
};
