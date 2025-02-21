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
import { useAuth } from '@/context/AuthContext';

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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showSpinner, hideSpinner } = useSpinner();
  const router = useRouter();
  const hasFetched = useRef(false);
  const authContext = useAuth();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 🔄 500ms delay

    return () => {
      clearTimeout(handler); // ✅ Clear timeout if user keeps typing
    };
  }, [searchTerm]);

  const fetchProcedures = useCallback(async () => {
    try {
      const companyId = authContext.user?.companyId;
      showSpinner();
      const response = await axiosInstance.get('/procedures', {
        params: {
          searchTerm: debouncedSearchTerm,
          page: currentPage,
          limit: 10,
          companyId: companyId,
        },
      });

      const sortedProcedures = response.data.data.sort(
        (a: Procedure, b: Procedure) =>
          a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
      );

      setProcedures(sortedProcedures);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Erro ao carregar procedimentos:', error);
      toast.error('Erro ao carregar procedimentos.');
    } finally {
      hideSpinner();
      hasFetched.current = false;
    }
  }, [debouncedSearchTerm, currentPage, showSpinner, hideSpinner]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchProcedures();
    } else {
      fetchProcedures();
    }
  }, [currentPage, debouncedSearchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
                <td>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(procedure.price)}
                </td>
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
