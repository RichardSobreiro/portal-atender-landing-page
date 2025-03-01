/** @format */

import React, { useState } from 'react';
import * as Yup from 'yup';
import styles from './CreateAnamnesisModel.module.css';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useSpinner } from '@/context/SpinnerContext';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '@/services/axiosInstance';
import withAuth from '@/components/HoC/WithAuth';
import FormAnamnesisModel from '../FormAnamnesisModel';

interface Question {
  id: string;
  type: string;
  text: string;
  required: boolean;
  order: number;
  options?: { id: string; text: string }[];
}

interface QuestionGroup {
  id: string;
  name: string;
  questions: Question[];
}

const CreateAnamnesisModel: React.FC = () => {
  const router = useRouter();
  const { showSpinner, hideSpinner } = useSpinner();
  const [anamnesisForm, setAnamnesisForm] = useState({
    name: '',
    type: '',
    groups: [] as QuestionGroup[],
  });

  const handleSubmit = async (values: { name: string; type: string }) => {
    if (anamnesisForm.groups.length === 0) {
      toast.error('O modelo deve ter pelo menos um grupo.');
      return;
    }

    const hasAtLeastOneQuestion = anamnesisForm.groups.some(
      (group) => group.questions.length > 0
    );

    if (!hasAtLeastOneQuestion) {
      toast.error('Cada grupo deve ter pelo menos uma pergunta.');
      return;
    }

    for (const group of anamnesisForm.groups) {
      if (!group.name.trim()) {
        toast.error('O nome do grupo não pode estar vazio.');
        return;
      }

      for (const question of group.questions) {
        if (!question.text.trim()) {
          toast.error('O texto da pergunta não pode estar vazio.');
          return;
        }

        if (question.options) {
          for (const option of question.options) {
            if (!option.text.trim()) {
              toast.error('O texto da opção não pode estar vazio.');
              return;
            }
          }
        }
      }
    }

    showSpinner();
    try {
      const payload = { ...values, groups: anamnesisForm.groups };
      const response = await axiosInstance.post('/anamnesis-models', payload);
      const anamnesisModelId = response.data.id;
      router.push({
        pathname: `/pacientes/anamneses/modelos/${anamnesisModelId}/editar`,
        query: { success: 'true' },
      });
    } catch (error: any) {
      console.error('Erro ao criar modelo:', error);
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

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <button
          className={styles.backButton}
          onClick={() => router.push('/pacientes/anamneses/modelos')}
        >
          <FontAwesomeIcon icon={faArrowLeft} className={styles.icon} />
          <span>Voltar</span>
        </button>

        <h2 className={styles.titlePage}>Novo Modelo de Anamnese</h2>

        <button
          type="submit"
          form="anamnesisModelForm"
          className={styles.saveButtonHeader}
        >
          <FontAwesomeIcon icon={faSave} className={styles.icon} />
          <span>Salvar</span>
        </button>
      </div>

      <FormAnamnesisModel
        initialValues={{ name: '', type: '' }}
        anamnesisForm={anamnesisForm}
        setAnamnesisForm={setAnamnesisForm}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default withAuth(CreateAnamnesisModel);
