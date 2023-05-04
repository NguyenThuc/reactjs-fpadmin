import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  Container,
  Heading,
  HStack,
  Spinner,
  Flex,
  Button,
  useToast,
  Text,
  Box,
} from '@chakra-ui/react';
import { useParams, useHistory } from 'react-router-dom';
import { AiFillCopy } from 'react-icons/ai';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { getMemberDetail } from '../../services/apiRequests/members';
import { IMember } from '../../models/member';
import { EditMemberModal } from './components/EditMemberModal';
import { DeleteMemberModal } from './components/DeleteMemberModal';
import CustomCard from '../common/Card';
import DeepBlueButton from '../common/DeepBlueButton';

type Props = {};

export const MemberDetail: FC<Props> = () => {
  const params = useParams();
  const history = useHistory();
  const toast = useToast();

  const [memberDetail, setMemberDetail] = useState<IMember | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeletteModalOpen] = useState<boolean>(false);

  const getMemberInformation = useCallback(async () => {
    setLoading(true);

    const { id } = params as { id: number };

    const member = await getMemberDetail(id);

    if (member) {
      setMemberDetail(member);
    } else {
      toast({
        title: 'ドライバー情報の取得に失敗しました。',
        description: '',
        status: 'error',
        duration: 2000,
      });
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    getMemberInformation();
  }, [getMemberInformation]);

  return (
    <Box>
      <Heading textAlign='start'>運転手情報</Heading>
      <CustomCard marginTop='24px'>
        <HStack marginBottom={5} justifyContent='end'>
          <div>
            <Button
              disabled={isLoading || !memberDetail}
              variant='outline'
              mr={2}
              onClick={() => setDeletteModalOpen(true)}
            >
              運転手削除
            </Button>
            <DeepBlueButton
              disabled={isLoading || !memberDetail}
              onClick={() => setEditModalOpen(true)}
            >
              運転手の情報 を編集します。
            </DeepBlueButton>
          </div>
        </HStack>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            flexDirection: 'column',
            width: '100%',
            marginTop: 32,
          }}
        >
          {isLoading && (
            <Flex style={{ width: '100%' }} mt={6} mb={6} justify='center'>
              <Spinner />
            </Flex>
          )}
          {!!memberDetail && !isLoading && (
            <>
              <Text fontSize={22} fontWeight='bold' mb={2}>
                基本情報
              </Text>
              <div
                style={{
                  textAlign: 'left',
                  border: '1.5px solid #dcdcdc',
                  width: '100%',
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <p style={{ fontWeight: 'bold', fontSize: 20 }}>
                  {memberDetail.username}
                </p>
                <div
                  style={{
                    fontSize: 18,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ marginRight: 8 }}>
                    {memberDetail?.first_name ? memberDetail?.first_name : ''}
                  </div>
                  <div>
                    {memberDetail?.last_name ? memberDetail?.last_name : ''}
                  </div>
                </div>
                <div style={{ fontSize: 18 }}>{memberDetail.email}</div>
              </div>
              <Text fontSize={22} fontWeight='bold' mt={6} mb={2}>
                アカウント種類
              </Text>
              <div
                style={{
                  textAlign: 'left',
                  border: '1.5px solid #dcdcdc',
                  width: '100%',
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 'bold' }}>
                  {memberDetail.type === 'Director' ? '管理者' : '運転手'}
                </div>
              </div>

              <Text fontSize={22} fontWeight='bold' mt={6} mb={2}>
                パスワード
              </Text>
              <div
                style={{
                  textAlign: 'left',
                  border: '1.5px solid #dcdcdc',
                  width: '100%',
                  borderRadius: 12,
                  padding: 16,
                  display: 'flex',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
              >
                <CopyToClipboard
                  onCopy={() => {
                    toast({
                      title: 'パスワードをクリップボードにコピーしました。',
                      description: '',
                      status: 'info',
                      duration: 2000,
                    });
                  }}
                  text={memberDetail.raw_pw || memberDetail.password}
                >
                  <div
                    onClick={() => {}}
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                      fontSize: 16,
                    }}
                  >
                    {memberDetail.raw_pw || memberDetail.password}
                  </div>
                </CopyToClipboard>

                <AiFillCopy size={30} color='#333' />
              </div>
            </>
          )}
        </div>
        {memberDetail && (
          <EditMemberModal
            memberId={params.id}
            isVisible={editModalOpen}
            setVisible={async (isVisbile, isReloadData) => {
              setEditModalOpen(isVisbile);

              if (isReloadData) {
                getMemberInformation();
              }
            }}
            initialData={memberDetail}
          />
        )}

        <DeleteMemberModal
          memberId={params.id}
          isVisible={deleteModalOpen}
          setVisible={async (isVisbile, isGoBack) => {
            setDeletteModalOpen(isVisbile);

            if (isGoBack) {
              history.goBack();
            }
          }}
        />
      </CustomCard>
    </Box>
  );
};
