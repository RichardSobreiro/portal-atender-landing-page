/** @format */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './EditAnamnesisModel.module.css';
import { toast } from 'react-toastify';
import { useSpinner } from '@/context/SpinnerContext';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '@/services/axiosInstance';
import withAuth from '@/components/HoC/WithAuth';
import FormAnamnesisModel from '../FormAnamnesisModel';
import DeleteConfirmationModal from '@/general/DeleteConfirmationModal';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

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

const EditAnamnesisModel: React.FC<{ anamnesisModelId: string }> = ({
  anamnesisModelId,
}) => {
  const router = useRouter();
  const { showSpinner, hideSpinner } = useSpinner();
  const [anamnesisForm, setAnamnesisForm] = useState<{
    name: string;
    type: string;
    groups: QuestionGroup[];
  }>({
    name: '',
    type: '',
    groups: [],
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router.query.success === 'true') {
      toast.success('Modelo de Anamnese criado com sucesso!');
      const newQuery = { ...router.query };
      delete newQuery.success;
      router.replace(
        { pathname: router.pathname, query: newQuery },
        undefined,
        { shallow: true }
      );
    }
  }, [router]);

  // Fetch Anamnesis Model Data
  useEffect(() => {
    if (!anamnesisModelId) return;

    const fetchAnamnesisModel = async () => {
      showSpinner();
      try {
        const response = await axiosInstance.get(
          `/anamnesis-models/${anamnesisModelId}`
        );
        setAnamnesisForm(response.data);
      } catch (error: any) {
        console.error('Erro ao buscar modelo de anamnese:', error);
        toast.error('Erro ao carregar o modelo de anamnese.');
        router.push('/pacientes/anamneses/modelos'); // Redirect if not found
      } finally {
        hideSpinner();
        setLoading(false);
      }
    };

    fetchAnamnesisModel();
  }, [anamnesisModelId]);

  // Handle Update Request
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
      await axiosInstance.patch(
        `/anamnesis-models/${anamnesisModelId}`,
        payload
      );
      toast.success('Modelo de anamnese atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar modelo:', error);
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

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      showSpinner();
      await axiosInstance.delete(`/anamnesis-models/${anamnesisModelId}`);
      toast.success('Modelo de anamnese excluído com sucesso!');

      router.push('/pacientes/anamneses/modelos');
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
      setIsDeleteModalOpen(false);
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

        <h2 className={styles.titlePage}>Editar Modelo de Anamnese</h2>

        <button
          id="headerDeleteButton"
          type="button"
          className={styles.deleteButtonHeader} // ✅ Update CSS class
          onClick={openDeleteModal} // ✅ Open modal on click
        >
          <FontAwesomeIcon icon={faTrash} className={styles.icon} />
          <span>Excluir</span>
        </button>
      </div>

      {!loading ? (
        <FormAnamnesisModel
          initialValues={{ name: anamnesisForm.name, type: anamnesisForm.type }}
          anamnesisForm={anamnesisForm}
          setAnamnesisForm={setAnamnesisForm}
          handleSubmit={handleSubmit}
        />
      ) : (
        <p className={styles.loadingMessage}>Carregando...</p>
      )}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        itemToBeDeletedDescription={anamnesisForm.name}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default withAuth(EditAnamnesisModel);
