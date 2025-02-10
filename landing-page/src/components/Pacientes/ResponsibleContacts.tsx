/** @format */

import React from 'react';
import { FieldArray, Field } from 'formik';
import styles from './ResponsibleContacts.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

interface ResponsibleContactsProps {
  setFieldValue: (field: string, value: any) => void;
}

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

const handleCpfCnpjChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  index: number,
  setFieldValue: (field: string, value: any) => void
) => {
  let value = e.target.value;
  setFieldValue(`responsibles[${index}].cpfCnpj`, formatCpfCnpj(value));
};

const handlePhoneInput = (
  e: React.ChangeEvent<HTMLInputElement>,
  index: number,
  setFieldValue: (field: string, value: any) => void
) => {
  let value = e.target.value.replace(/\D/g, ''); // Remove all non-numeric characters

  // Enforce 11-digit limit
  value = value.slice(0, 11);

  // Allow full deletion
  if (value.length === 0) {
    setFieldValue(`responsibles[${index}].phone`, '');
    return;
  }

  // Prevent forcing a space if the user is deleting
  if (value.length < 2) {
    setFieldValue(`responsibles[${index}].phone`, `(${value}`);
    return;
  }

  // Format landline (10 digits) and mobile (11 digits)
  if (value.length <= 10) {
    value = value.replace(/^(\d{2})(\d{0,4})(\d{0,4})/, (match, p1, p2, p3) => {
      let formatted = `(${p1}`;
      if (p2) formatted += `) ${p2}`;
      if (p3) formatted += `-${p3}`;
      return formatted;
    });
  } else {
    value = value.replace(/^(\d{2})(\d{0,5})(\d{0,4})/, (match, p1, p2, p3) => {
      let formatted = `(${p1}`;
      if (p2) formatted += `) ${p2}`;
      if (p3) formatted += `-${p3}`;
      return formatted;
    });
  }

  setFieldValue(`responsibles[${index}].phone`, value);
};

const ResponsibleContacts: React.FC<ResponsibleContactsProps> = ({
  setFieldValue,
}) => {
  return (
    <fieldset className={styles.section}>
      <legend className={styles.legend}>Responsáveis</legend>
      <FieldArray name="responsibles">
        {({ push, remove, form }) => (
          <div>
            {(form.values.responsibles ?? []).map(
              (responsible: any, index: number) => (
                <div key={index} className={styles.responsibleRow}>
                  <div className={styles.header}>
                    <strong>Responsável {index + 1}</strong>
                    <button
                      type="button"
                      className={styles.iconButtonRed}
                      onClick={() => remove(index)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>

                  <div className={styles.grid}>
                    <div className={styles.inputGroup}>
                      <label htmlFor={`responsibles[${index}].name`}>
                        Nome*
                      </label>
                      <Field
                        type="text"
                        name={`responsibles[${index}].name`}
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor={`responsibles[${index}].relation`}>
                        Relação*
                      </label>
                      <Field
                        type="text"
                        name={`responsibles[${index}].relation`}
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor={`responsibles[${index}].phone`}>
                        Telefone
                      </label>
                      <Field
                        type="text"
                        name={`responsibles[${index}].phone`}
                        className={styles.input}
                        onChange={(e: any) =>
                          handlePhoneInput(e, index, setFieldValue)
                        }
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor={`responsibles[${index}].email`}>
                        Email
                      </label>
                      <Field
                        type="text"
                        name={`responsibles[${index}].email`}
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor={`responsibles[${index}].profession`}>
                        Profissão
                      </label>
                      <Field
                        type="text"
                        name={`responsibles[${index}].profession`}
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor={`responsibles[${index}].idCard`}>
                        RG
                      </label>
                      <Field
                        type="text"
                        name={`responsibles[${index}].idCard`}
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor={`responsibles[${index}].cpfCnpj`}>
                        CPF/CNPJ
                      </label>
                      <Field
                        type="text"
                        name={`responsibles[${index}].cpfCnpj`}
                        className={styles.input}
                        onChange={(e: any) =>
                          handleCpfCnpjChange(e, index, setFieldValue)
                        }
                      />
                    </div>
                  </div>
                </div>
              )
            )}

            <button
              type="button"
              className={styles.addButton}
              onClick={() => {
                const lastResponsible =
                  form.values.responsibles[form.values.responsibles.length - 1];

                if (
                  !lastResponsible ||
                  (lastResponsible.name && lastResponsible.relation)
                ) {
                  push({
                    name: '',
                    relation: '',
                    phone: '',
                    email: '',
                    profession: '',
                    idCard: '',
                    cpfCnpj: '',
                  });
                } else {
                  toast.warn(
                    'Preencha os campos Nome e Relação antes de adicionar um novo responsável.'
                  );
                }
              }}
            >
              {form.values.responsibles.length === 0
                ? 'Adicionar Responsável'
                : 'Adicionar Outro Responsável'}
            </button>
          </div>
        )}
      </FieldArray>
    </fieldset>
  );
};

export default ResponsibleContacts;
