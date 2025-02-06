/** @format */

import React from 'react';
import { Field, ErrorMessage } from 'formik';
import styles from './EmergencyContact.module.css';

interface EmergencyContactProps {
  setFieldValue: (field: string, value: any) => void;
}

const EmergencyContact: React.FC<EmergencyContactProps> = ({
  setFieldValue,
}) => {
  return (
    <fieldset className={styles.section}>
      <legend className={styles.legend}>Contato de Emergência</legend>
      <div className={styles.grid}>
        <div className={styles.inputGroup}>
          <label htmlFor="emergencyName">Nome</label>
          <Field
            type="text"
            id="emergencyName"
            name="emergencyName"
            className={styles.input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFieldValue('emergencyName', e.target.value)
            }
          />
          <ErrorMessage
            name="emergencyName"
            component="div"
            className={styles.errorMessage}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="healthPlan">Plano de Saúde</label>
          <Field
            type="text"
            id="healthPlan"
            name="healthPlan"
            className={styles.input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFieldValue('healthPlan', e.target.value)
            }
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="emergencyPhone">Telefone</label>
          <Field
            type="text"
            id="emergencyPhone"
            name="emergencyPhone"
            className={styles.input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFieldValue('emergencyPhone', e.target.value)
            }
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="bloodType">Tipo Sanguíneo</label>
          <Field
            as="select"
            id="bloodType"
            name="bloodType"
            className={styles.input}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setFieldValue('bloodType', e.target.value)
            }
          >
            <option value="">Selecione</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </Field>
        </div>
      </div>
    </fieldset>
  );
};

export default EmergencyContact;
