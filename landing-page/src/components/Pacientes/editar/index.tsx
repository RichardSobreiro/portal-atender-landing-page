/** @format */

import React, { useCallback, useEffect, useState } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import styles from './EditPatient.module.css';
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
import {
  faArrowLeft,
  faSave,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { formatCpfCnpj, formatPhoneNumber } from '@/general/Formatters';

interface EditPatientFormValues {
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

interface EditPatientProps {
  patientId: string;
}

const EditPatient: React.FC<EditPatientProps> = ({ patientId }) => {
  const router = useRouter();
  const { showSpinner, hideSpinner, isLoading } = useSpinner();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [initialValues, setInitialValues] =
    useState<EditPatientFormValues | null>(null);
  const [patientName, setPatientName] = useState<string>('Carregando...');

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

  const fetchPatient = useCallback(async () => {
    if (!patientId) return;

    showSpinner();
    try {
      const response = await axiosInstance.get(`/patients/${patientId}`);
      const patient = response.data;
      setPatientName(patient.name);
      setInitialValues({
        name: patient.name || '',
        birthDate: patient.birthDate || '',
        age: patient.age ? String(patient.age) : '',
        idCard: patient.idCard || '',
        cpfCnpj: formatCpfCnpj(patient.cpfCnpj || ''),
        instagram: patient.instagram || '',
        profession: patient.profession || '',
        workplace: patient.workplace || '',
        gender: patient.gender || '',
        maritalStatus: patient.maritalStatus || '',
        referral: patient.referral || '',
        observations: patient.observations || '',
        phones: patient.phones
          ? patient.phones.map((phone: any) => ({
              ...phone,
              number: formatPhoneNumber(phone.number),
            }))
          : [],
        emails: patient.emails || [],
        addresses: patient.addresses || [],
        emergencyContactName: patient.emergencyContactName || '',
        emergencyContactPhone: formatPhoneNumber(
          patient.emergencyContactPhone || ''
        ),
        healthInsurance: patient.healthInsurance || '',
        bloodType: patient.bloodType || '',
        responsibles: patient.responsibles || [],
      });
    } catch (error) {
      console.error('Erro ao carregar paciente:', error);
      toast.error('Erro ao carregar os dados do paciente.');
    } finally {
      hideSpinner();
    }
  }, [patientId]);

  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  const handleSubmit = async (
    values: EditPatientFormValues,
    { setSubmitting }: FormikHelpers<EditPatientFormValues>
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

      const response = await axiosInstance.patch(
        `/patients/${patientId}`,
        payload
      );
      toast.success('Paciente atualizado com sucesso!');
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
          <h2 className={styles.titlePage}>{patientName}</h2>
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

        {initialValues && (
          <div className={styles.formContainer}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, actions) => {
                console.log('Formik onSubmit triggered'); // <-- Check if this appears in the console
                handleSubmit(values, actions);
              }}
              enableReinitialize
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
        )}
      </div>
    </>
  );
};

export default EditPatient;
