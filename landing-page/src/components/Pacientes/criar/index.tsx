/** @format */

import React, { useEffect, useState } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
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
import axiosInstance from '@/services/axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';

interface CreatePatientFormValues {
  name: string;
  birthDate: string;
  age: string;
  idCard: string;
  cpfCnpj: string;
  instagram: string;
  profession: string;
  workplace: string;
  gender: string;
  maritalStatus: string;
  referral: string;
  observations: string;
  phones: { type: string; number: string; favorite: boolean }[];
  emails: { type: string; address: string; favorite: boolean }[];
  addresses: {
    type: string;
    postalCode: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    favorite: boolean;
  }[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  healthInsurance: string;
  bloodType: string;
  responsibles: {
    name: string;
    relation: string;
    phone: string;
    email: string;
    profession: string;
    idCard: string;
    cpfCnpj: string;
  }[];
}

const CreatePatient: React.FC = () => {
  const router = useRouter();
  const { showSpinner, hideSpinner, isLoading } = useSpinner();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize on first load

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string().required('Nome é obrigatório'),
  });

  const initialValues: CreatePatientFormValues = {
    name: '',
    birthDate: '',
    age: '',
    idCard: '',
    cpfCnpj: '',
    instagram: '',
    profession: '',
    workplace: '',
    gender: '',
    maritalStatus: '',
    referral: '',
    observations: '',
    phones: [],
    emails: [],
    addresses: [],
    emergencyContactName: '',
    emergencyContactPhone: '',
    healthInsurance: '',
    bloodType: '',
    responsibles: [],
  };

  const handleSubmit = async (
    values: CreatePatientFormValues,
    { setSubmitting }: FormikHelpers<CreatePatientFormValues>
  ) => {
    showSpinner();
    try {
      const removeMask = (value: string) => value.replace(/\D/g, ''); // Remove all non-digit characters

      const payload = {
        ...values,
        age: values.age ? Number(values.age) : undefined, // Ensure age is a number
        birthDate: values.birthDate
          ? new Date(values.birthDate).toISOString().split('T')[0] // Convert to YYYY-MM-DD
          : undefined,
        cpfCnpj: removeMask(values.cpfCnpj), // Remove mask from CPF/CNPJ
        emergencyContactPhone: removeMask(values.emergencyContactPhone), // Remove mask from emergency phone
        phones: values.phones
          .filter((phone) => phone.number) // Ensure phone.number exists
          .map((phone) => ({
            type: phone.type,
            number: removeMask(phone.number), // Remove mask from phone number
            favorite: phone.favorite ?? false,
          })),
        emails: values.emails
          .filter((email) => email.address && email.address.trim() !== '') // Remove empty emails
          .map((email) => ({
            type: email.type,
            address: String(email.address).trim(), // Ensure it's a string
            favorite: email.favorite ?? false,
          })),
        addresses: values.addresses.map((address) => ({
          ...address,
          postalCode: removeMask(address.postalCode), // Remove mask from postalCode
        })),
        responsibles: values.responsibles.map((responsible) => ({
          ...responsible,
          phone: removeMask(responsible.phone), // Remove mask from responsible's phone
          cpfCnpj: removeMask(responsible.cpfCnpj), // Remove mask from responsible's CPF/CNPJ
        })),
      };

      const response = await axiosInstance.post('/patients', payload);
      const patientId = response.data.id;
      toast.success('Paciente cadastrado com sucesso!');
      router.push(`/pacientes/${patientId}/editar`);
    } catch (error: any) {
      const errorMessages = error.response?.data?.message;

      if (Array.isArray(errorMessages)) {
        // Show each validation message in a separate toast
        errorMessages.forEach((msg) => toast.error(msg));
      } else {
        // Show a single toast for other errors
        const errorMessage = errorMessages || 'Ocorreu um erro inesperado.';
        toast.error(errorMessage);
      }
    } finally {
      hideSpinner();
      setSubmitting(false); // Ensure the form re-enables the button
    }
  };

  return (
    <>
      <ToastContainer />
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <button
            className={styles.backButton}
            onClick={() => router.push('/pacientes')}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            {!isMobile && ' Voltar'}
          </button>
          <h2 className={styles.titlePage}>Novo Cliente</h2>
          {!isScrolled && (
            <button
              type="submit"
              form="createPatientForm"
              className={styles.saveButton}
            >
              <FontAwesomeIcon icon={faSave} />
              {!isMobile && ' Salvar'}
            </button>
          )}
        </div>

        {isLoading && <div className={styles.spinner}></div>}

        <div className={styles.formContainer}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {
              console.log('Formik onSubmit triggered'); // <-- Check if this appears in the console
              handleSubmit(values, actions);
            }}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className={styles.form} id="createPatientForm" noValidate>
                <BasicInformation setFieldValue={setFieldValue} />
                <div className={styles.contactSection}>
                  <ContactInput
                    name="phones"
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
                <AddressInput
                  name="addresses"
                  label="Endereços"
                  setFieldValue={setFieldValue}
                />
                <div className={styles.emergencyResponsibleSection}>
                  <EmergencyContact setFieldValue={setFieldValue} />
                  <ResponsibleContacts setFieldValue={setFieldValue} />
                </div>
                {isScrolled && (
                  <button
                    type="submit"
                    form="createPatientForm"
                    className={styles.floatingSaveButton}
                  >
                    <FontAwesomeIcon icon={faSave} />
                  </button>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default CreatePatient;
