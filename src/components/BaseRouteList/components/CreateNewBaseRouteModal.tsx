import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  InputLeftElement,
  Button,
  InputGroup,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormLabel,
  FormControl,
  Input,
  ModalFooter,
  Select,
  FormErrorMessage,
  useToast,
  chakra,
  FormLabelProps,
  InputProps,
  Box,
  Flex,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { RiRouteFill } from 'react-icons/ri';
import { ICustomer } from '../../../models/customer';
import { getCustomers } from '../../../services/apiRequests/customers';
import {
  editBaseRoute,
  saveBaseRoute,
} from '../../../services/apiRequests/baseRoute';

import { getGarbages } from '../../../services/apiRequests/garbages';
import { IGarbage } from '../../../models/garbage';
import { handleFetchBaseRoute } from '../../../store/thunks/BaseRoute';
import { IBaseRoute } from '../../../models/baseRoute';

import { CreateModalStep1 } from './CreateModalStep1';
import YellowButton from '../../common/YellowButton';
import { CreateModalStep2 } from './CreateModalStep2';

interface CreateBaseRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseRoute: IBaseRoute | null;
}

interface IGarbageOptions {
  garbage: IGarbage;
  value: number;
  label: string;
}

export const CreateNewBaseRouteModal = (props: CreateBaseRouteModalProps) => {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [garbages, setGarbages] = useState<IGarbageOptions[]>([]);
  const [selectedGarbages, setSelectedGarbages] = useState<number[]>([]);

  // step
  const [step, setStep] = useState(1);

  const toast = useToast();

  const { isOpen, onClose, baseRoute } = props;

  useEffect(() => {
    if (!baseRoute) return;
    if (baseRoute.garbage && Array.isArray(baseRoute.garbage)) {
      const parsedGarbage = baseRoute.garbage.map((gb) => {
        return {
          ...gb,
          value: gb.id,
          label: gb.name,
        };
      });
      setSelectedGarbages(parsedGarbage);
    }
  }, [baseRoute]);

  useEffect(() => {
    async function _getCustomers() {
      try {
        const customers = await getCustomers();
        setCustomers(customers);
      } catch (e) {
        toast({
          title: 'Error fetching customers',
          description: 'もう一度お試しください',
          status: 'error',
        });
      }
    }

    async function _getGarbages() {
      try {
        const _garbages = await getGarbages();
        const options: IGarbageOptions[] = [];
        for (const gb of _garbages) {
          options.push({
            ...gb,
            value: gb.id,
            label: gb.name,
          });
        }
        setGarbages(options);
      } catch (e) {
        toast({
          title: 'Error fetching garbages',
          description: 'もう一度お試しください',
          status: 'error',
        });
      }
    }
    _getCustomers();
    _getGarbages();
  }, [toast]);

  const save = async (data: any) => {
    if (baseRoute) {
      // editing
      await editBaseRoute(baseRoute?.id, data);
      toast({
        title: '編集',
        description: '',
        status: 'success',
      });
    } else {
      // create new
      await saveBaseRoute(data);
      toast({
        title: '新規作成',
        description: '',
        status: 'success',
      });
    }
  };

  const title = `${baseRoute ? '編集' : 'ルートを追加'}`;

  const handleOnClose = () => {
    setSelectedGarbages([]);
    onClose();
  };

  const handleOnBack = (resetFormik) => {
    if (resetFormik) {
      resetFormik();
    }
    setStep((currStep) => {
      return currStep - 1;
    });
    setSelectedGarbages([]);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          display='flex'
          alignItems='center'
          padding='12px 0 12px 24px'
          justifyContent='space-between'
          borderBottom='1px solid #C6D5EB'
        >
          <chakra.span fontSize='16px'>{title}</chakra.span>
          <ModalCloseButton
            position='static'
            borderLeft='1px solid #E4E4E4'
            paddingLeft='24px'
            paddingRight='24px'
            color='#C6D5EB'
            borderRadius='none'
          />
        </ModalHeader>
        <Formik
          enableReinitialize
          initialValues={{
            name: baseRoute?.name ?? '',
            customer: baseRoute?.customer?.id ?? '',
            type: baseRoute?.type || 'BASE',
          }}
          validate={(values) => {
            const errors = {};
            if (values.name.trim().length <= 0) {
              errors.name = 'ルート名を入力してください';
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const _name = values.name.trim();
              await save({
                name: _name,
                customer: values.customer,
                garbage: selectedGarbages.map((gb) => gb.value),
                type: values.type,
              });
              handleFetchBaseRoute();
              setSelectedGarbages([]);
              onClose();
            } catch (e) {
              toast({
                title: 'エラー',
                description: 'ログイン情報をご確認ください。',
                status: 'error',
              });
            }
            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            resetForm,
          }) => {

            return (
              <form onSubmit={handleSubmit}>
                <ModalBody
                  display='flex'
                  flexDirection='column'
                  style={{ gap: '24px' }}
                  padding='32px 32px 0 32px'
                >
                  {step === 1 && (
                    <CreateModalStep1
                      setFieldValue={setFieldValue}
                      setStep={setStep}
                    />
                  )}
                  {step === 2 && (
                    <CreateModalStep2
                      setFieldValue={setFieldValue}
                      setStep={setStep}
                      values={values}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      errors={errors}
                      customerList={customers}
                      selectedGarbages={selectedGarbages}
                      touched={touched}
                      setSelectedGarbages={setSelectedGarbages}
                      garbageList={garbages}
                    />
                  )}
                </ModalBody>
                <ModalFooter
                  display='flex'
                  justifyContent={step === 1 ? 'center' : 'space-between'}
                  marginTop='24px'
                  paddingTop='0px'
                  paddingBottom='40px'
                  paddingX='32px'
                >
                  {step === 2 && (
                    <>
                      <Button
                        disabled={isSubmitting}
                        onClick={() => {
                          handleOnBack(resetForm);
                        }}
                        mr={3}
                        height='48px'
                        borderRadius='36px'
                        border='1px solid #C6D5EB'
                        padding='0 27px'
                        fontSize='16px'
                        color='#6F85A3'
                        variant='outline'
                      >
                        Back
                      </Button>
                      <Button
                        disabled={isSubmitting}
                        type='submit'
                        background='linear-gradient(274.1deg, #D1992F 0%, #CED12F 100%)'
                        boxShadow='8px 8px 24px rgba(15, 124, 182, 0.3)'
                        borderRadius='36px'
                        width='234px'
                        height='48px'
                        fontSize='16px'
                        fontWeight='400'
                        variant='unstyled'
                        color='white'
                      >
                        保存
                      </Button>
                    </>
                  )}
                </ModalFooter>
              </form>
            );
          }}
        </Formik>
      </ModalContent>
    </Modal>
  );
};
