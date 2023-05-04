import React, { useRef } from 'react';
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
} from '@chakra-ui/react';
import { Formik } from 'formik';
import { RiRouteFill, RiTodoFill, RiSendPlaneLine } from 'react-icons/ri';
import { ImListNumbered } from 'react-icons/im';
import { handleFetchUpdatedBaseRoute } from '../../../store/thunks/BaseRoute';
import {
  editCollectionPoint,
  saveCollectionPoint,
} from '../../../services/apiRequests/collectionPoint';
import { ICollectionPoint } from '../../../models/collectionPoint';
import { MdEdit } from 'react-icons/md';

interface AddCollectionPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseRouteId: number;
  marker: any;
  collectionPoint: ICollectionPoint | null;
  maxSequence: number;
}

export const AddCollectionPointModal = (
  props: AddCollectionPointModalProps
) => {
  const toast = useToast();
  const { isOpen, onClose, baseRouteId, marker, collectionPoint } = props;

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
              const _name = values.name.trim();
              const _address = values.address.trim();
              const _memo = values.memo.trim();

              const formData = new FormData();
              formData.append('name', _name);
              formData.append('address', _address);
              formData.append('memo', _memo);

              if (values.image) formData.append('image', values.image!);

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
                <FormControl isInvalid={!!(errors.name && touched.name)}>
                  {!!collectionPoint && (
                    <FormControl
                      isInvalid={!!(errors.sequence && touched.sequence)}
                    >
                      <FormLabel htmlFor='sequence'>收集 順番</FormLabel>
                      <InputGroup marginY={2}>
                        <InputLeftElement
                          pointerEvents='none'
                          children={<ImListNumbered color='gray.300' />}
                        />
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

                  <FormLabel htmlFor='name'>集積所名</FormLabel>
                  <InputGroup marginY={2}>
                    <InputLeftElement
                      pointerEvents='none'
                      children={<RiRouteFill color='gray.300' />}
                    />
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
                  <FormLabel htmlFor='address'>住所</FormLabel>
                  <InputGroup marginY={2}>
                    <InputLeftElement
                      pointerEvents='none'
                      children={<RiSendPlaneLine color='gray.300' />}
                    />
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
                  <FormLabel htmlFor='memo'>メモ</FormLabel>
                  <InputGroup marginY={2}>
                    <InputLeftElement
                      pointerEvents='none'
                      children={<RiTodoFill color='gray.300' />}
                    />
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

                <FormControl isInvalid={!!(errors.memo && touched.memo)}>
                  <FormLabel htmlFor='memo'>
                    写真
                    <Button
                      mx={2}
                      colorScheme='blue'
                      size='xs'
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <MdEdit />
                    </Button>
                  </FormLabel>
                  <InputGroup marginY={2}>
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
                    <input
                      style={{ display: 'none' }}
                      ref={imageInputRef}
                      type='file'
                      accept='image/*'
                      name='file'
                      onChange={(event) => {
                        setFieldValue('image', event.target.files[0]);
                      }}
                    ></input>
                  </InputGroup>
                  <FormErrorMessage>{errors.memo}</FormErrorMessage>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button disabled={isSubmitting} onClick={onClose} mr={3}>
                  キャンセル
                </Button>
                <Button
                  disabled={isSubmitting}
                  type='submit'
                  colorScheme='green'
                >
                  保存
                </Button>
              </ModalFooter>
            </form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};
