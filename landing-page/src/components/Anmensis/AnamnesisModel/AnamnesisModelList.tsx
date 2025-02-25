/** @format */

import React, { useEffect, useState, useCallback } from 'react';
import styles from './AnamnesisModelList.module.css';
import axiosInstance from '@/services/axiosInstance';
import { useSpinner } from '@/context/SpinnerContext';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import withAuth from '@/components/HoC/WithAuth';

interface AnamnesisModel {
  id: string;
  name: string;
  type: string;
}

const AnamnesisModelList: React.FC = () => {
  const [anamnesisModels, setAnamnesisModels] = useState<AnamnesisModel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { showSpinner, hideSpinner } = useSpinner();
  const router = useRouter();

  const fetchAnamnesisModels = useCallback(async () => {
    try {
      showSpinner();
      const response = await axiosInstance.get('/anamnesis-models', {
        params: { searchTerm },
      });
      setAnamnesisModels(response.data);
    } catch (error) {
      console.error('Erro ao carregar modelos de anamnese:', error);
      toast.error('Erro ao carregar modelos de anamnese.');
    } finally {
      hideSpinner();
    }
  }, [searchTerm, showSpinner, hideSpinner]);

  useEffect(() => {
    //fetchAnamnesisModels();
  }, [fetchAnamnesisModels]);

  const navigateToCreate = () => {
    router.push('/pacientes/anamneses/modelos/novo');
  };

  const navigateToEdit = (id: string) => {
    router.push(`/pacientes/anamneses/modelos/${id}/editar`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
              <tr key={model.id}>
                <td>{model.name}</td>
                <td>{model.type}</td>
                <td className={styles.actions}>
                  <FontAwesomeIcon
                    icon={faEdit}
                    className={styles.editIcon}
                    onClick={() => navigateToEdit(model.id)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className={styles.deleteIcon}
                  />
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
    </div>
  );
};

export default withAuth(AnamnesisModelList);
