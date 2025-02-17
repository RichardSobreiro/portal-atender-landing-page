/** @format */
import React from 'react';
import styles from './PatientRecordWrapper.module.css';
import PatientRecords from './PatientRecords';
import PatientAppointments from './PatientAppointments';
import { PatientDto } from '@/dtos/Patients/PatientDto';
import PatientDetails from './PatientDetails';

interface PatientRecordWrapperProps {
  patient: PatientDto | null;
  appointments: { date: string; time: string }[];
}

const PatientRecordWrapper: React.FC<PatientRecordWrapperProps> = ({
  patient,
  appointments,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.appointmentsSection}>
          <PatientDetails patient={patient} />
          <PatientAppointments appointments={appointments} />
        </div>
        <div className={styles.notesSection}>
          <PatientRecords patientId={patient?.id} />
        </div>
      </div>
    </div>
  );
};

export default PatientRecordWrapper;
