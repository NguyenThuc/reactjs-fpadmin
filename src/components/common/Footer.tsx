import * as React from 'react';
import { Box, HStack, Link, Text, TextProps } from '@chakra-ui/layout';
import { Link as DomLink } from 'react-router-dom';

export const Copyright = (props: TextProps) => (
  <Text fontSize='sm' {...props}>
    &copy; {new Date().getFullYear()}  All rights reserved.
  </Text>
);

const Footer = () => (
  <Box>
    <HStack my={2}>


    </HStack>
    <Copyright alignSelf={{ base: 'center', sm: 'start' }} />
  </Box>
);
export default Footer;
