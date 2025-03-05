/** @format */

import React, { useCallback, useEffect, useState } from 'react';
import styles from './FormAnamnesis.module.css';
import { Field, Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faSpinner } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '@/services/axiosInstance';
import { formatPhoneNumber } from '@/general/Formatters';

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
  anamnesisModels?: { id: string; name: string }[];
  professionals?: { id: string; name: string }[];
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
  anamnesisModels = [],
  professionals = [],
  handleSubmit,
}) => {
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

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
    professional: Yup.string().required('Selecione um profissional'),
    fillDate: Yup.string()
      .matches(/^\d{2}\/\d{2}\/\d{4}$/, 'Data inválida (DD/MM/YYYY)')
      .nullable(),
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

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form className={styles.formContainer}>
          {/* DADOS BÁSICOS */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Dados Básicos</h2>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Cliente <span className={styles.required}>*</span>
                </label>
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
                <label className={styles.label}>
                  Modelo de Anamnese <span className={styles.required}>*</span>
                </label>
                <Field
                  as="select"
                  name="anamnesisModel"
                  className={styles.select}
                >
                  <option value="">Selecione um modelo</option>
                  {anamnesisModels?.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </Field>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  Profissional <span className={styles.required}>*</span>
                </label>
                <Field
                  as="select"
                  name="professional"
                  className={styles.select}
                >
                  <option value="">Selecione um profissional</option>
                  {professionals?.map((professional) => (
                    <option key={professional.id} value={professional.id}>
                      {professional.name}
                    </option>
                  ))}
                </Field>
              </div>
            </div>

            <div className={styles.inputRow}>
              <div className={`${styles.inputGroup} ${styles.dateGroup}`}>
                <label className={styles.label}>
                  Data de Preenchimento{' '}
                  <span className={styles.required}>*</span>
                </label>
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
              </div>
            </div>
          </div>

          {/* RESPOSTAS */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Respostas</h2>
            <p className={styles.placeholder}>
              A seção de perguntas será implementada futuramente.
            </p>
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
