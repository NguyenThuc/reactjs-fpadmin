import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  Container,
  Heading,
  HStack,
  Spinner,
  Flex,
  Button,
  Box,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { MemberItem } from './components/MemberItem';
import { AddMemberModal } from './components/AddMemberModal';

import { getMembers } from '../../services/apiRequests/members';
import { IMember } from '../../models/member';
import CustomCard from '../common/Card';
import DeepBlueButton from '../common/DeepBlueButton';

type Props = {};

export const MemberList: FC<Props> = ({}) => {
  const history = useHistory();
  // const [companyLen, setMembers] = useState([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [members, setMembers] = useState<IMember[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

  const getMemberList = useCallback(async ({ limit, offset }) => {
    setLoading(true);
    const data = await getMembers({ limit, offset });

    const { next, results } = data;

    if (next) {
      setHasMore(true);
    }

    setMembers(results);
    setLoading(false);
  }, []);

  const handleLoadMore = useCallback(async () => {
    setLoading(true);
    const newData = await getMembers({ limit: 10, offset: members.length });

    const { next, results } = newData;

    setHasMore(!!next);

    setMembers([...members, ...results]);
    setLoading(false);
  }, [members]);

  useEffect(() => {
    getMemberList({ limit: 20, offset: 0 });
  }, [getMemberList]);

  return (
    <Box>
      <Heading textAlign='start'>運転手</Heading>
      <CustomCard marginTop='24px' marginBottom='24px'>
        <HStack marginBottom={5} justifyContent='end'>
          <DeepBlueButton onClick={() => setAddModalOpen(true)}>
            運転手追加
          </DeepBlueButton>
        </HStack>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            width: '100%',
            marginTop: 32,
          }}
        >
          {members.map((member, index) => {
            return (
              <MemberItem
                key={index}
                username={member.username}
                id={member.id}
                onViewMemberDetail={() => history.push(`/members/${member.id}`)}
              />
            );
          })}
          {isLoading && (
            <Flex mt={6} mb={6} justify='center'>
              <Spinner />
            </Flex>
          )}
          {hasMore && !isLoading && (
            <Flex mt={6} mb={6} justify='center'>
              <Button onClick={handleLoadMore}>もっと読み込む</Button>
            </Flex>
          )}
        </div>
        <AddMemberModal
          isVisible={addModalOpen}
          setVisible={(isVisible, isReloadData) => {
            setAddModalOpen(isVisible);

            if (isReloadData) {
              // const currentOffset = members.length;
              setMembers([]);
              getMemberList({ limit: 20, offset: 0 });
            }
          }}
        />
      </CustomCard>
    </Box>
  );
};
