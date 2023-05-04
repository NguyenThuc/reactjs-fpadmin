import * as React from 'react';
import { chakra, ImageProps, forwardRef } from '@chakra-ui/react';
import logo from '../../assets/routor.png';
import logo2 from '../../assets/routor_white.png';

export const Logo = forwardRef<ImageProps, 'img'>((props, ref) => {
  return (
    <chakra.img src={props.isWhiteIcon ? logo2 : logo} ref={ref} {...props} />
  );
});
