/** @format */

import React from 'react';
import { Field, ErrorMessage, useFormikContext } from 'formik';
import styles from './BasicInformation.module.css';
import { formatCpfCnpj } from '@/general/Formatters';

interface BasicInformationProps {
  setFieldValue: (field: string, value: any) => void;
}

const BasicInformation: React.FC<BasicInformationProps> = ({
  setFieldValue,
}) => {
  const { values } = useFormikContext<any>(); // Access form values directly

  const calculateAge = (dob: string) => {
    if (!dob) return '';
    const [day, month, year] = dob.split('/');
    if (!day || !month || !year) return '';

    const birthDate = new Date(`${year}-${month}-${day}`);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age.toString();
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value; // YYYY-MM-DD
    if (!inputDate) return;

    const [year, month, day] = inputDate.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    setFieldValue('birthDate', formattedDate);
    setFieldValue('age', calculateAge(formattedDate));
  };

  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setFieldValue('cpfCnpj', formatCpfCnpj(value));
  };

  return (
    <fieldset className={styles.section}>
      <legend className={styles.legend}>Dados Básicos</legend>
      <div className={styles.grid}>
        <div className={styles.inputGroup}>
          <label htmlFor="name">Nome*</label>
          <Field type="text" id="name" name="name" className={styles.input} />
          <ErrorMessage
            name="name"
            component="div"
            className={styles.errorMessage}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="birthDate">Data de Nascimento</label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            className={styles.input}
            value={
              values.birthDate
                ? values.birthDate.split('/').reverse().join('-') // Convert DD/MM/YYYY to YYYY-MM-DD for input
                : ''
            }
            onChange={handleDateChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="age">Idade</label>
          <Field
            type="text"
            id="age"
            name="age"
            className={`${styles.input} ${styles.grayedOut}`}
            readOnly
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="idCard">RG</label>
          <Field
            type="text"
            id="idCard"
            name="idCard"
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="cpfCnpj">CPF/CNPJ</label>
          <input
            type="text"
            id="cpfCnpj"
            name="cpfCnpj"
            className={styles.input}
            value={values.cpfCnpj || ''}
            onChange={handleCpfCnpjChange}
            placeholder="000.000.000-00"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="instagram">Instagram</label>
          <Field
            type="text"
            id="instagram"
            name="instagram"
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="profession">Profissão</label>
          <Field
            type="text"
            id="profession"
            name="profession"
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="workplace">Local de Trabalho</label>
          <Field
            type="text"
            id="workplace"
            name="workplace"
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="gender">Gênero</label>
          <Field
            as="select"
            id="gender"
            name="gender"
            className={styles.select}
          >
            <option value="">Selecione</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outros">Outros</option>
          </Field>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="maritalStatus">Estado Civil</label>
          <Field
            as="select"
            id="maritalStatus"
            name="maritalStatus"
            className={styles.select}
          >
            <option value="">Selecione</option>
            <option value="Solteiro">Solteiro</option>
            <option value="Casado">Casado</option>
            <option value="Viúvo">Viúvo</option>
            <option value="Divorciado">Divorciado</option>
          </Field>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="referral">Indicação</label>
          <Field
            type="text"
            id="referral"
            name="referral"
            className={styles.input}
          />
        </div>

        <div className={styles.fullWidthInputGroup}>
          <label htmlFor="observations">Observações</label>
          <Field
            as="textarea"
            id="observations"
            name="observations"
            className={styles.textarea}
          />
        </div>
      </div>
    </fieldset>
  );
};

export default BasicInformation;
