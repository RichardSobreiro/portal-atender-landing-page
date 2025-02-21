/** @format */

import React from 'react';
import { Formik, Form, Field, FormikHelpers, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './CreateProcedure.module.css';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import { useSpinner } from '@/context/SpinnerContext';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '@/services/axiosInstance';
import withAuth from '@/components/HoC/WithAuth';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/general/Formatters';

interface ProcedureFormValues {
  name: string;
  color: string;
  durationHours: number;
  durationMinutes: number;
  price: number;
  costEstimated: number;
  description: string;
  active: boolean;
  category: string;
  protocol: string;
  consentForm: string;
}

const CreateProcedure: React.FC = () => {
  const router = useRouter();
  const { showSpinner, hideSpinner } = useSpinner();
  const authContext = useAuth();

  const validationSchema = Yup.object({
    name: Yup.string().required('Nome é obrigatório'),
    color: Yup.string().required('Selecione uma cor'),
    durationHours: Yup.number().min(0, 'Horas não pode ser negativo'),
    durationMinutes: Yup.number()
      .min(0, 'Minutos não pode ser negativo')
      .max(59, 'Máximo 59 minutos'),
    price: Yup.mixed()
      .test(
        'is-valid-number',
        'O preço deve ser um número válido.',
        (value: unknown) => {
          if (value === undefined || value === null) return true; // Allow empty values

          if (typeof value === 'string') {
            const numericValue = parseFloat(
              value.replace(/\./g, '').replace(',', '.')
            );
            return !isNaN(numericValue);
          }

          return typeof value === 'number' && !isNaN(value);
        }
      )
      .test(
        'min-value',
        'O preço deve ser maior ou igual a 0.',
        (value: unknown) => {
          if (value === undefined || value === null) return true; // Allow empty values

          let numericValue: number;

          if (typeof value === 'string') {
            numericValue = parseFloat(
              value.replace(/\./g, '').replace(',', '.')
            );
          } else if (typeof value === 'number') {
            numericValue = value;
          } else {
            return false; // Invalid type
          }

          return !isNaN(numericValue) && numericValue >= 0;
        }
      ),

    costEstimated: Yup.mixed()
      .test(
        'is-valid-number',
        'O custo estimado deve ser um número válido.',
        (value: unknown) => {
          if (value === undefined || value === null) return true; // Allow empty values

          if (typeof value === 'string') {
            const numericValue = parseFloat(
              value.replace(/\./g, '').replace(',', '.')
            );
            return !isNaN(numericValue);
          }

          return typeof value === 'number' && !isNaN(value);
        }
      )
      .test(
        'min-value',
        'O custo estimado deve ser maior ou igual a 0.',
        (value: unknown) => {
          if (value === undefined || value === null) return true; // Allow empty values

          let numericValue: number;

          if (typeof value === 'string') {
            numericValue = parseFloat(
              value.replace(/\./g, '').replace(',', '.')
            );
          } else if (typeof value === 'number') {
            numericValue = value;
          } else {
            return false; // Invalid type
          }

          return !isNaN(numericValue) && numericValue >= 0;
        }
      ),
    category: Yup.string().required('Categoria é obrigatória'),
  });

  const handleSubmit = async (
    values: ProcedureFormValues,
    { setSubmitting }: FormikHelpers<ProcedureFormValues>
  ) => {
    const companyId = authContext.user?.companyId;
    showSpinner();
    try {
      const payload = {
        ...values,
        duration: values.durationHours * 60 + values.durationMinutes, // Convert to total minutes
        companyId: companyId,
        price: parseFloat(values.price.toString().replace(',', '.')), // ✅ Convert before sending
        costEstimated: parseFloat(
          values.costEstimated.toString().replace(',', '.')
        ), // ✅ Convert before sending
      };

      const response = await axiosInstance.post('/procedures', payload);
      const procedureId = response.data.id;
      //toast.success('Procedimento criado com sucesso!');
      router.push({
        pathname: `/atendimentos/procedimentos/${procedureId}/editar`,
        query: { success: 'true' },
      });
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
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          {/* Back Button */}
          <button className={styles.backButton} onClick={() => router.back()}>
            <FontAwesomeIcon icon={faArrowLeft} className={styles.icon} />
            <span>Voltar</span>
          </button>

          {/* Page Title */}
          <h2 className={styles.titlePage}>Criar Procedimento</h2>

          {/* Save Button */}
          <button
            type="submit"
            form="createProcedureForm"
            className={styles.saveButtonHeader}
          >
            <FontAwesomeIcon icon={faSave} className={styles.icon} />
            <span>Criar</span>
          </button>
        </div>

        <Formik
          initialValues={{
            name: '',
            color: '#0070f3',
            durationHours: 0,
            durationMinutes: 30,
            price: 0,
            costEstimated: 0,
            description: '',
            active: true,
            category: '',
            protocol: '',
            consentForm: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form id="createProcedureForm" className={styles.formContainer}>
              {/* Name, Price, Cost */}
              <div className={styles.inputRow}>
                <div className={`${styles.inputGroup} ${styles.nameInput}`}>
                  <label className={styles.label}>Nome</label>
                  <Field type="text" name="name" className={styles.input} />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className={styles.errorMessage}
                  />
                </div>
                <div className={`${styles.inputGroup} ${styles.priceInput}`}>
                  <label className={styles.label}>Preço (R$)</label>
                  <Field
                    type="text"
                    name="price"
                    className={styles.input}
                    value={formatCurrency(values.price + '')} // Always display formatted value
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      let rawValue = e.target.value?.replace(/\D/g, ''); // Keep only digits

                      while (rawValue.length < 3) {
                        rawValue = '0' + rawValue; // Ensure two decimal places
                      }

                      // Format as "1.000,00"
                      let formattedValue =
                        rawValue
                          .slice(0, -2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, '.') +
                        ',' +
                        rawValue.slice(-2);

                      setFieldValue('price', formattedValue); // Store formatted value for display
                    }}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                      let valueStr = values.price.toString().trim();

                      // // If the value is in the English format (e.g., "1600.00"), convert it correctly
                      // if (/^\d+\.\d{2}$/.test(valueStr)) {
                      //   valueStr = valueStr.replace('.', ','); // Convert decimal separator to Brazilian format
                      // } // Case 2: Already formatted ("1.600,00") or user input ("1.600,00")
                      // else
                      if (/^\d{1,3}(\.\d{3})*,\d{2}$/.test(valueStr)) {
                        valueStr = valueStr.replace(/\./g, ''); // Remove thousands separator (dots)
                        valueStr = valueStr.replace(',', '.'); // Convert decimal separator for parsing
                      }

                      let numericValue = parseFloat(valueStr);

                      if (!isNaN(numericValue)) {
                        setFieldValue('price', numericValue.toFixed(2)); // Format correctly
                      }
                    }}
                  />
                  <ErrorMessage
                    name="price"
                    component="div"
                    className={styles.errorMessage}
                  />
                </div>
                <div className={`${styles.inputGroup} ${styles.costInput}`}>
                  <label className={styles.label}>Custo Estimado (R$)</label>
                  <Field
                    type="text"
                    name="costEstimated"
                    className={styles.input}
                    value={formatCurrency(values.costEstimated + '')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      let rawValue = e.target.value?.replace(/\D/g, ''); // Keep only digits

                      while (rawValue.length < 3) {
                        rawValue = '0' + rawValue; // Ensure two decimal places
                      }

                      // Format as "1.000,00"
                      let formattedValue =
                        rawValue
                          .slice(0, -2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, '.') +
                        ',' +
                        rawValue.slice(-2);

                      setFieldValue('costEstimated', formattedValue); // Store formatted value for display
                    }}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                      let valueStr = values.costEstimated.toString().trim();
                      if (/^\d{1,3}(\.\d{3})*,\d{2}$/.test(valueStr)) {
                        valueStr = valueStr.replace(/\./g, ''); // Remove thousands separator (dots)
                        valueStr = valueStr.replace(',', '.'); // Convert decimal separator for parsing
                      }

                      let numericValue = parseFloat(valueStr);

                      if (!isNaN(numericValue)) {
                        setFieldValue('costEstimated', numericValue.toFixed(2)); // Format correctly
                      }
                    }}
                  />
                  <ErrorMessage
                    name="costEstimated"
                    component="div"
                    className={styles.errorMessage}
                  />
                </div>
              </div>

              {/* Categoria and Duração */}
              <div className={styles.inputRow}>
                <div className={`${styles.inputGroup} ${styles.categoryInput}`}>
                  <label className={styles.label}>Categoria</label>
                  <Field type="text" name="category" className={styles.input} />
                  <ErrorMessage
                    name="category"
                    component="div"
                    className={styles.errorMessage}
                  />
                </div>
                <div className={styles.durationGroup}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Duração (Horas)</label>
                    <Field
                      type="number"
                      name="durationHours"
                      className={styles.input}
                    />
                    <ErrorMessage
                      name="durationHours"
                      component="div"
                      className={styles.errorMessage}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Duração (Minutos)</label>
                    <Field
                      type="number"
                      name="durationMinutes"
                      className={styles.input}
                    />
                    <ErrorMessage
                      name="durationMinutes"
                      component="div"
                      className={styles.errorMessage}
                    />
                  </div>
                </div>
              </div>

              {/* Ativo & Cor */}
              <div className={styles.inputRow}>
                <div className={`${styles.inputGroup} ${styles.activeInput}`}>
                  <label className={styles.label}>Ativo</label>
                  <Field
                    type="checkbox"
                    name="active"
                    className={styles.activeCheckbox}
                  />
                </div>
                <div className={`${styles.inputGroup} ${styles.colorInput}`}>
                  <label className={styles.label}>Cor</label>
                  <Field
                    type="color"
                    name="color"
                    className={styles.colorPicker}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Descrição</label>
                <Field
                  as="textarea"
                  name="description"
                  className={styles.textarea}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Protocolo</label>
                <Field
                  as="textarea"
                  name="protocol"
                  className={styles.textarea}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Termo de Consentimento</label>
                <Field
                  as="textarea"
                  name="consentForm"
                  className={styles.textarea}
                />
              </div>

              <div className={styles.saveButtonContainer}>
                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={isSubmitting}
                >
                  <FontAwesomeIcon icon={faSave} className={styles.saveIcon} />
                  Criar
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default withAuth(CreateProcedure);
