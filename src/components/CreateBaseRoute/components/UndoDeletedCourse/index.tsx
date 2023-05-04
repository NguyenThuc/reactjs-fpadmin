import React from 'react';
import { styles } from './styles';
import { Text } from '@chakra-ui/react';
import Countdown from 'react-countdown';
import { AiFillCloseCircle, AiOutlineUndo } from 'react-icons/ai';

type Props = {
  onClose: () => void;
  onUndo: () => void;
};

export const UndoDeletedCourse: React.FC<Props> = ({ onClose, onUndo }) => {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <AiFillCloseCircle
          onClick={onClose}
          className={styles.btn}
          style={{ marginRight: 32 }}
          size={20}
          color='#333'
        />
        <Text fontSize={14} fontWeight='bold'>
          取り消しますか?{' '}
          <Countdown
            date={Date.now() + 5000}
            onComplete={() => {
              onClose();
            }}
            renderer={({ seconds }) => {
              return `(${seconds})`;
            }}
          />
        </Text>

        <AiOutlineUndo
          onClick={onUndo}
          className={styles.btn}
          style={{ marginLeft: 8 }}
          size={20}
          color='#333'
        />
      </div>
    </div>
  );
};
