import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  Container,
  Heading,
  HStack,
  Spinner,
  Flex,
  useToast,
  Text,
  Button,
  Box,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';

import { getCompanyInformation } from '../../services/apiRequests/company';
import { ICompany } from '../../models/company';
import { styles } from './styles';
import { EditCompanyModal } from './components/EditCompanyModal';
import CustomCard from '../common/Card';
import DeepBlueButton from '../common/DeepBlueButton';

type Props = {};

export const CompanyDetail: FC<Props> = () => {
  const toast = useToast();
  const { user } = useSelector((state) => state.app);

  const [companyDetail, setCompanyDetail] = useState<ICompany | null>(null);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  const getCompany = useCallback(async () => {
    setLoading(true);

    const { id } = user.company;

    const company = await getCompanyInformation(id);

    if (company) {
      setCompanyDetail(company);
    } else {
      toast({
        title: 'Get company information failed',
        description: '',
        status: 'error',
        duration: 2000,
      });
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    getCompany();
  }, [getCompany]);

  return (
    <Box>
      <Heading textAlign='start'>会社</Heading>
      <CustomCard marginTop='24px'>
        <HStack marginBottom={5} justifyContent='end'>
          <DeepBlueButton onClick={() => setEditModalOpen(true)}>
            会社情報の編集
          </DeepBlueButton>
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
          {!!companyDetail && !isLoading && (
            <>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'flex-start',
                  width: '100%',
                }}
              >
                {companyDetail.logo ? (
                  <div>
                    <img
                      src={companyDetail.logo}
                      alt='company-logo'
                      style={{ height: 250, width: 250, objectFit: 'contain' }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      height: 250,
                      width: 250,
                      border: '1px solid #dcdcdc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text color='#dcdcdc' fontWeight='bold' fontSize={16}>
                      会社のロゴが設定されていません。
                    </Text>
                  </div>
                )}

                <div className={styles.companyInformationContainer}>
                  <div className={styles.informationTable}>
                    <div className={styles.tableRow(true)}>
                      <div className={styles.label}>会社名</div>
                      <div className={styles.content}>{companyDetail.name}</div>
                    </div>
                    <div className={styles.tableRow(true)}>
                      <div className={styles.label}>会社の住所</div>
                      <div className={styles.content}>
                        {companyDetail.address || 'n/a'}
                      </div>
                    </div>

                    <div className={styles.tableRow(true)}>
                      <div className={styles.label}>会社の電話番号</div>
                      <div className={styles.content}>
                        {companyDetail.phone_number || 'n/a'}
                      </div>
                    </div>
                    <div className={styles.tableRow(false)}>
                      <div className={styles.label}>会社のウェブサイト</div>
                      <div className={styles.content}>
                        {companyDetail.website || 'n/a'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <EditCompanyModal
          isVisible={editModalOpen}
          setVisible={(isVisible, isReloadData) => {
            setEditModalOpen(isVisible);

            if (isReloadData) {
              getCompany();
            }
          }}
          company={companyDetail}
        />
      </CustomCard>
    </Box>
  );
};
