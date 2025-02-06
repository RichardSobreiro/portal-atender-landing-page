/** @format */

import React, { useState, useEffect, useCallback } from 'react';
import styles from './PatientsList.module.css';
import axiosInstance from '@/services/axiosInstance';
import { useSpinner } from '@/context/SpinnerContext';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faEdit,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Patient {
  id: string;
  nome: string;
  nascimento: string;
  telefone: string;
  email: string;
}

const PatientsList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { showSpinner, hideSpinner } = useSpinner();
  const router = useRouter();

  const fetchPatients = useCallback(async () => {
    try {
      showSpinner();
      const response = await axiosInstance.get('/patients', {
        params: { search: searchTerm },
      });
      setPatients(response.data.patients);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
      toast.error('Erro ao carregar pacientes.');
    } finally {
      hideSpinner();
    }
  }, [searchTerm, showSpinner, hideSpinner]);

  useEffect(() => {
    //fetchPatients();
  }, [fetchPatients]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = () => {
    fetchPatients();
  };

  const navigateToCreatePatient = () => {
    router.push('/pacientes/novo');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Pacientes</h1>
        <button
          className={styles.createButton}
          onClick={navigateToCreatePatient}
        >
          Novo
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou email"
            value={searchTerm}
            onChange={handleSearch}
            className={styles.searchInput}
          />
          <FontAwesomeIcon icon={faFilter} className={styles.filterIcon} />
        </div>

        <button className={styles.searchButton} onClick={handleSearchSubmit}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Nascimento</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {patients.length > 0 ? (
            patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.nome}</td>
                <td>{patient.nascimento}</td>
                <td>{patient.telefone}</td>
                <td>{patient.email}</td>
                <td className={styles.actions}>
                  <FontAwesomeIcon icon={faEdit} className={styles.editIcon} />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className={styles.deleteIcon}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className={styles.noData}>
                Nenhum paciente encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PatientsList;
