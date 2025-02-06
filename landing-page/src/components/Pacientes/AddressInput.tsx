/** @format */

import React from 'react';
import { FieldArray, Field } from 'formik';
import styles from './AddressInput.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

interface AddressInputProps {
  name: string;
  label: string;
  setFieldValue: (field: string, value: any) => void;
}

const AddressInput: React.FC<AddressInputProps> = ({
  name,
  label,
  setFieldValue,
}) => {
  const fetchAddress = async (cep: string, index: number) => {
    if (cep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setFieldValue(`${name}[${index}].rua`, data.logradouro);
        setFieldValue(`${name}[${index}].bairro`, data.bairro);
        setFieldValue(`${name}[${index}].cidade`, data.localidade);
        setFieldValue(`${name}[${index}].estado`, data.uf);
        setFieldValue(`${name}[${index}].pais`, 'Brasil');
      }
    } catch (error) {
      console.error('Erro ao buscar o endereço', error);
    }
  };

  return (
    <fieldset className={styles.section}>
      <legend className={styles.legend}>{label}</legend>
      <FieldArray name={name}>
        {({ push, remove, form }) => (
          <div className={styles.addressContainer}>
            {(form.values[name] ?? []).map((address: any, index: number) => (
              <div key={index} className={styles.addressRow}>
                <div className={styles.header}>
                  <strong>Endereço {index + 1}</strong>
                  <div className={styles.actionIcons}>
                    <button
                      type="button"
                      className={`${styles.iconButton} ${address.favorito ? styles.favorite : ''}`}
                      onClick={() =>
                        setFieldValue(
                          name,
                          form.values[name].map((item: any, i: number) =>
                            i === index
                              ? { ...item, favorito: !item.favorito }
                              : { ...item, favorito: false }
                          )
                        )
                      }
                    >
                      <FontAwesomeIcon icon={faStar} />
                    </button>
                    <button
                      type="button"
                      className={styles.iconButtonRed}
                      onClick={() => remove(index)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                </div>

                <div className={styles.grid}>
                  <Field
                    as="select"
                    name={`${name}[${index}].tipo`}
                    className={styles.input}
                  >
                    <option value="Residencial">Residencial</option>
                    <option value="Comercial">Comercial</option>
                  </Field>

                  <Field
                    type="text"
                    name={`${name}[${index}].cep`}
                    className={styles.input}
                    placeholder="CEP"
                    onBlur={(e: any) => fetchAddress(e.target.value, index)}
                  />

                  <Field
                    type="text"
                    name={`${name}[${index}].rua`}
                    className={styles.input}
                    placeholder="Rua"
                  />
                  <Field
                    type="text"
                    name={`${name}[${index}].numero`}
                    className={styles.input}
                    placeholder="Número"
                  />
                  <Field
                    type="text"
                    name={`${name}[${index}].complemento`}
                    className={styles.input}
                    placeholder="Complemento"
                  />
                  <Field
                    type="text"
                    name={`${name}[${index}].bairro`}
                    className={styles.input}
                    placeholder="Bairro"
                  />
                  <Field
                    type="text"
                    name={`${name}[${index}].cidade`}
                    className={styles.input}
                    placeholder="Cidade"
                  />
                  <Field
                    type="text"
                    name={`${name}[${index}].estado`}
                    className={styles.input}
                    placeholder="Estado"
                  />
                  <Field
                    type="text"
                    name={`${name}[${index}].pais`}
                    className={styles.input}
                    placeholder="País"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              className={styles.addButton}
              onClick={() => {
                const lastAddress =
                  form.values[name]?.[form.values[name].length - 1];
                if (!lastAddress || (lastAddress.cep && lastAddress.rua)) {
                  push({ tipo: '', cep: '', favorito: false });
                } else {
                  toast.warn(
                    'Preencha o CEP e a Rua antes de adicionar um novo endereço.'
                  );
                }
              }}
            >
              {form.values[name] && form.values[name].length === 0
                ? `Adicionar ${label}`
                : `Adicionar Outros ${label}`}
            </button>
          </div>
        )}
      </FieldArray>
    </fieldset>
  );
};

export default AddressInput;
