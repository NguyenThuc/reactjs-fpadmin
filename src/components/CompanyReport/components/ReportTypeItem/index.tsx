import React, { FC } from 'react';
import { styles } from './styles';

import { Text, Button } from '@chakra-ui/react';
import DeepBlueButton from '../../../common/DeepBlueButton';

type Props = {
  name: string;
  description: string;
  id: number;
  onEdit: () => void;
  onDelete: () => void;
};

export const CompanyReportItem: FC<Props> = ({
  name,
  description,
  onEdit,
  onDelete,
}) => {
  return (
    <div className={styles.container}>
      <div style={{ textAlign: 'left' }}>
        <Text fontSize={20} fontWeight='bold'>
          {name}
        </Text>

        {description && <Text fontSize={16}>{description}</Text>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <DeepBlueButton mr={3} onClick={onEdit}>
          編集
        </DeepBlueButton>

        <Button
          variant='outline'
          _hover=''
          backgroundColor='white'
          onClick={onDelete}
        >
          消去
        </Button>
      </div>
    </div>
  );
};
