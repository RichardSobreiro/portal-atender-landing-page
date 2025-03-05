/** @format */
import DeleteConfirmationModal from '@/general/DeleteConfirmationModal';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import ConfirmationModal from '@/general/ConfirmationModal';
import styles from './AnamnesisModelList.module.css';
import axiosInstance from '@/services/axiosInstance';
import { useSpinner } from '@/context/SpinnerContext';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faSearch,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import withAuth from '@/components/HoC/WithAuth';

interface AnamnesisModel {
  id: string;
  name: string;
  type: string;
  companyId?: string | null;
}

const AnamnesisModelList: React.FC = () => {
  const [anamnesisModels, setAnamnesisModels] = useState<AnamnesisModel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const { showSpinner, hideSpinner } = useSpinner();
  const router = useRouter();
  const hasFetched = useRef(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AnamnesisModel | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const fetchAnamnesisModels = useCallback(async () => {
    try {
      showSpinner();
      const response = await axiosInstance.get('/anamnesis-models', {
        params: { searchTerm: debouncedSearchTerm },
      });
      setAnamnesisModels(response.data);
    } catch (error) {
      console.error('Erro ao carregar modelos de anamnese:', error);
      toast.error('Erro ao carregar modelos de anamnese.');
    } finally {
      hideSpinner();
      hasFetched.current = false;
    }
  }, [debouncedSearchTerm, showSpinner, hideSpinner]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchAnamnesisModels();
    } else {
      fetchAnamnesisModels();
    }
  }, [debouncedSearchTerm]);

  const navigateToCreate = () => {
    router.push('/pacientes/anamneses/modelos/novo');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const openDeleteModal = (model: AnamnesisModel) => {
    setSelectedModel(model);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedModel) return;

    try {
      showSpinner();
      await axiosInstance.delete(`/anamnesis-models/${selectedModel.id}`);
      toast.success(`Modelo "${selectedModel.name}" excluído com sucesso!`);

      // Refresh list after deletion
      fetchAnamnesisModels();
    } catch (error: any) {
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
      setSelectedModel(null);
    }
  };

  const openEditModal = (model: AnamnesisModel) => {
    if (!model.companyId) {
      setSelectedModel(model);
      setIsEditModalOpen(true);
    } else {
      router.push(`/pacientes/anamneses/modelos/${model.id}/editar`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Modelos de Anamnese</h1>
        <button className={styles.createButton} onClick={navigateToCreate}>
          Novo
        </button>
      </div>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar modelo por nome..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        <button className={styles.searchButton} onClick={fetchAnamnesisModels}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {anamnesisModels.length > 0 ? (
            anamnesisModels.map((model) => (
              <tr
                key={model.id}
                className={styles.tooltipContainer}
                data-tooltip={
                  model.companyId
                    ? 'Modelo personalizado (Criado pela sua empresa)'
                    : 'Modelo padrão (Disponível globalmente)'
                }
                onClick={() => openEditModal(model)}
              >
                <td>
                  {model.companyId && (
                    <FontAwesomeIcon
                      icon={faUser}
                      className={styles.customModelIcon}
                    />
                  )}
                  {model.name}
                </td>
                <td>{model.type}</td>
                <td className={styles.actions}>
                  <FontAwesomeIcon
                    icon={faEdit}
                    className={styles.editIcon}
                    onClick={() => openEditModal(model)}
                  />
                  {model.companyId && (
                    <FontAwesomeIcon
                      icon={faTrash}
                      className={styles.deleteIcon}
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(model);
                      }}
                    />
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className={styles.noData}>
                Nenhum modelo de anamnese encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        itemToBeDeletedDescription={selectedModel?.name || ''}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
      <ConfirmationModal
        isOpen={isEditModalOpen}
        title="Aviso"
        message={
          <>
            O modelo de anamnese <strong>"{selectedModel?.name}"</strong> é um
            modelo padrão e não pode ser editado diretamente.
            <br />
            Se você prosseguir, será criado um novo modelo personalizado para
            sua empresa.
            <br />
            <br />O novo modelo será exibido na lista com o seguinte ícone ao
            lado do nome:{' '}
            <FontAwesomeIcon icon={faUser} className={styles.customModelIcon} />
          </>
        }
        confirmButtonText="Ok, entendi"
        cancelButtonText="Cancelar"
        onConfirm={() =>
          router.push(
            `/pacientes/anamneses/modelos/${selectedModel?.id}/editar`
          )
        }
        onCancel={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};

export default withAuth(AnamnesisModelList);
