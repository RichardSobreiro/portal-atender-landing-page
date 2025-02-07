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
  setFieldValue(`responsaveis[${index}].cpfCnpj`, formatCpfCnpj(value));
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
    setFieldValue(`responsaveis[${index}].phone`, '');
    return;
  }

  // Prevent forcing a space if the user is deleting
  if (value.length < 2) {
    setFieldValue(`responsaveis[${index}].phone`, `(${value}`);
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

  setFieldValue(`responsaveis[${index}].phone`, value);
};

const ResponsibleContacts: React.FC<ResponsibleContactsProps> = ({
  setFieldValue,
}) => {
  return (
    <fieldset className={styles.section}>
      <legend className={styles.legend}>Responsáveis</legend>
      <FieldArray name="responsaveis">
        {({ push, remove, form }) => (
          <div>
            {(form.values.responsaveis ?? []).map(
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
                      <label htmlFor={`responsaveis[${index}].name`}>
                        Nome*
                      </label>
                      <Field
                        type="text"
                        name={`responsaveis[${index}].name`}
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor={`responsaveis[${index}].relation`}>
                        Relação*
                      </label>
                      <Field
                        type="text"
                        name={`responsaveis[${index}].relation`}
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor={`responsaveis[${index}].phone`}>
                        Telefone
                      </label>
                      <Field
                        type="text"
                        name={`responsaveis[${index}].phone`}
                        className={styles.input}
                        onChange={(e: any) =>
                          handlePhoneInput(e, index, setFieldValue)
                        }
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor={`responsaveis[${index}].email`}>
                        Email
                      </label>
                      <Field
                        type="text"
                        name={`responsaveis[${index}].email`}
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor={`responsaveis[${index}].profession`}>
                        Profissão
                      </label>
                      <Field
                        type="text"
                        name={`responsaveis[${index}].profession`}
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor={`responsaveis[${index}].rg`}>RG</label>
                      <Field
                        type="text"
                        name={`responsaveis[${index}].rg`}
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor={`responsaveis[${index}].cpfCnpj`}>
                        CPF/CNPJ
                      </label>
                      <Field
                        type="text"
                        name={`responsaveis[${index}].cpfCnpj`}
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
                  form.values.responsaveis[form.values.responsaveis.length - 1];

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
                    rg: '',
                    cpfCnpj: '',
                  });
                } else {
                  toast.warn(
                    'Preencha os campos Nome e Relação antes de adicionar um novo responsável.'
                  );
                }
              }}
            >
              {form.values.responsaveis.length === 0
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
