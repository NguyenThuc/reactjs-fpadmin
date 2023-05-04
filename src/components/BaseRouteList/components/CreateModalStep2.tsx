import React from 'react';
import {
  Button,
  InputGroup,
  FormLabel,
  FormControl,
  Input,
  Select,
  FormErrorMessage,
  Box,
  Flex,
  FormLabelProps,
  InputProps,
} from '@chakra-ui/react';
import { Field } from 'formik';
import DeepBlueButton from '../../common/DeepBlueButton';
import { ICustomer } from '../../../models/customer';
import MultiSelect from '../../common/MultiSelect';

const labelStyle: FormLabelProps = {
  color: '#6F85A3',
  fontSize: '14px',
  fontWeight: 'bold',
};

const inputStyles: InputProps = {
  minHeight: '40px',
  border: '1px solid #E4E4E4',
  borderRadius: '5px',
};

export const CreateModalStep2 = (props) => {
  const {
    setFieldValue,
    setStep,
    values,
    handleChange,
    handleBlur,
    errors,
    customerList,
    selectedGarbages,
    touched,
    setSelectedGarbages,
    garbageList,
  } = props;

  const handleDisplayBaseType = () => {
    return (
      <>
        <FormControl isInvalid={!!(errors.name && touched.name)}>
          <FormLabel htmlFor='name' {...labelStyle}>
            ルート名
          </FormLabel>
          <InputGroup>
            <Input
              type='name'
              name='name'
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder='ルート名を入力'
              size='md'
              {...inputStyles}
            />
          </InputGroup>
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>
        <InputGroup>
          <FormControl id='customer'>
            <Field name='customer'>
              {({ field, form }: { field: any; form: any }) => (
                <FormControl
                  isInvalid={form.errors.customer && form.touched.customer}
                >
                  <FormLabel htmlFor='customer' {...labelStyle}>
                    顧客
                  </FormLabel>

                  <Select
                    {...field}
                    placeholder='顧客を選択'
                    id='customer'
                    name='customer'
                    {...inputStyles}
                  >
                    {customerList.map((customer: ICustomer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.description || customer.name}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>{form.errors.customer}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
          </FormControl>
        </InputGroup>
        <InputGroup>
          <FormControl id='garbage'>
            <Field name='garbage'>
              {({ field, form }: { field: any; form: any }) => {
                return (
                  <FormControl
                    isInvalid={form.errors.customer && form.touched.customer}
                  >
                    <FormLabel htmlFor='garbage' {...labelStyle}>
                      品目
                    </FormLabel>
                    <MultiSelect
                      {...field}
                      isMulti
                      name='garbage'
                      onChange={(e: any) => {
                        setSelectedGarbages(e);
                      }}
                      options={garbageList}
                      placeholder='品目を選択'
                      closeMenuOnSelect={false}
                      size='sm'
                      value={selectedGarbages}
                    />
                    <FormErrorMessage>{form.errors.customer}</FormErrorMessage>
                  </FormControl>
                );
              }}
            </Field>
          </FormControl>
        </InputGroup>
      </>
    );
  };

  const handleDisplayCompanyType = () => {
    return (
      <>
        <FormControl isInvalid={!!(errors.name && touched.name)}>
          <FormLabel htmlFor='name' {...labelStyle}>
            ルート名
          </FormLabel>
          <InputGroup>
            <Input
              type='name'
              name='name'
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder='ルート名を入力'
              size='md'
              {...inputStyles}
            />
          </InputGroup>
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>
      </>
    );
  };

  return (
    <>
      {values.type === 'BASE'
        ? handleDisplayBaseType()
        : handleDisplayCompanyType()}
    </>
  );
};
