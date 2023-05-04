import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  Container,
  Heading,
  HStack,
  Spinner,
  Flex,
  Button,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { CompanyItem } from './components/CompanyItem';
import { AddCompanyModal } from './components/AddCompanyModal';

import { getCompanies } from '../../services/apiRequests/company';
import { ICompany } from '../../models/company';

type Props = {};

export const CompanyList: FC<Props> = ({}) => {
  const history = useHistory();
  // const [companyLen, setMembers] = useState([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

  const getCompanyList = useCallback(async () => {
    setLoading(true);
    const data = await getCompanies({ limit: 10, offset: 0 });

    const { next, results } = data;

    if (next) {
      setHasMore(true);
    }

    setCompanies(results);
    setLoading(false);
  }, []);

  // const handleLoadMore = useCallback(async () => {
  //   setLoading(true);
  //   const newData = await getCompanies({ limit: 10, offset: members.length });

  //   const { next, results } = newData;

  //   setHasMore(!!next);

  //   setMembers([...members, ...results]);
  //   setLoading(false);
  // }, [members]);

  useEffect(() => {
    getCompanyList();
  }, [getCompanyList]);

  return (
    <Container maxW='container.xl'>
      <HStack marginBottom={5} justifyContent='space-between'>
        <Heading textAlign='start'>Company list</Heading>
        <Button onClick={() => setAddModalOpen(true)}>Add new company</Button>
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
        {!isLoading &&
          companies.map((company, index) => {
            return (
              <CompanyItem
                key={index}
                name={company.name}
                id={company.id}
                onViewCompanyDetail={() =>
                  history.push(`/companies/${company.id}`)
                }
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
            <Button>Load more</Button>
          </Flex>
        )}
      </div>
      <AddCompanyModal
        isVisible={addModalOpen}
        setVisible={(isVisible, isReloadData) => {
          setAddModalOpen(isVisible);

          if (isReloadData) {
            setCompanies([]);
            getCompanyList();
          }
        }}
      />
    </Container>
  );
};
