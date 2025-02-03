/** @format */

import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './LoginPage.module.css';
import ClickableText from '@/general/ClickableText';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { useSpinner } from '@/context/SpinnerContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const authContext = useAuth();
  const { showSpinner, hideSpinner, isLoading } = useSpinner();

  const validationSchema = Yup.object({
    username: Yup.string()
      .email('Formato de email inválido')
      .required('Email é obrigatório'),
    password: Yup.string().required('Senha é obrigatória'),
    rememberMe: Yup.boolean(),
  });

  const initialValues: FormValues = {
    username: '',
    password: '',
    rememberMe: false,
  };

  useEffect(() => {
    if (authContext.user != null) {
      router.push('/dashboard');
    }
  }, [authContext.user, router]);

  return (
    <div className={styles.container}>
      {isLoading && <div className={styles.spinner}></div>}{' '}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const loginApi = authContext.login;
          showSpinner();

          try {
            await loginApi({
              username: values.username.trim(),
              password: values.password,
              rememberMe: values.rememberMe,
            });

            toast.success('Login realizado com sucesso!');
            router.push('/dashboard');
          } catch (error) {
            if (error instanceof TypeError) {
              toast.error(
                'Falha ao conectar ao servidor. Tente novamente mais tarde.'
              );
            } else if (error instanceof Error) {
              toast.error(error.message);
            } else {
              toast.error('Ocorreu um erro inesperado. Tente novamente.');
            }
          } finally {
            setSubmitting(false);
            hideSpinner();
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className={styles.loginForm} noValidate>
            {' '}
            <h2>Entrar</h2>
            <label htmlFor="username">Email</label>
            <Field
              type="email"
              id="username"
              name="username"
              className={styles.input}
            />
            <ErrorMessage
              name="username"
              component="div"
              className={styles.errorMessage}
            />
            <label htmlFor="password">Senha</label>
            <Field
              type="password"
              id="password"
              name="password"
              className={styles.input}
            />
            <ErrorMessage
              name="password"
              component="div"
              className={styles.errorMessage}
            />
            <div className={styles.checkboxContainer}>
              <Field
                type="checkbox"
                name="rememberMe"
                id="rememberMe"
                className={styles.checkbox}
              />
              <label htmlFor="rememberMe">Mantenha-me logado</label>
            </div>
            <button
              type="submit"
              className={styles.loginButton}
              disabled={isSubmitting || isLoading}
            >
              {isLoading ? 'Carregando...' : 'Entrar'}
            </button>
            <div className={styles.links}>
              <ClickableText
                text="Esqueci minha senha"
                onClick={() => router.push('/esqueci-minha-senha')}
                className="small_primary"
              />
              <ClickableText
                text="Criar uma conta"
                onClick={() => router.push('/cadastro')}
                className="small_primary"
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
