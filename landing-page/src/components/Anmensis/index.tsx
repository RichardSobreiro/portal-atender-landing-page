/** @format */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import styles from './AnamnesisList.module.css';
import axiosInstance from '@/services/axiosInstance';
import { useSpinner } from '@/context/SpinnerContext';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSearch } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import withAuth from '@/components/HoC/WithAuth';

interface Anamnesis {
  id: string;
  patientName: string;
  anamnesisType: string;
  createdAt: string;
}

const AnamnesisList: React.FC = () => {
  const [anamnesisRecords, setAnamnesisRecords] = useState<Anamnesis[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const { showSpinner, hideSpinner } = useSpinner();
  const router = useRouter();
  const hasFetched = useRef(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const fetchAnamnesisRecords = useCallback(async () => {
    try {
      showSpinner();
      // const response = await axiosInstance.get('/anamnesis', {
      //   params: { searchTerm: debouncedSearchTerm },
      // });
      // setAnamnesisRecords(response.data);
    } catch (error) {
      console.error('Erro ao carregar anamneses:', error);
      toast.error('Erro ao carregar anamneses.');
    } finally {
      hideSpinner();
      hasFetched.current = false;
    }
  }, [debouncedSearchTerm, showSpinner, hideSpinner]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchAnamnesisRecords();
    } else {
      fetchAnamnesisRecords();
    }
  }, [debouncedSearchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const navigateToEdit = (id: string) => {
    router.push(`/pacientes/anamneses/${id}/editar`);
  };

  const navigateToCreate = () => {
    router.push('/pacientes/anamneses/novo');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Anamneses</h1>
        <button className={styles.createButton} onClick={navigateToCreate}>
          Novo
        </button>
      </div>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar anamnese por paciente..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        <button className={styles.searchButton} onClick={fetchAnamnesisRecords}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Tipo</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {anamnesisRecords.length > 0 ? (
            anamnesisRecords.map((record) => (
              <tr key={record.id} onClick={() => navigateToEdit(record.id)}>
                <td>{record.patientName}</td>
                <td>{record.anamnesisType}</td>
                <td>{new Date(record.createdAt).toLocaleDateString()}</td>
                <td className={styles.actions}>
                  <FontAwesomeIcon
                    icon={faEdit}
                    className={styles.editIcon}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToEdit(record.id);
                    }}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className={styles.noData}>
                Nenhuma anamnese encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default withAuth(AnamnesisList);
