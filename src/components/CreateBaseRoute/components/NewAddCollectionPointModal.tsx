import React, { useRef, useState, useEffect } from 'react';
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
  FormErrorMessage,
  useToast,
  Image,
  Select,
  Box,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { RiRouteFill, RiTodoFill, RiSendPlaneLine } from 'react-icons/ri';
import { ImListNumbered } from 'react-icons/im';
import { handleFetchUpdatedBaseRoute } from '../../../store/thunks/BaseRoute';
import {
  editCollectionPoint,
  saveCollectionPoint,
} from '../../../services/apiRequests/collectionPoint';
import { ICollectionPoint } from '../../../models/collectionPoint';
import { MdEdit } from 'react-icons/md';
import {
  getCompanyCustomer,
  getCompanyGarbage,
} from '../../../services/apiRequests/garbageCompany';
import MultiSelect from '../../common/MultiSelect';
import { AiOutlineCamera } from 'react-icons/ai';
import YellowButton from '../../common/YellowButton';

interface AddCollectionPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseRouteId: number;
  marker: any;
  collectionPoint: ICollectionPoint | null;
  maxSequence: number;
}

export const NewAddCollectionPointModal = (
  props: AddCollectionPointModalProps
) => {
  const toast = useToast();
  const { isOpen, onClose, baseRouteId, marker, collectionPoint, route } =
    props;

  const [customerList, setCustomerList] = useState([]);
  const [garbageList, setGarbageList] = useState([]);
  const [selectedGarbage, setSelectedGarbage] = useState([]);

  useEffect(() => {
    if (!collectionPoint) return;
    if (collectionPoint.garbage && Array.isArray(collectionPoint.garbage)) {
      const parsedGarbage = collectionPoint.garbage.map((gb) => {
        return {
          ...gb,
          value: gb.id,
          label: gb.name,
        };
      });
      setSelectedGarbage(parsedGarbage);
    }
  }, [route]);

  useEffect(() => {
    async function _getCompanyCustomers() {
      try {
        const customers = await getCompanyCustomer();
        setCustomerList(customers);
      } catch (error) {
        toast({
          title: 'Error fetching customers',
          description: 'もう一度お試しください',
          status: 'error',
        });
      }
    }

    async function _getCompanyGB() {
      try {
        const _garbages = await getCompanyGarbage();
        const options = [];
        for (const gb of _garbages) {
          options.push({
            ...gb,
            value: gb.id,
            label: gb.name,
          });
        }
        setGarbageList(options);
      } catch (error) {
        toast({
          title: 'Error fetching garbages',
          description: 'もう一度お試しください',
          status: 'error',
        });
      }
    }

    _getCompanyCustomers();
    _getCompanyGB();
  }, [toast]);

  const title = `${collectionPoint ? '編集' : '追加'}`;

  const imageInputRef = useRef();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <Formik
          enableReinitialize
          initialValues={{
            name: collectionPoint?.name ?? '',
            address: collectionPoint?.address ?? '',
            memo: collectionPoint?.memo ?? '',
            sequence: collectionPoint?.sequence ?? 0,
            image: null,
            customer: collectionPoint?.customer?.id || '',
          }}
          validate={(values) => {
            const errors: any = {};
            if (values.name.trim().length <= 0) {
              errors.name = 'ルート名を入力してください';
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const params = {};

              const _name = values.name.trim();
              const _address = values.address.trim();
              const _memo = values.memo.trim();

              const formData = new FormData();
              formData.append('name', _name);
              formData.append('address', _address);
              formData.append('memo', _memo);

              if (values.image) {
                formData.append('image', values.image!);
                params.image = values.image;
              }

              if (route.type === 'COMPANY') {
                formData.append('customer', values.customer);
                selectedGarbage.forEach((gb) => {
                  formData.append('garbage', gb.value);
                });
              }

              if (collectionPoint) {
                formData.append('location', collectionPoint.location);
                formData.append('sequence', values.sequence);

                await editCollectionPoint(collectionPoint!.id, formData);
                toast({
                  title: '更新された収集ポイント',
                  description: '',
                  status: 'success',
                });
              } else {
                const _sequence = 0;
                const { longitude, latitude } = marker;
                const _location = latitude + ',' + longitude;
                formData.append('location', _location);
                formData.append('route', baseRouteId.toString());
                formData.append('sequence', _sequence.toString());
                await saveCollectionPoint(formData);
                toast({
                  title: '収集ポイントを作成しました',
                  description: '',
                  status: 'success',
                  duration: 1000,
                });
              }
              handleFetchUpdatedBaseRoute(baseRouteId);
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
          }) => (
            <form onSubmit={handleSubmit}>
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel
                    htmlFor='upload-file'
                    color='table.headerColor'
                    fontSize='14px'
                    fontWeight='500'
                  >
                    写真
                  </FormLabel>
                  <Box marginY={2}>
                    <Button
                      variant='outline'
                      borderRadius='27px'
                      color='sidebar.background'
                      fontSize='13px'
                      fontWeight='400'
                      width='129px'
                      height='33px'
                      onClick={() => imageInputRef.current?.click()}
                    >
                      写真を選択{' '}
                      <AiOutlineCamera
                        style={{
                          height: 18,
                          width: 18,
                          color: '#6F85A3',
                          fontWeight: 600,
                          marginLeft: 10,
                        }}
                      />
                    </Button>
                    <Box marginTop='12px'>
                      {(values.image || collectionPoint?.image) && (
                        <Image
                          cursor='pointer'
                          border='1px #3182ce solid'
                          p={2}
                          onClick={() => imageInputRef.current?.click()}
                          boxSize='150px'
                          objectFit='cover'
                          src={
                            values.image
                              ? URL.createObjectURL(values.image)
                              : collectionPoint?.image
                          }
                          alt='image'
                        />
                      )}
                    </Box>
                    <input
                      style={{ display: 'none' }}
                      ref={imageInputRef}
                      type='file'
                      accept='image/*'
                      name='file'
                      id='upload-file'
                      onChange={(event) => {
                        setFieldValue('image', event.target.files[0]);
                      }}
                    ></input>
                  </Box>
                </FormControl>
                <FormControl isInvalid={!!(errors.name && touched.name)}>
                  {!!collectionPoint && (
                    <FormControl
                      isInvalid={!!(errors.sequence && touched.sequence)}
                    >
                      <FormLabel
                        htmlFor='sequence'
                        color='table.headerColor'
                        fontSize='14px'
                        fontWeight='500'
                      >
                        收集 順番
                      </FormLabel>
                      <InputGroup marginY={2}>
                        <Input
                          value={values.sequence}
                          type='number'
                          name='sequence'
                          onChange={(e) => {
                            const newSequence = parseInt(e.target.value);

                            if (typeof newSequence !== 'number') {
                              return;
                            }

                            if (
                              newSequence < 0 ||
                              newSequence > props.maxSequence
                            ) {
                              toast({
                                description: `1〜${props.maxSequence} の範囲で入力してください。`,
                                status: 'error',
                                duration: 1000,
                              });
                              return;
                            }

                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          placeholder='順序'
                          size='md'
                        />
                      </InputGroup>
                      <FormErrorMessage>{errors.memo}</FormErrorMessage>
                    </FormControl>
                  )}

                  <FormLabel
                    htmlFor='name'
                    color='table.headerColor'
                    fontSize='14px'
                    fontWeight='500'
                  >
                    集積所名
                  </FormLabel>
                  <InputGroup marginY={2}>
                    <Input
                      value={values.name}
                      type='name'
                      name='name'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder='name'
                      size='md'
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!(errors.address && touched.address)}>
                  <FormLabel
                    htmlFor='address'
                    color='table.headerColor'
                    fontSize='14px'
                    fontWeight='500'
                  >
                    住所
                  </FormLabel>
                  <InputGroup marginY={2}>
                    <Input
                      value={values.address}
                      type='address'
                      name='address'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder='住所'
                      size='md'
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.address}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!(errors.memo && touched.memo)}>
                  <FormLabel
                    htmlFor='memo'
                    color='table.headerColor'
                    fontSize='14px'
                    fontWeight='500'
                  >
                    メモ
                  </FormLabel>
                  <InputGroup marginY={2}>
                    <Input
                      value={values.memo}
                      type='memo'
                      name='memo'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder='memo'
                      size='md'
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.memo}</FormErrorMessage>
                </FormControl>
                <InputGroup
                  display={route?.type === 'COMPANY' ? 'block' : 'none'}
                  marginBottom="2"
                >
                  <FormControl id='customer'>
                    <Field name='customer'>
                      {({ field, form }: { field: any; form: any }) => (
                        <FormControl
                          isInvalid={
                            form.errors.customer && form.touched.customer
                          }
                        >
                          <FormLabel
                            htmlFor='customer'
                            color='table.headerColor'
                            fontSize='14px'
                            fontWeight='500'
                          >
                            顧客
                          </FormLabel>

                          <Select
                            {...field}
                            placeholder='顧客を選択'
                            id='customer'
                            name='customer'
                          >
                            {customerList.map((customer) => (
                              <option key={customer.id} value={customer.id}>
                                {customer.description || customer.name}
                              </option>
                            ))}
                          </Select>
                          <FormErrorMessage>
                            {form.errors.customer}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </FormControl>
                </InputGroup>
                <InputGroup
                  display={route?.type === 'COMPANY' ? 'block' : 'none'}
                >
                  <FormControl id='garbage'>
                    <Field name='garbage'>
                      {({ field, form }: { field: any; form: any }) => {
                        return (
                          <FormControl
                            isInvalid={
                              form.errors.customer && form.touched.customer
                            }
                          >
                            <FormLabel
                              htmlFor='garbage'
                              color='table.headerColor'
                              fontSize='14px'
                              fontWeight='500'
                            >
                              品目
                            </FormLabel>
                            <MultiSelect
                              {...field}
                              isMulti
                              name='garbage'
                              onChange={(e: any) => {
                                setSelectedGarbage(e);
                              }}
                              options={garbageList}
                              placeholder='品目を選択'
                              closeMenuOnSelect={false}
                              size='sm'
                              value={selectedGarbage}
                            />
                            <FormErrorMessage>
                              {form.errors.customer}
                            </FormErrorMessage>
                          </FormControl>
                        );
                      }}
                    </Field>
                  </FormControl>
                </InputGroup>
              </ModalBody>
              <ModalFooter justifyContent='space-between'>
                <Button
                  disabled={isSubmitting}
                  onClick={onClose}
                  mr={3}
                  variant='outline'
                  width='134px'
                  borderRadius='36px'
                >
                  キャンセル
                </Button>
                <YellowButton disabled={isSubmitting} type='submit'>
                  保存
                </YellowButton>
              </ModalFooter>
            </form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};
