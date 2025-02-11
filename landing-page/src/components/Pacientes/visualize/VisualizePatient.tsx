/** @format */
import React from 'react';
import styles from './VisualizePatient.module.css';
import PatientHeader from './PatientHeader';
import PatientRecords from './PatientRecords';
import PatientAppointments from './PatientAppointments';

interface VisualizePatientProps {
  patientId: string;
}

const VisualizePatient: React.FC<VisualizePatientProps> = ({ patientId }) => {
  const patientName = 'Adriana Oliveira';
  const appointments = [{ date: '28/11/2024', time: '10:30' }];

  return (
    <div className={styles.container}>
      <PatientHeader name={patientName} />
      <div className={styles.content}>
        <div className={styles.appointmentsSection}>
          <PatientAppointments appointments={appointments} />
        </div>
        <div className={styles.notesSection}>
          <PatientRecords />
        </div>
      </div>
    </div>
  );
};

export default VisualizePatient;
