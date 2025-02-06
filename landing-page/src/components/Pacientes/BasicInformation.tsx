/** @format */

import React from 'react';
import { Field, ErrorMessage, useFormikContext } from 'formik';
import styles from './BasicInformation.module.css';

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

    setFieldValue('dataNascimento', formattedDate);
    setFieldValue('idade', calculateAge(formattedDate));
  };

  const formatCpfCnpj = (value: string) => {
    const digits = value.replace(/\D/g, ''); // Remove non-numeric characters

    if (digits.length <= 11) {
      // CPF Format: 999.999.999-99
      return digits
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1-$2');
    } else {
      // CNPJ Format: 99.999.999/9999-99 (Max 14 digits)
      return digits
        .slice(0, 14) // Restrict to 14 digits
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/\/(\d{4})(\d)/, '/$1-$2');
    }
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
          <label htmlFor="nome">Nome*</label>
          <Field type="text" id="nome" name="nome" className={styles.input} />
          <ErrorMessage
            name="nome"
            component="div"
            className={styles.errorMessage}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="dataNascimento">Data de Nascimento</label>
          <input
            type="date"
            id="dataNascimento"
            name="dataNascimento"
            className={styles.input}
            value={
              values.dataNascimento
                ? values.dataNascimento.split('/').reverse().join('-') // Convert DD/MM/YYYY to YYYY-MM-DD for input
                : ''
            }
            onChange={handleDateChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="idade">Idade</label>
          <Field
            type="text"
            id="idade"
            name="idade"
            className={`${styles.input} ${styles.grayedOut}`}
            readOnly
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="rg">RG</label>
          <Field type="text" id="rg" name="rg" className={styles.input} />
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
          <label htmlFor="profissao">Profissão</label>
          <Field
            type="text"
            id="profissao"
            name="profissao"
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="localTrabalho">Local de Trabalho</label>
          <Field
            type="text"
            id="localTrabalho"
            name="localTrabalho"
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="genero">Gênero</label>
          <Field
            as="select"
            id="genero"
            name="genero"
            className={styles.select}
          >
            <option value="">Selecione</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outros">Outros</option>
          </Field>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="estadoCivil">Estado Civil</label>
          <Field
            as="select"
            id="estadoCivil"
            name="estadoCivil"
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
          <label htmlFor="indicacao">Indicação</label>
          <Field
            type="text"
            id="indicacao"
            name="indicacao"
            className={styles.input}
          />
        </div>

        <div className={styles.fullWidthInputGroup}>
          <label htmlFor="observacoes">Observações</label>
          <Field
            as="textarea"
            id="observacoes"
            name="observacoes"
            className={styles.textarea}
          />
        </div>
      </div>
    </fieldset>
  );
};

export default BasicInformation;
