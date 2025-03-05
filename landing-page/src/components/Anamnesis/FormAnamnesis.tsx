/** @format */

import React, { useCallback, useEffect, useState } from 'react';
import styles from './FormAnamnesis.module.css';
import { Field, Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faSpinner } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '@/services/axiosInstance';
import { formatPhoneNumber } from '@/general/Formatters';
import FormAnamnesisResponses from './FormAnamnesisResponses';

export interface OptionDto {
  id: string;
  text: string;
}

export interface QuestionDto {
  id: string;
  text: string;
  type:
    | 'yesno'
    | 'text'
    | 'number'
    | 'multiple_choice'
    | 'dropdown'
    | 'date'
    | 'textarea';
  required: boolean;
  options?: OptionDto[];
}

export interface QuestionGroupDto {
  id: string;
  name: string;
  questions: QuestionDto[];
}

export interface AnamnesisModelDto {
  id: string;
  name: string;
  type: string;
  groups: QuestionGroupDto[];
}

interface Patient {
  id: string;
  name: string;
  phone: string;
}

interface FormAnamnesisProps {
  initialValues: {
    patientId: string;
    patientName: string;
    anamnesisModel: string;
    professional: string;
    fillDate: string;
  };
  handleSubmit: (values: {
    patientId: string;
    patientName: string;
    anamnesisModel: string;
    professional: string;
    fillDate: string;
  }) => void;
}

const FormAnamnesis: React.FC<FormAnamnesisProps> = ({
  initialValues,
  handleSubmit,
}) => {
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [anamnesisModelTypes, setAnamnesisModelTypes] = useState<
    { id: string; name: string; type: string }[]
  >([]);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [selectedAnamnesisModel, setSelectedAnamnesisModel] =
    useState<AnamnesisModelDto | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchAnamnesisModels = async () => {
      try {
        const response = await axiosInstance.get('/anamnesis-models/search');
        setAnamnesisModelTypes(response.data);
      } catch (error) {
        console.error('Erro ao buscar os modelos de anamnese:', error);
      }
    };

    fetchAnamnesisModels();
  }, []);

  // Function to fetch patients based on search term
  const fetchPatients = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get(`/patients/search`, {
        params: { name: query },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPatients(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchPatients]);

  const validationSchema = Yup.object({
    patientName: Yup.string().required('O nome do cliente é obrigatório'),
    anamnesisModel: Yup.string().required('Selecione um modelo de anamnese'),
    professional: Yup.string().nullable(), // ✅ Now optional
    fillDate: Yup.string()
      .required('A data de preenchimento é obrigatória') // ✅ Must not be empty
      .matches(
        /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
        'Data inválida (DD/MM/YYYY)'
      ), // ✅ Ensures a valid DD/MM/YYYY format
  });

  // Function to apply date mask dynamically (Allows full deletion)
  const handleDateMask = (value: string) => {
    let onlyNumbers = value.replace(/\D/g, ''); // Remove non-numeric characters
    if (onlyNumbers.length > 8) onlyNumbers = onlyNumbers.slice(0, 8);

    let formattedValue = '';

    if (onlyNumbers.length > 0) formattedValue = onlyNumbers.slice(0, 2);
    if (onlyNumbers.length > 2) formattedValue += '/' + onlyNumbers.slice(2, 4);
    if (onlyNumbers.length > 4) formattedValue += '/' + onlyNumbers.slice(4, 8);

    return formattedValue;
  };

  const fetchAnamnesisModel = async (modelId: string) => {
    try {
      const response = await axiosInstance.get(`/anamnesis-models/${modelId}`);
      setSelectedAnamnesisModel(response.data);
    } catch (error) {
      console.error('Erro ao buscar detalhes do modelo de anamnese:', error);
      setSelectedAnamnesisModel(null);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnBlur
      validateOnChange
      onSubmit={(values, { validateForm, setSubmitting }) => {
        validateForm(values).then((errors) => {
          if (Object.keys(errors).length === 0) {
            handleSubmit(values);
          }
          setSubmitting(false);
        });
      }}
    >
      {({ values, setFieldValue }) => (
        <Form id="anamnesisForm" className={styles.formContainer}>
          {/* DADOS BÁSICOS */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Dados Básicos</h2>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Cliente</label>
                <div className={styles.searchWrapper}>
                  <Field
                    type="text"
                    name="patientName"
                    placeholder="Digite o nome do cliente"
                    className={styles.input}
                    value={values.patientName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setSearchTerm(e.target.value);
                      setSelectedPatient(null); // Allow changing patient
                      setFieldValue('patientName', e.target.value);
                    }}
                  />
                  <ErrorMessage
                    name="patientName"
                    component="div"
                    className={styles.errorMessage}
                  />
                  {loading && (
                    <FontAwesomeIcon
                      icon={faSpinner}
                      spin
                      className={styles.loadingIcon}
                    />
                  )}
                  {searchResults.length > 0 && !selectedPatient && (
                    <ul className={styles.searchResults}>
                      {searchResults.map((patient) => (
                        <li
                          key={patient.id}
                          className={styles.searchResultItem}
                          onClick={() => {
                            setFieldValue('patientId', patient.id); // ✅ Store the selected patient ID
                            setFieldValue('patientName', patient.name);
                            setSearchTerm(patient.name);
                            setSelectedPatient(patient.id);
                            setSearchResults([]); // Hide dropdown
                          }}
                        >
                          <span className={styles.patientName}>
                            {patient.name}
                          </span>
                          <span className={styles.patientPhone}>
                            {formatPhoneNumber(patient.phone) || 'Sem telefone'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Modelo de Anamnese</label>
                <Field
                  as="select"
                  name="anamnesisModel"
                  className={styles.select}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const modelId = e.target.value;
                    setFieldValue('anamnesisModel', modelId);
                    if (modelId) fetchAnamnesisModel(modelId);
                  }}
                >
                  <option value="">Selecione um modelo</option>
                  {anamnesisModelTypes.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="anamnesisModel"
                  component="div"
                  className={styles.errorMessage}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Profissional</label>
                <Field
                  as="select"
                  name="professional"
                  className={styles.select}
                >
                  <option value="">Selecione um profissional</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </Field>
              </div>
            </div>

            <div className={styles.inputRow}>
              <div className={`${styles.inputGroup} ${styles.dateGroup}`}>
                <label className={styles.label}>Data de Preenchimento </label>
                <div className={styles.datePickerWrapper}>
                  <Field
                    type="text"
                    name="fillDate"
                    placeholder="DD/MM/AAAA"
                    className={styles.input}
                    value={values.fillDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFieldValue('fillDate', handleDateMask(e.target.value))
                    }
                  />
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className={styles.calendarIcon}
                  />
                </div>
                <ErrorMessage
                  name="fillDate"
                  component="div"
                  className={styles.errorMessage}
                />
              </div>
            </div>
          </div>

          {/* RESPOSTAS */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Respostas</h2>
            <FormAnamnesisResponses anamnesisModel={selectedAnamnesisModel} />
          </div>

          <button type="submit" className={styles.saveButton}>
            Salvar
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default FormAnamnesis;
