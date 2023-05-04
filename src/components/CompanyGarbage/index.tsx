import React, { useState, useCallback, useEffect } from 'react';
import {
  Container,
  Heading,
  HStack,
  useToast,
  Button,
  Box,
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/hooks';
import {
  getCompanyGarbage,
  createCompanyGarbage,
  updateCompanyGarbage,
  deleteCompanyGarbage,
  IGarbage,
} from '../../services/apiRequests/garbageCompany';
import { GarbageTypeItem } from './components/GarbageTypeItem';
import { AddGarbageTypeModal } from './components/AddGarbageTypeModal';
import { DeleteGarbageTypeModal } from './components/DeleteGarbageTypeModal';
import { CustomSpinner } from '../common/Spinner';
import CustomCard from '../common/Card';
import DeepBlueButton from '../common/DeepBlueButton';

export const CompanyGarbage = () => {
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);
  const [types, setTypes] = useState<any>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenUpdate,
    onOpen: onOpenUpdate,
    onClose: onCloseUpdate,
  } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<IGarbage | null>(null);

  const handleGetGarbages = async () => {
    try {
      setLoading(true);
      const results = await getCompanyGarbage();
      if (results) {
        setTypes(results);
      } else {
        throw new Error('Get Garbage Company Failed');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: error.message,
        description: '',
        status: 'error',
        duration: 2000,
      });
    }
  };

  const handleCreateCompanyGarbage = async (
    body: Array<Omit<IGarbage, 'id'>>,
    callback: Function,
    errorCallback: Function
  ) => {
    try {
      setLoading(true);
      const results = await createCompanyGarbage(body);
      setLoading(false);
      if (!results.error) {
        toast({
          title: '新しいガベージ タイプの作成に成功しました',
          description: '',
          status: 'success',
          duration: 2000,
        });
        if (callback) {
          callback();
        }
        handleGetGarbages();
      } else {
        if (errorCallback) {
          const { error } = results;
          errorCallback(error);
        }
        throw new Error('新しいガベージ タイプの作成に失敗しました');
      }
    } catch (err) {
      setLoading(false);
      toast({
        title: err.message,
        description: '',
        status: 'error',
        duration: 2000,
      });
    }
  };

  const handleUpdateCompanyGarbage = async (
    id: string,
    body: Array<Omit<IGarbage, 'id'>>,
    callback: Function,
    errorCallback: Function
  ) => {
    try {
      setLoading(true);
      const results = await updateCompanyGarbage(id, body);
      setLoading(false);
      if (!results.error) {
        toast({
          title: 'ガベージ タイプの編集成功',
          description: '',
          status: 'success',
          duration: 2000,
        });
        if (callback) {
          callback();
        }
        handleGetGarbages();
      } else {
        if (errorCallback) {
          const { error } = results;
          errorCallback(error);
        }
        throw new Error('ガベージ タイプの編集に失敗しました');
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: error.message,
        description: '',
        status: 'error',
        duration: 2000,
      });
    }
  };

  const handleDeleteGarbage = async (id: string, callback: Function) => {
    try {
      setLoading(true);
      const results = await deleteCompanyGarbage(id);
      setLoading(false);
      toast({
        title: 'ガベージタイプの削除成功',
        description: '',
        status: 'success',
        duration: 2000,
      });
      if (callback) {
        callback();
      }
      handleGetGarbages();
    } catch (error) {
      setLoading(false);
      toast({
        title: 'ガベージ タイプの削除に失敗しました',
        description: '',
        status: 'error',
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    handleGetGarbages();
  }, []);

  return (
    <Box>
      <Heading textAlign='start'>事業系 ゴミの種類</Heading>
      <CustomCard marginTop='24px'>
        <Container maxW='container.xl'>
          <HStack marginBottom={5} justifyContent='end'>
            <DeepBlueButton onClick={() => onOpen()}>
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
            {types.map((type: any) => {
              return (
                <GarbageTypeItem
                  key={type?.id}
                  name={type.name}
                  description={type.description}
                  id={type.id}
                  onEdit={() => {
                    setSelectedItem(type);
                    onOpenUpdate();
                  }}
                  onDelete={() => {
                    setSelectedItem(type);
                    onOpenDelete();
                  }}
                />
              );
            })}
            {isLoading && <CustomSpinner />}
          </div>
          <AddGarbageTypeModal
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleCreateCompanyGarbage}
          />
          {selectedItem && isOpenUpdate && (
            <AddGarbageTypeModal
              isOpen={isOpenUpdate}
              onClose={() => {
                setSelectedItem(null);
                onCloseUpdate();
              }}
              onSubmit={handleUpdateCompanyGarbage}
              garbageDetails={selectedItem}
            />
          )}
          {selectedItem && isOpenDelete && (
            <DeleteGarbageTypeModal
              isOpen={isOpenDelete}
              onClose={() => {
                setSelectedItem(null);
                onCloseDelete();
              }}
              onSubmit={handleDeleteGarbage}
              garbageDetails={selectedItem}
            />
          )}
        </Container>
      </CustomCard>
    </Box>
  );
};
