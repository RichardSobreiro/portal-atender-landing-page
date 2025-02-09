/** @format */

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import Pagination from '@/general/Pagination';
import { formatDate } from '@/general/Formatters';

interface Patient {
  id: string;
  name: string;
  birthDate: string;
  phone: string;
  email: string;
}

const PatientsList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showSpinner, hideSpinner } = useSpinner();
  const router = useRouter();
  const hasFetched = useRef(false);

  const fetchPatients = useCallback(async () => {
    try {
      showSpinner();
      const response = await axiosInstance.get('/patients', {
        params: { nome: searchTerm, page: currentPage, limit: 10 },
      });
      const formattedPatients = response.data.data.map((patient: any) => {
        const favoritePhone =
          patient.phones.find((phone: any) => phone.favorite) ||
          patient.phones[0] ||
          null;
        const favoriteEmail =
          patient.emails.find((email: any) => email.favorite) ||
          patient.emails[0] ||
          null;

        return {
          ...patient,
          phone: favoritePhone ? favoritePhone.number : '',
          email: favoriteEmail ? favoriteEmail.address : '',
        };
      });

      setPatients(formattedPatients);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
      toast.error('Erro ao carregar pacientes.');
    } finally {
      hideSpinner();
    }
  }, [searchTerm, currentPage, showSpinner, hideSpinner]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchPatients();
    }
  }, [fetchPatients]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh
    fetchPatients();
  };

  const navigateToCreatePatient = () => {
    router.push('/pacientes/novo');
  };

  const navigateToEditPatient = (id: string) => {
    router.push(`/pacientes/${id}/editar`);
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
          {Array.isArray(patients) && patients.length > 0 ? (
            patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.name}</td>
                <td>{formatDate(patient.birthDate)}</td>
                <td>{patient.phone}</td>
                <td>{patient.email}</td>
                <td className={styles.actions}>
                  <FontAwesomeIcon
                    icon={faEdit}
                    className={styles.editIcon}
                    onClick={() => navigateToEditPatient(patient.id)}
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
              <td colSpan={5} className={styles.noData}>
                Nenhum paciente encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default PatientsList;
