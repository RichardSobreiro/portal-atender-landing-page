/** @format */

import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import styles from './SignUp.module.css';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import { useSpinner } from '@/context/SpinnerContext';
import 'react-toastify/dist/ReactToastify.css';

interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

const SignUp: React.FC = () => {
  const router = useRouter();
  const { showSpinner, hideSpinner, isLoading } = useSpinner();

  const validationSchema = Yup.object({
    name: Yup.string().required('Nome é obrigatório'),
    email: Yup.string()
      .email('Formato de email inválido')
      .required('Email é obrigatório'),
    password: Yup.string()
      .required('Senha é obrigatória')
      .min(8, 'A senha deve ter pelo menos 8 caracteres')
      .matches(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
      .matches(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
      .matches(/\d/, 'A senha deve conter pelo menos um número')
      .matches(
        /[@$!%*?&]/,
        'A senha deve conter pelo menos um caractere especial'
      ),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('password')], 'As senhas devem coincidir')
      .required('Confirmação de senha é obrigatória'),
  });

  const initialValues: SignUpFormValues = {
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  };

  const handleSubmit = async (
    values: SignUpFormValues,
    { setSubmitting }: FormikHelpers<SignUpFormValues>
  ) => {
    showSpinner();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar conta');
      }

      toast.success(
        'Cadastro realizado com sucesso! Você pode fazer login agora.'
      );
      router.push('/entrar');
    } catch (error) {
      if (error instanceof TypeError) {
        // Network error (e.g., API is down)
        toast.error(
          'Falha ao conectar ao servidor. Tente novamente mais tarde.'
        );
      } else if (error instanceof Error) {
        // API returned an error
        toast.error(error.message);
      } else {
        // Unknown error
        toast.error('Ocorreu um erro inesperado. Tente novamente.');
      }
    } finally {
      hideSpinner();
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className={styles.titleContainer}>
        <h2 className={styles.titlePage}>Criar Conta</h2>
      </div>

      {isLoading && <div className={styles.spinner}></div>}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={styles.form} noValidate>
            <label htmlFor="name">Nome</label>
            <Field type="text" id="name" name="name" className={styles.input} />
            <ErrorMessage
              name="name"
              component="div"
              className={styles.errorMessage}
            />

            <label htmlFor="email">Email</label>
            <Field
              type="email"
              id="email"
              name="email"
              className={styles.input}
            />
            <ErrorMessage
              name="email"
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

            <label htmlFor="passwordConfirmation">Confirmação da Senha</label>
            <Field
              type="password"
              id="passwordConfirmation"
              name="passwordConfirmation"
              className={styles.input}
            />
            <ErrorMessage
              name="passwordConfirmation"
              component="div"
              className={styles.errorMessage}
            />

            <div className={styles.actionsContainer}>
              <button
                type="button"
                className={`${styles.button} ${styles.cancelButton}`}
                onClick={() => router.push('/entrar')}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`${styles.button} ${styles.submitButton}`}
                disabled={isSubmitting || isLoading}
              >
                {isLoading ? 'Carregando...' : 'Criar Conta'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignUp;
