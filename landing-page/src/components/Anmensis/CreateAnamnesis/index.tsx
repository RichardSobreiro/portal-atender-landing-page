/** @format */

import React, { useState } from 'react';
import styles from './CreateAnamnesis.module.css';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useSpinner } from '@/context/SpinnerContext';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '@/services/axiosInstance';
import withAuth from '@/components/HoC/WithAuth';
import FormAnamnesis from '../FormAnamnesis';

const CreateAnamnesis: React.FC = () => {
  const router = useRouter();
  const { showSpinner, hideSpinner } = useSpinner();
  const [anamnesisData, setAnamnesisData] = useState({
    patientName: '',
    anamnesisType: '',
  });

  const handleSubmit = async (values: {
    patientName: string;
    anamnesisType: string;
  }) => {
    showSpinner();
    try {
      await axiosInstance.post('/anamnesis', values);
      toast.success('Anamnese criada com sucesso!');
      router.push('/pacientes/anamneses');
    } catch (error) {
      toast.error('Erro ao criar anamnese.');
      console.error(error);
    } finally {
      hideSpinner();
    }
  };

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
        <h2 className={styles.titlePage}>Nova Anamnese</h2>
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

export default withAuth(CreateAnamnesis);
