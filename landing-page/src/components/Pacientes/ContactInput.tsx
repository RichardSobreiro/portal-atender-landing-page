/** @format */

import React, { useState } from 'react';
import { FieldArray, Field, ErrorMessage } from 'formik';
import styles from './ContactInput.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTimes } from '@fortawesome/free-solid-svg-icons';

interface ContactInputProps {
  name: string;
  label: string;
  options: string[];
  setFieldValue: (field: string, value: any) => void;
}

const ContactInput: React.FC<ContactInputProps> = ({
  name,
  label,
  options,
  setFieldValue,
}) => {
  const handlePhoneInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove all non-numeric characters

    // Enforce 11-digit limit
    value = value.slice(0, 11);

    // Allow full deletion (fixes the issue where the space remains)
    if (value.length === 0) {
      setFieldValue(`${name}[${index}].number`, '');
      return;
    }

    // Prevent forcing a space if the user is deleting
    if (value.length < 2) {
      setFieldValue(`${name}[${index}].number`, `(${value}`);
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

    setFieldValue(`${name}[${index}].number`, value);
  };

  return (
    <div className={styles.contactContainer}>
      <fieldset className={styles.section}>
        <legend className={styles.legend}>{label}</legend>
        <FieldArray name={name}>
          {({ push, remove, form }) => (
            <div>
              {(form.values[name] ?? []).map((contact: any, index: number) => (
                <div key={index} className={styles.contactRow}>
                  {/* Select and Input Row */}
                  <div className={styles.inputGroup}>
                    <Field
                      as="select"
                      name={`${name}[${index}].type`}
                      className={styles.select}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFieldValue(`${name}[${index}].type`, e.target.value)
                      }
                    >
                      {options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Field>

                    <div className={styles.inputContainer}>
                      <Field
                        type="text"
                        name={
                          name === 'phones'
                            ? `${name}[${index}].number`
                            : `${name}[${index}].address`
                        }
                        className={styles.input}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          name === 'phones'
                            ? handlePhoneInput(e, index)
                            : setFieldValue(
                                `${name}[${index}].address`,
                                e.target.value
                              )
                        }
                      />
                      <ErrorMessage
                        name={
                          name === 'phones'
                            ? `${name}[${index}].number`
                            : `${name}[${index}].address`
                        }
                        component="div"
                        className={styles.errorMessage}
                      />
                    </div>
                  </div>

                  {/* Icons Row */}
                  <div className={styles.iconContainer}>
                    <button
                      type="button"
                      className={`${styles.iconButton} ${
                        contact.favorite ? styles.favorite : ''
                      }`}
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
                      className={`${styles.iconButton} ${styles.removeIcon}`}
                      onClick={() => remove(index)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className={styles.addButton}
                onClick={() => push({ type: '', valor: '', favorite: false })}
              >
                {form.values[name].length === 0
                  ? `Adicionar ${label}`
                  : `Adicionar Outros ${label}`}
              </button>
            </div>
          )}
        </FieldArray>
      </fieldset>
    </div>
  );
};

export default ContactInput;
