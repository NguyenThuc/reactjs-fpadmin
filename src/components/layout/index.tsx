import * as React from 'react';
import { Flex, Box } from '@chakra-ui/react';
import { Sidebar } from '../sidebar';

type PageLayoutProps = React.ComponentPropsWithoutRef<'div'>;

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <Flex width={'100%'} height='100%'>
      <Sidebar />
      <Box width={'100%'} flex={1} boxSizing='border-box'>
        {children}
      </Box>
    </Flex>
  );
}
