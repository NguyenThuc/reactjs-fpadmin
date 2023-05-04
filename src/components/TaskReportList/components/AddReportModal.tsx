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
  FormErrorMessage,
  useToast,
  Image,
  Select,
  Text,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { RiRouteFill } from 'react-icons/ri';
import { MdEdit } from 'react-icons/md';
import { ITaskRoute } from '../../../models/taskRoute';
import { ITaskReportType } from '../../../models/taskReportType';
import { getReportTypes } from '../../../services/apiRequests/reportTypes';
import { ITaskCollectionPoint } from '../../../models/taskCollectionPoint';
import {
  addTaskReport,
  editTaskReport,
} from '../../../services/apiRequests/taskReports';
import { handleFetchUpdatedTaskRoute } from '../../../store/thunks/TaskRoute';
import { ITaskReport } from '../../../models/taskReport';
import Camera from '../../../assets/taskRouteDetail/camera.svg';
import CancelModalButton from '../../common/CancelModalButton';
import { TYPE_BASE } from '../../../constants/strings';
import { getCompanyReports } from '../../../services/apiRequests/companyReport';

interface AddReportModalProps {
  taskRoute: ITaskRoute;
  selectedTaskReport?: ITaskReport;
  isOpen: boolean;
  onClose: () => void;
}

