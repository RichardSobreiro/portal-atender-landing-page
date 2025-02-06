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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFieldValue(
                            `responsaveis[${index}].name`,
                            e.target.value
                          )
                        }
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFieldValue(
                            `responsaveis[${index}].relation`,
                            e.target.value
                          )
                        }
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFieldValue(
                            `responsaveis[${index}].phone`,
                            e.target.value
                          )
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFieldValue(
                            `responsaveis[${index}].email`,
                            e.target.value
                          )
                        }
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFieldValue(
                            `responsaveis[${index}].profession`,
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor={`responsaveis[${index}].rg`}>RG</label>
                      <Field
                        type="text"
                        name={`responsaveis[${index}].rg`}
                        className={styles.input}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFieldValue(
                            `responsaveis[${index}].rg`,
                            e.target.value
                          )
                        }
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFieldValue(
                            `responsaveis[${index}].cpfCnpj`,
                            e.target.value
                          )
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
