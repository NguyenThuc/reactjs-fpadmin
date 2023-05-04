import React, { FC } from 'react';
import { styles } from './styles';

import { Text, Button } from '@chakra-ui/react';
import DeepBlueButton from '../../../common/DeepBlueButton';

type Props = {
  username: string;
  id: number;
  onViewMemberDetail: () => void;
};

export const MemberItem: FC<Props> = ({ username, id, onViewMemberDetail }) => {
  return (
    <div className={styles.container}>
      <Text fontSize={20} fontWeight='bold'>
        {username}
      </Text>

      <DeepBlueButton _hover='' onClick={onViewMemberDetail}>
        情報を見る
      </DeepBlueButton>
    </div>
  );
};
