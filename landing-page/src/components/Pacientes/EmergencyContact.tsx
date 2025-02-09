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
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove all non-numeric characters

    value = value.slice(0, 11);

    // Allow full deletion
    if (value.length === 0) {
      setFieldValue('emergencyContactPhone', '');
      return;
    }

    // Prevent forcing a space if the user is deleting
    if (value.length < 2) {
      setFieldValue('emergencyContactPhone', `(${value}`);
      return;
    }

    // Format landline (10 digits) and mobile (11 digits)
    if (value.length <= 10) {
      value = value.replace(
        /^(\d{2})(\d{0,4})(\d{0,4})/,
        (match, p1, p2, p3) => {
          let formatted = `(${p1}`;
          if (p2) formatted += `) ${p2}`;
          if (p3) formatted += `-${p3}`;
          return formatted;
        }
      );
    } else {
      value = value.replace(
        /^(\d{2})(\d{0,5})(\d{0,4})/,
        (match, p1, p2, p3) => {
          let formatted = `(${p1}`;
          if (p2) formatted += `) ${p2}`;
          if (p3) formatted += `-${p3}`;
          return formatted;
        }
      );
    }

    setFieldValue('emergencyContactPhone', value);
  };

  return (
    <fieldset className={styles.section}>
      <legend className={styles.legend}>Contato de Emergência</legend>
      <div className={styles.grid}>
        <div className={styles.inputGroup}>
          <label htmlFor="emergencyContactName">Nome</label>
          <Field
            type="text"
            id="emergencyContactName"
            name="emergencyContactName"
            className={styles.input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFieldValue('emergencyContactName', e.target.value)
            }
          />
          <ErrorMessage
            name="emergencyContactName"
            component="div"
            className={styles.errorMessage}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="healthInsurance">Plano de Saúde</label>
          <Field
            type="text"
            id="healthInsurance"
            name="healthInsurance"
            className={styles.input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFieldValue('healthInsurance', e.target.value)
            }
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="emergencyContactPhone">Telefone</label>
          <Field
            type="text"
            id="emergencyContactPhone"
            name="emergencyContactPhone"
            className={styles.input}
            onChange={handlePhoneInput}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="bloodType">Tipo Sanguíneo</label>
          <Field
            as="select"
            id="bloodType"
            name="bloodType"
            className={styles.select}
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
