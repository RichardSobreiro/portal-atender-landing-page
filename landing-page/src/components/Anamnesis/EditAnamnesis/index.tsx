/** @format */

import React, { useEffect, useState } from 'react';
import styles from './EditAnamnesis.module.css';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useSpinner } from '@/context/SpinnerContext';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '@/services/axiosInstance';
import withAuth from '@/components/HoC/WithAuth';
import FormAnamnesis from '../FormAnamnesis';

const EditAnamnesis: React.FC<{ anamnesisId: string }> = ({ anamnesisId }) => {
  const router = useRouter();
  const { showSpinner, hideSpinner } = useSpinner();
  const [anamnesisData, setAnamnesisData] = useState(null);

  useEffect(() => {
    if (anamnesisId) {
      fetchAnamnesis();
    }
  }, [anamnesisId]);

  const fetchAnamnesis = async () => {
    showSpinner();
    try {
      const response = await axiosInstance.get(`/anamnesis/${anamnesisId}`);
      setAnamnesisData(response.data);
    } catch (error) {
      toast.error('Erro ao carregar a anamnese.');
      console.error(error);
      router.push('/pacientes/anamneses');
    } finally {
      hideSpinner();
    }
  };

  useEffect(() => {
    if (router.query.success === 'true') {
      toast.success('Anamnese criada com sucesso!');
      const newQuery = { ...router.query };
      delete newQuery.success;
      router.replace(
        { pathname: router.pathname, query: newQuery },
        undefined,
        { shallow: true }
      );
    }
  }, [router]);

  const handleSubmit = async (values: any) => {
    showSpinner();
    try {
      await axiosInstance.patch(`/anamnesis/${anamnesisId}`, values);
      toast.success('Anamnese atualizada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao criar anamnese:', error);
      const errorMessages = error.response?.data?.message;

      if (Array.isArray(errorMessages)) {
        errorMessages.forEach((msg) => toast.error(msg));
      } else {
        const errorMessage = errorMessages || 'Ocorreu um erro inesperado.';
        toast.error(errorMessage);
      }
    } finally {
      hideSpinner();
    }
  };

  if (!anamnesisData) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <button
          className={styles.backButton}
          onClick={() => router.push('/pacientes/anamneses')}
        >
          <FontAwesomeIcon icon={faArrowLeft} className={styles.icon} />
          <span>Voltar</span>
        </button>
        <h2 className={styles.titlePage}>Editar Anamnese</h2>
        <button
          type="submit"
          form="anamnesisForm"
          className={styles.saveButtonHeader}
        >
          <FontAwesomeIcon icon={faSave} className={styles.icon} />
          <span>Salvar</span>
        </button>
      </div>

      <FormAnamnesis
        initialValues={anamnesisData}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default withAuth(EditAnamnesis);
