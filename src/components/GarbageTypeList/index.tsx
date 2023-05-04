import React, { useState, useCallback, useEffect } from 'react';
import {
  Container,
  Heading,
  HStack,
  Spinner,
  Flex,
  Button,
  Box,
} from '@chakra-ui/react';

import { getGarbages } from '../../services/apiRequests/garbages';

import { GarbageTypeItem } from './components/GarbageTypeItem';
import { AddGarbageTypeModal } from './components/AddGarbageTypeModal';
import { DeleteGarbageTypeModal } from './components/DeleteGarbageTypeModal';
import { EditGarbageTypeModal } from './components/EditGarbageTypeModal';
import CustomCard from '../common/Card';
import DeepBlueButton from '../common/DeepBlueButton';

export const GarbageTypeList = () => {
  const [isLoading, setLoading] = useState(false);
  const [types, setTypes] = useState<any[]>([]);
  const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [deletingGarbageType, setDeletingGarbageType] = useState<any>(null);
  const [edittingGarbageType, setEdittingGarbageType] = useState<any>(null);

  const handleGetGarbages = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getGarbages();

      setTypes(data);

      setLoading(false);
    } catch (error) {}
  }, []);

  useEffect(() => {
    handleGetGarbages();
  }, [handleGetGarbages]);

  return (
    <Box>
      <Heading textAlign='start'>行政系 ゴミの種類</Heading>
      <CustomCard marginTop='24px'>
        <Container maxW='container.xl'>
          <HStack marginBottom={5} justifyContent='end'>
            <DeepBlueButton onClick={() => setAddModalOpen(true)}>
              新しく追加する
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
            {types.map((type: any, index) => {
              return (
                <GarbageTypeItem
                  key={index}
                  name={type.name}
                  description={type.description}
                  id={type.id}
                  onEdit={() => {
                    setEdittingGarbageType(type);
                  }}
                  onDelete={() => {
                    setDeletingGarbageType(type);
                  }}
                />
              );
            })}
            {isLoading && (
              <Flex mt={6} mb={6} justify='center'>
                <Spinner />
              </Flex>
            )}
          </div>
          <AddGarbageTypeModal
            isVisible={isAddModalOpen}
            setVisible={async (isVisible, isReloadData) => {
              setAddModalOpen(isVisible);

              if (isReloadData) {
                setTypes([]);
                await handleGetGarbages();
              }
            }}
          />
          <DeleteGarbageTypeModal
            isVisible={!!deletingGarbageType}
            id={deletingGarbageType?.id}
            setVisible={async (isReloadData) => {
              setDeletingGarbageType(null);

              if (isReloadData) {
                setTypes([]);
                await handleGetGarbages();
              }
            }}
          />
          <EditGarbageTypeModal
            isVisible={!!edittingGarbageType}
            initData={edittingGarbageType}
            setVisible={async (isReloadData) => {
              setEdittingGarbageType(null);

              if (isReloadData) {
                setTypes([]);
                await handleGetGarbages();
              }
            }}
          />
        </Container>
      </CustomCard>
    </Box>
  );
};
