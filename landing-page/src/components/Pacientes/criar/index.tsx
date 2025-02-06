/** @format */

import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import styles from './CreatePatient.module.css';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import { useSpinner } from '@/context/SpinnerContext';
import 'react-toastify/dist/ReactToastify.css';
import ContactInput from '../ContactInput';
import AddressInput from '../AddressInput';
import EmergencyContact from '../EmergencyContact';
import ResponsibleContacts from '../ResponsibleContacts';
import BasicInformation from '../BasicInformation';

interface CreatePatientFormValues {
  nome: string;
  dataNascimento: string;
  idade: string;
  rg: string;
  cpfCnpj: string;
  instagram: string;
  profissao: string;
  localTrabalho: string;
  genero: string;
  estadoCivil: string;
  indicacao: string;
  observacoes: string;
  telefones: { tipo: string; numero: string; favorito: boolean }[];
  emails: { tipo: string; endereco: string; favorito: boolean }[];
  enderecos: {
    tipo: string;
    cep: string;
    rua: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    pais: string;
    favorito: boolean;
  }[];
  emergencyName: string;
  emergencyPhone: string;
  healthPlan: string;
  bloodType: string;
  responsaveis: {
    name: string;
    relation: string;
    phone: string;
    email: string;
    profession: string;
    rg: string;
    cpfCnpj: string;
  }[];
}

const CreatePatient: React.FC = () => {
  const router = useRouter();
  const { showSpinner, hideSpinner, isLoading } = useSpinner();

  const validationSchema = Yup.object({
    nome: Yup.string().required('Nome é obrigatório'),
  });

  const initialValues: CreatePatientFormValues = {
    nome: '',
    dataNascimento: '',
    idade: '',
    rg: '',
    cpfCnpj: '',
    instagram: '',
    profissao: '',
    localTrabalho: '',
    genero: '',
    estadoCivil: '',
    indicacao: '',
    observacoes: '',
    telefones: [],
    emails: [],
    enderecos: [],
    emergencyName: '',
    emergencyPhone: '',
    healthPlan: '',
    bloodType: '',
    responsaveis: [],
  };

  const handleSubmit = async (
    values: CreatePatientFormValues,
    { setSubmitting }: FormikHelpers<CreatePatientFormValues>
  ) => {
    showSpinner();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/patients`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao cadastrar paciente');
      }

      toast.success('Paciente cadastrado com sucesso!');
      router.push('/pacientes');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Ocorreu um erro inesperado.'
      );
    } finally {
      hideSpinner();
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer />

      <div className={styles.titleContainer}>
        <button
          className={styles.backButton}
          onClick={() => router.push('/pacientes')}
        >
          ← Voltar
        </button>
        <h2 className={styles.titlePage}>Novo Cliente</h2>
      </div>

      {isLoading && <div className={styles.spinner}></div>}

      <div className={styles.formContainer}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className={styles.form} noValidate>
              {/* DADOS BÁSICOS SECTION */}
              <BasicInformation setFieldValue={setFieldValue} />

              {/* CONTATOS SECTION */}
              <div className={styles.contactSection}>
                <ContactInput
                  name="telefones"
                  label="Telefones"
                  options={['Celular', 'Residencial', 'Comercial']}
                  setFieldValue={setFieldValue}
                />
                <ContactInput
                  name="emails"
                  label="Emails"
                  options={['Pessoal', 'Empresarial']}
                  setFieldValue={setFieldValue}
                />
              </div>

              {/* Endereços Section */}
              <AddressInput
                name="enderecos"
                label="Endereços"
                setFieldValue={setFieldValue}
              />

              {/* CONTATO DE EMERGÊNCIA & RESPONSÁVEIS SECTIONS */}
              <div className={styles.emergencyResponsibleSection}>
                <EmergencyContact setFieldValue={setFieldValue} />
                <ResponsibleContacts setFieldValue={setFieldValue} />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreatePatient;
