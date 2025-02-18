/** @format */

import React from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
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

  const validationSchema = Yup.object({
    name: Yup.string().required('Nome é obrigatório'),
    color: Yup.string().required('Selecione uma cor'),
    durationHours: Yup.number().min(0, 'Horas não pode ser negativo'),
    durationMinutes: Yup.number()
      .min(0, 'Minutos não pode ser negativo')
      .max(59, 'Máximo 59 minutos'),
    price: Yup.number().min(0, 'Preço deve ser maior ou igual a 0'),
    costEstimated: Yup.number().min(
      0,
      'Custo estimado deve ser maior ou igual a 0'
    ),
    category: Yup.string().required('Categoria é obrigatória'),
  });

  const handleSubmit = async (
    values: ProcedureFormValues,
    { setSubmitting }: FormikHelpers<ProcedureFormValues>
  ) => {
    showSpinner();
    try {
      const payload = {
        ...values,
        duration: values.durationHours * 60 + values.durationMinutes, // Convert to total minutes
      };

      await axiosInstance.post('/procedures', payload);
      toast.success('Procedimento criado com sucesso!');
      router.push('/procedures');
    } catch (error: any) {
      toast.error('Erro ao criar procedimento.');
    } finally {
      hideSpinner();
      setSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer />
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
          {({ values, isSubmitting }) => (
            <Form className={styles.formContainer}>
              {/* Name, Price, Cost */}
              <div className={styles.inputRow}>
                <div className={`${styles.inputGroup} ${styles.nameInput}`}>
                  <label className={styles.label}>Nome</label>
                  <Field type="text" name="name" className={styles.input} />
                </div>
                <div className={`${styles.inputGroup} ${styles.priceInput}`}>
                  <label className={styles.label}>Preço (R$)</label>
                  <Field type="number" name="price" className={styles.input} />
                </div>
                <div className={`${styles.inputGroup} ${styles.costInput}`}>
                  <label className={styles.label}>Custo Estimado (R$)</label>
                  <Field
                    type="number"
                    name="costEstimated"
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Categoria and Duração */}
              <div className={styles.inputRow}>
                <div className={`${styles.inputGroup} ${styles.categoryInput}`}>
                  <label className={styles.label}>Categoria</label>
                  <Field type="text" name="category" className={styles.input} />
                </div>
                <div className={styles.durationGroup}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Duração (Horas)</label>
                    <Field
                      type="number"
                      name="durationHours"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Duração (Minutos)</label>
                    <Field
                      type="number"
                      name="durationMinutes"
                      className={styles.input}
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
