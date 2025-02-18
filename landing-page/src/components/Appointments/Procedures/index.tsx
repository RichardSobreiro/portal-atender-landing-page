/** @format */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './ProceduresList.module.css';
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
import withAuth from '@/components/HoC/WithAuth';

interface Procedure {
  id: string;
  color: string;
  name: string;
  category: string;
  duration: number;
  price: number;
}

const ProceduresList: React.FC = () => {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showSpinner, hideSpinner } = useSpinner();
  const router = useRouter();
  const hasFetched = useRef(false);

  const fetchProcedures = useCallback(async () => {
    try {
      showSpinner();
      const response = await axiosInstance.get('/procedures', {
        params: { name: searchTerm, page: currentPage, limit: 10 },
      });

      setProcedures(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Erro ao carregar procedimentos:', error);
      toast.error('Erro ao carregar procedimentos.');
    } finally {
      hideSpinner();
    }
  }, [searchTerm, currentPage, showSpinner, hideSpinner]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchProcedures();
    }
  }, [fetchProcedures]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh
    fetchProcedures();
  };

  const navigateToCreateProcedure = () => {
    router.push('/atendimentos/procedimentos/novo');
  };

  const navigateToEditProcedure = (id: string) => {
    router.push(`/atendimentos/procedimentos/${id}/editar`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Procedimentos</h1>
        <button
          className={styles.createButton}
          onClick={navigateToCreateProcedure}
        >
          Novo
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nome ou categoria"
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
            <th>Cor</th>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Duração</th>
            <th>Preço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(procedures) && procedures.length > 0 ? (
            procedures.map((procedure) => (
              <tr key={procedure.id} className={styles.clickableRow}>
                <td>
                  <span
                    className={styles.colorBox}
                    style={{ backgroundColor: procedure.color }}
                  ></span>
                </td>
                <td>{procedure.name}</td>
                <td>{procedure.category}</td>
                <td>{procedure.duration} min</td>
                <td>R$ {procedure.price.toFixed(2)}</td>
                <td className={styles.actions}>
                  <FontAwesomeIcon
                    icon={faEdit}
                    className={styles.editIcon}
                    onClick={() => navigateToEditProcedure(procedure.id)}
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
              <td colSpan={6} className={styles.noData}>
                Nenhum procedimento encontrado.
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

export default withAuth(ProceduresList);
