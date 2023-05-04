import React from 'react';
import {
  VStack,
  Container,
  Stack,
  Input,
  InputLeftElement,
  InputRightElement,
  Button,
  InputGroup,
  useToast,
  Flex,
  Text,
  Box,
} from '@chakra-ui/react';
import { Formik } from 'formik';
import { Logo } from '../../components/common/Logo';
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineUser,
} from 'react-icons/ai';
import { RiLock2Line } from 'react-icons/ri';
import { handleLogin } from '../../store/thunks/App';
import { IUser } from '../../models/user';
import { useSelector } from 'react-redux';
import { _user } from '../../store/selectors/App';
import { Redirect } from 'react-router-dom';
import Footer from '../common/Footer';
import { NewLogo } from '../common/NewLogo';
import YellowButton from '../common/YellowButton';
import { useState } from 'react';

const Login = () => {
  const toast = useToast();

  const user: IUser = useSelector(_user);

  const initialFormValues = { username: '', password: '' };
  const [togglePassword, setToggelPassword] = useState(false);

  if (user) {
    return <Redirect to='home' />;
  }

  const handleTogglePassword = () => {
    setToggelPassword((current) => {
      return !current;
    });
  };

  return (
    <VStack spacing={8} padding={10}>
      <Container maxW='container.sm' maxWidth='444px'>
        <Flex
          justify='center'
          align='center'
          height='150px'
          background='linear-gradient(0deg, #2E87A3 -98.9%, #2E5FA3 83.52%)'
          borderRadius='10px 10px 0px 0px'
          width='100%'
          flexDirection='column'
        >
          <NewLogo
            height='33px'
            width='189px'
            objectFit='contain'
            pointerEvents='none'
          />
          <Text fontSize='16px' color='#fff' marginTop='16px'>
            ログイン
          </Text>
        </Flex>
        <Stack
          spacing={3}
          padding='32px'
          width='100%'
          boxShadow='0px 4px 10px rgba(0, 0, 0, 0.05)'
          borderRadius='0px 0px 10px 10px'
          backgroundColor='#ffff'
        >
          <Formik
            initialValues={initialFormValues}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await handleLogin({
                  username: values.username,
                  password: values.password,
                });
                toast({
                  title: 'ログインしました',
                  description: '',
                  status: 'success',
                });
              } catch (e) {
                toast({
                  title: 'エラー',
                  description: 'IDまたはパスワードが間違っています',
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
            }) => (
              <form onSubmit={handleSubmit}>
                <label for='username'>
                  <Text
                    fontSize='14px'
                    color='table.headerColor'
                    textAlign='left'
                    margin={2}
                    marginBottom='8px'
                    cursor='pointer'
                  >
                    タスク名
                  </Text>
                </label>
                <Box margin={2} marginBottom='24px'>
                  <InputGroup>
                    <Input
                      type='username'
                      name='username'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.username}
                      placeholder='タスク名を入力'
                      size='md'
                      id='username'
                    />
                  </InputGroup>
                  {errors.username && touched.username && errors.username}
                </Box>
                <label for='pass'>
                  <Text
                    fontSize='14px'
                    color='table.headerColor'
                    textAlign='left'
                    margin={2}
                    marginBottom='8px'
                    cursor='pointer'
                  >
                    タスク名
                  </Text>
                </label>
                <Box margin={2} marginBottom='24px'>
                  <InputGroup>
                    <Input
                      value={values.password}
                      type={togglePassword ? 'text' : 'password'}
                      name='password'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder='タスク名を入力'
                      size='md'
                      id='pass'
                    />
                    <InputRightElement
                      children={
                        <Box cursor='pointer' onClick={handleTogglePassword}>
                          {!togglePassword ? (
                            <AiOutlineEye />
                          ) : (
                            <AiOutlineEyeInvisible />
                          )}
                        </Box>
                      }
                    />
                  </InputGroup>
                  {errors.password && touched.password && errors.password}
                </Box>
                <YellowButton type='submit' disabled={isSubmitting}>
                  ログインする
                </YellowButton>
              </form>
            )}
          </Formik>
        </Stack>
      </Container>
      <Footer />
    </VStack>
  );
};

export default Login;
