import * as React from 'react';
import { chakra, ImageProps, forwardRef } from '@chakra-ui/react';
import logo from '../../assets/logojp.png';

export const NewLogo = forwardRef<ImageProps, 'img'>((props, ref) => {
  return <chakra.img src={logo} ref={ref} {...props} />;
});
