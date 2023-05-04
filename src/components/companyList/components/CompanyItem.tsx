import React, { FC } from 'react';
import './styles.css';

import { Text, Button } from '@chakra-ui/react';

type Props = {
  name: string;
  id: number;
  onViewCompanyDetail: () => void;
};

export const CompanyItem: FC<Props> = ({ name, id, onViewCompanyDetail }) => {
  return (
    <div className='companyItem_container'>
      <Text fontSize={20} fontWeight='bold'>
        {name}
      </Text>

      <Button color='#333' colorScheme='yellow' onClick={onViewCompanyDetail}>
        View
      </Button>
    </div>
  );
};
