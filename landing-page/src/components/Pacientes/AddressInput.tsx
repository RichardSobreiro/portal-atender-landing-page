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
        setFieldValue(`${name}[${index}].street`, data.logradouro);
        setFieldValue(`${name}[${index}].neighborhood`, data.bairro);
        setFieldValue(`${name}[${index}].city`, data.localidade);
        setFieldValue(`${name}[${index}].state`, data.uf);
        setFieldValue(`${name}[${index}].country`, 'Brasil');
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
                      className={`${styles.iconButton} ${address.favorite ? styles.favorite : ''}`}
                      onClick={() =>
                        setFieldValue(
                          name,
                          form.values[name].map((item: any, i: number) =>
                            i === index
                              ? { ...item, favorite: !item.favorite }
                              : { ...item, favorite: false }
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
                    name={`${name}[${index}].type`}
                    className={styles.input}
                  >
                    <option value="Residencial">Residencial</option>
                    <option value="Comercial">Comercial</option>
                  </Field>

                  <Field
                    type="text"
                    name={`${name}[${index}].postalCode`}
                    className={styles.input}
                    placeholder="CEP"
                    onBlur={(e: any) => fetchAddress(e.target.value, index)}
                  />

                  <Field
                    type="text"
                    name={`${name}[${index}].street`}
                    className={styles.input}
                    placeholder="Rua"
                  />
                  <Field
                    type="text"
                    name={`${name}[${index}].number`}
                    className={styles.input}
                    placeholder="Número"
                  />
                  <Field
                    type="text"
                    name={`${name}[${index}].complement`}
                    className={styles.input}
                    placeholder="Complemento"
                  />
                  <Field
                    type="text"
                    name={`${name}[${index}].neighborhood`}
                    className={styles.input}
                    placeholder="Bairro"
                  />
                  <Field
                    type="text"
                    name={`${name}[${index}].city`}
                    className={styles.input}
                    placeholder="Cidade"
                  />
                  <Field
                    type="text"
                    name={`${name}[${index}].state`}
                    className={styles.input}
                    placeholder="Estado"
                  />
                  <Field
                    type="text"
                    name={`${name}[${index}].country`}
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
                if (
                  !lastAddress ||
                  (lastAddress.postalCode && lastAddress.street)
                ) {
                  push({
                    type: 'Residencial',
                    postalCode: '',
                    favorite: false,
                  });
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
