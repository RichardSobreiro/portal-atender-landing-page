/** @format */

import React, { useCallback, useEffect, useState } from 'react';
import { Formik, Form, Field, FormikHelpers, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './EditProcedure.module.css';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import { useSpinner } from '@/context/SpinnerContext';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
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

const EditProcedure: React.FC<{ procedureId: string }> = ({ procedureId }) => {
  const router = useRouter();
  const { showSpinner, hideSpinner } = useSpinner();
  const authContext = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [initialValues, setInitialValues] =
    useState<ProcedureFormValues | null>(null);
  const [procedureName, setProcedureName] = useState<string>('Carregando...');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (router.query.success === 'true') {
      toast.success('Procedimento criado com sucesso!'); // ✅ Show toast message

      // Remove the query parameter after displaying the toast
      const newQuery = { ...router.query };
      delete newQuery.success;

      router.replace(
        { pathname: router.pathname, query: newQuery },
        undefined,
        { shallow: true } // ✅ Prevents full page reload
      );
    }
  }, [router]);

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

  const fetchProcedure = useCallback(async () => {
    if (!procedureId) return;

    showSpinner();
    try {
      const response = await axiosInstance.get(`/procedures/${procedureId}`);
      const procedure = response.data;
      setProcedureName(procedure.name);
      setInitialValues({
        name: procedure.name || '',
        color: procedure.color || '#0070f3',
        durationHours: Math.floor(procedure.duration / 60),
        durationMinutes: procedure.duration % 60,
        price: procedure.price || 0,
        costEstimated: procedure.costEstimated || 0,
        description: procedure.description || '',
        active: procedure.active ?? true,
        category: procedure.category || '',
        protocol: procedure.protocol || '',
        consentForm: procedure.consentForm || '',
      });
    } catch (error) {
      console.error('Erro ao carregar procedimento:', error);
      toast.error('Erro ao carregar os dados do procedimento.');
    } finally {
      hideSpinner();
    }
  }, [procedureId]);

  useEffect(() => {
    fetchProcedure();
  }, [fetchProcedure]);

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

      await axiosInstance.patch(`/procedures/${procedureId}`, payload);
      toast.success('Procedimento atualizado com sucesso!');
    } catch (error: any) {
      const errorMessages = error.response?.data?.message;
      if (Array.isArray(errorMessages)) {
        errorMessages.forEach((msg) => toast.error(msg));
      } else {
        toast.error(errorMessages || 'Ocorreu um erro inesperado.');
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
          <button
            className={styles.backButton}
            onClick={() => router.push('/atendimentos/procedimentos')}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            {!isMobile && ' Voltar'}
          </button>
          <h2 className={styles.titlePage}>{procedureName}</h2>
          {!isScrolled && (
            <button
              type="submit"
              form="editProcedureForm"
              className={styles.saveButton}
            >
              <FontAwesomeIcon icon={faSave} />
              {!isMobile && ' Salvar'}
            </button>
          )}
        </div>

        {initialValues && (
          <div className={styles.formContainer}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form className={styles.form} id="editProcedureForm" noValidate>
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
                    <div
                      className={`${styles.inputGroup} ${styles.priceInput}`}
                    >
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
                      <label className={styles.label}>
                        Custo Estimado (R$)
                      </label>
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

                          // If the value is in the English format (e.g., "1600.00"), convert it correctly
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
                            setFieldValue(
                              'costEstimated',
                              numericValue.toFixed(2)
                            ); // Format correctly
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
                    <div
                      className={`${styles.inputGroup} ${styles.categoryInput}`}
                    >
                      <label className={styles.label}>Categoria</label>
                      <Field
                        type="text"
                        name="category"
                        className={styles.input}
                      />
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
                        <label className={styles.label}>
                          Duração (Minutos)
                        </label>
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
                    <div
                      className={`${styles.inputGroup} ${styles.activeInput}`}
                    >
                      <label className={styles.label}>Ativo</label>
                      <Field
                        type="checkbox"
                        name="active"
                        className={styles.activeCheckbox}
                      />
                    </div>
                    <div
                      className={`${styles.inputGroup} ${styles.colorInput}`}
                    >
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
                    <label className={styles.label}>
                      Termo de Consentimento
                    </label>
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
                      <FontAwesomeIcon
                        icon={faSave}
                        className={styles.saveIcon}
                      />
                      Salvar
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}
      </div>
    </>
  );
};

export default withAuth(EditProcedure);
