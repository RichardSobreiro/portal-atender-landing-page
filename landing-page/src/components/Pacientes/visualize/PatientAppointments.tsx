/** @format */
import React from 'react';
import styles from './PatientAppointments.module.css';

interface Appointment {
  date: string;
  time: string;
}

interface PatientAppointmentsProps {
  appointments: Appointment[];
}

const PatientAppointments: React.FC<PatientAppointmentsProps> = ({
  appointments,
}) => {
  return (
    <div className={styles.appointmentsContainer}>
      <h2 className={styles.appointmentsTitle}>Agendamentos</h2>
      {appointments.length > 0 ? (
        <ul className={styles.appointmentList}>
          {appointments.map((appointment, index) => (
            <li key={index} className={styles.appointmentItem}>
              Marcado para {appointment.date} às {appointment.time}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noAppointments}>Nenhum agendamento disponível</p>
      )}
    </div>
  );
};

export default PatientAppointments;
