/** @format */
import React from 'react';
import styles from './PatientHeader.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

interface PatientHeaderProps {
  name: string;
}

const PatientHeader: React.FC<PatientHeaderProps> = ({ name }) => {
  const router = useRouter();

  return (
    <div className={styles.headerContainer}>
      <button className={styles.backButton} onClick={() => router.back()}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <h1 className={styles.patientName}>{name}</h1>
      <button className={styles.editButton}>
        <FontAwesomeIcon icon={faEdit} />
        Editar Paciente
      </button>
    </div>
  );
};

export default PatientHeader;
