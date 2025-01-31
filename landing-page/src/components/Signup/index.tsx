/** @format */

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './SignUp.module.css';
import { useRouter } from 'next/router';

interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

const SignUp: React.FC = () => {
  const router = useRouter();

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

  const handleSubmit = (values: SignUpFormValues) => {
    console.log('SignUp Data:', values);
    alert('Cadastro realizado com sucesso!');
    router.push('/entrar'); // Redirect to login after successful signup
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2 className={styles.titlePage}>Criar Conta</h2>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className={styles.form}>
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
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.submitButton}`}
            >
              Criar Conta
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default SignUp;