export const AddReportModal = (props: AddReportModalProps) => {
  const [reportTypes, setReportTypes] = useState<ITaskReportType[]>([]);

  const toast = useToast();
  const { isOpen, onClose, taskRoute, selectedTaskReport } = props;

  const imageInputRef = useRef();

  const reportTypeData =
    taskRoute?.type === TYPE_BASE
      ? selectedTaskReport?.report_type
      : selectedTaskReport?.route_report_type;

  useEffect(() => {
    async function _getReporTypes() {
      try {
        const getReportTypesFunction =
          taskRoute?.type === TYPE_BASE ? getReportTypes : getCompanyReports;
        const _reportTypes = await getReportTypesFunction();
        setReportTypes(_reportTypes);
      } catch (e) {
        toast({
          title: 'Error fetching report types',
          description: 'もう一度お試しください',
          status: 'error',
        });
      }
    }

    _getReporTypes();
  }, [toast]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          fontSize='16px'
          color='table.dataColor'
          borderBottom='1px solid #C6D5EB'
        >
          レポートを追加
        </ModalHeader>
        <CancelModalButton />
        <Formik
          enableReinitialize
          initialValues={{
            task_collection_point:
              selectedTaskReport?.task_collection_point?.id ?? '',
            report_type: reportTypeData?.id ?? '',
            description: selectedTaskReport?.description ?? '',
            image: null,
          }}
          validate={(values) => {
            const errors: any = {};
            if (values.task_collection_point === '') {
              errors.task_collection_point = 'Required, please select a point';
            }

            if (values.report_type === '') {
              errors.report_type = 'Required, please select a report type';
            }

            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const _description = values.description.trim();

              const formData = new FormData();
              formData.append('route', String(taskRoute.id));
              formData.append('description', _description);
              formData.append(
                'task_collection_point',
                String(values.task_collection_point)
              );
              if (taskRoute?.type === TYPE_BASE) {
                formData.append('report_type', String(values.report_type));
              } else {
                formData.append(
                  'route_report_type',
                  String(values.report_type)
                );
              }

              if (values.image) formData.append('image', values.image!);

              if (selectedTaskReport) {
                await editTaskReport(selectedTaskReport.id, formData);
                toast({
                  title: 'Updated task report',
                  description: '',
                  status: 'success',
                });
              } else {
                await addTaskReport(formData);
                toast({
                  title: 'Added task report',
                  description: '',
                  status: 'success',
                });
              }
              handleFetchUpdatedTaskRoute(taskRoute.id);
              onClose();
            } catch (e) {
              toast({
                title: 'Error adding report',
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
              <ModalBody padding='32px 32px 0px 32px'>
                <FormControl
                  id='task_collection_point'
                  isInvalid={
                    !!(
                      errors.task_collection_point &&
                      touched.task_collection_point
                    )
                  }
                >
                  <FormLabel
                    htmlFor='task_collection_point'
                    color='table.headerColor'
                    fontSize='14px'
                    marginBottom='8px'
                  >
                    集積所
                  </FormLabel>
                  <InputGroup marginY={2}>
                    <Field name='task_collection_point'>
                      {({ field, form }: { field: any; form: any }) => {
                        return (
                          <Select
                            {...field}
                            placeholder='集積所を選択'
                            id='task_collection_point'
                            name='task_collection_point'
                            // value={field?.value?.id}
                          >
                            {taskRoute.task_collection_point.map(
                              (tcp: ITaskCollectionPoint) => (
                                <option key={tcp.id} value={tcp.id}>
                                  {tcp.name}
                                </option>
                              )
                            )}
                          </Select>
                        );
                      }}
                    </Field>
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.task_collection_point &&
                      touched.task_collection_point}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  id='report_type'
                  isInvalid={!!(errors.report_type && touched.report_type)}
                >
                  <FormLabel
                    htmlFor='report_type'
                    color='table.headerColor'
                    fontSize='14px'
                    marginBottom='8px'
                  >
                    報告種別
                  </FormLabel>
                  <InputGroup marginY={2}>
                    <Field name='report_type'>
                      {({ field, form }: { field: any; form: any }) => (
                        <Select
                          {...field}
                          placeholder='報告種別を選択'
                          id='report_type'
                          name='report_type'
                        >
                          {reportTypes.map((reporType: ITaskReportType) => (
                            <option key={reporType.id} value={reporType.id}>
                              {reporType.name}
                            </option>
                          ))}
                        </Select>
                      )}
                    </Field>
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.report_type && touched.report_type}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={!!(errors.description && touched.description)}
                >
                  <FormLabel
                    htmlFor='description'
                    color='table.headerColor'
                    fontSize='14px'
                    marginBottom='8px'
                  >
                    説明
                  </FormLabel>
                  <InputGroup marginY={2}>
                    <Input
                      value={values.description}
                      type='description'
                      name='description'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder='説明を入力'
                      size='md'
                      marginBottom='24px'
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.description}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!(errors.image && touched.image)}>
                  <FormLabel htmlFor='memo' textAlign='right' marginRight='0px'>
                    <Button
                      colorScheme='blue'
                      size='md'
                      onClick={() => imageInputRef.current?.click()}
                      width='129px'
                      borderRadius='27px'
                      variant='outline'
                      fontSize='13px'
                    >
                      <Text mr='8px'>写真を選択</Text>{' '}
                      <img
                        src={Camera}
                        alt='upload'
                        width='16px'
                        height='16px'
                      />
                    </Button>
                  </FormLabel>
                  <InputGroup marginY={2}>
                    {(values.image || selectedTaskReport?.image) && (
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
                            : selectedTaskReport?.image
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
                        setFieldValue('image', event?.target?.files[0]);
                      }}
                    ></input>
                  </InputGroup>
                  <FormErrorMessage>{errors.image}</FormErrorMessage>
                </FormControl>
              </ModalBody>
              <ModalFooter
                padding='16px 32px 40px 32px'
                justifyContent='space-between'
                alignItems='center'
              >
                <Button
                  disabled={isSubmitting}
                  onClick={onClose}
                  mr={3}
                  variant='outline'
                  borderRadius='36px'
                  color='table.headerColor'
                  fontSize='16px'
                  fontWeight='400'
                >
                  キャンセル
                </Button>
                <Button
                  disabled={isSubmitting}
                  type='submit'
                  background='linear-gradient(274.1deg, #D1992F 0%, #CED12F 100%)'
                  boxShadow='8px 8px 24px rgba(15, 124, 182, 0.3)'
                  borderRadius='36px'
                  width='234px'
                  _hover=''
                  fontSize='16px'
                  fontWeight='400'
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
