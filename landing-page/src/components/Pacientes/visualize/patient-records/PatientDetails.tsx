/** @format */
import React from 'react';
import styles from './PatientDetails.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faUser,
  faPhone,
  faScroll,
} from '@fortawesome/free-solid-svg-icons';
import {
  calculateAge,
  formatDate,
  formatPhoneNumber,
} from '@/general/Formatters';
import { PatientDto } from '@/dtos/Patients/PatientDto';

interface PatientDetailsProps {
  patient: PatientDto | null;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ patient }) => {
  if (!patient) {
    return <h3>Carregando...</h3>;
  }

  const favoritePhone =
    patient.phones.find((phone) => phone.favorite) || patient.phones[0] || null;

  return (
    <div className={styles.container}>
      <h2 className={styles.name}>{patient.name}</h2>

      {patient.birthDate && (
        <div className={styles.detail}>
          <FontAwesomeIcon icon={faCalendarAlt} className={styles.icon} />
          Nascimento: {formatDate(patient.birthDate)} (
          {calculateAge(formatDate(patient.birthDate))} anos)
        </div>
      )}

      <div className={styles.detail}>
        <FontAwesomeIcon icon={faScroll} className={styles.icon} />
        Cadastrado em {formatDate(patient.createdAt)}
      </div>

      {(patient.gender || patient.maritalStatus || patient.profession) && (
        <div className={styles.detail}>
          <FontAwesomeIcon icon={faUser} className={styles.icon} />
          {patient.gender && `${patient.gender}, `}
          {patient.maritalStatus && `${patient.maritalStatus}, `}
          {patient.profession && patient.profession}
        </div>
      )}

      {favoritePhone && (
        <div className={styles.detail}>
          <FontAwesomeIcon icon={faPhone} className={styles.icon} />
          {formatPhoneNumber(favoritePhone.number)}
        </div>
      )}
    </div>
  );
};

export default PatientDetails;
