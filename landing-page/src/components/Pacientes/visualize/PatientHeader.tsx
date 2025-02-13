/** @format */
import React from 'react';
import styles from './PatientHeader.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

interface PatientHeaderProps {
  name: string;
  patientId: string;
}

const PatientHeader: React.FC<PatientHeaderProps> = ({ name, patientId }) => {
  const router = useRouter();

  return (
    <div className={styles.headerContainer}>
      {/* Voltar Button */}
      <button className={styles.backButton} onClick={() => router.back()}>
        <FontAwesomeIcon icon={faArrowLeft} />
        <span className={styles.buttonText}>Voltar</span>
      </button>

      {/* Patient Name */}
      <h1 className={styles.patientName}>{name}</h1>

      {/* Editar Paciente Button */}
      <button
        className={styles.editButton}
        onClick={() => router.push(`/pacientes/${patientId}/editar`)}
      >
        <FontAwesomeIcon icon={faEdit} />
        <span className={styles.buttonText}>Editar</span>
      </button>
    </div>
  );
};

export default PatientHeader;
