/** @format */

import React from 'react';
import styles from './FormAnamnesisResponses.module.css';
import { Field, ErrorMessage } from 'formik';
import { AnamnesisModelDto } from './FormAnamnesis';

interface FormAnamnesisResponsesProps {
  anamnesisModel: AnamnesisModelDto | null;
}

const FormAnamnesisResponses: React.FC<FormAnamnesisResponsesProps> = ({
  anamnesisModel,
}) => {
  return (
    <div className={styles.responsesContainer}>
      {!anamnesisModel || anamnesisModel.groups.length === 0 ? (
        <p className={styles.noQuestions}>Nenhuma pergunta disponível.</p>
      ) : (
        anamnesisModel.groups.map((group, groupIndex) => (
          <div key={group.id} className={styles.questionGroup}>
            <h3 className={styles.groupTitle}>{group.name}</h3>

            {group.questions
              .slice() // ✅ Create a shallow copy to avoid mutating the original array
              .sort((a, b) => a.order - b.order) // ✅ Sort by `order` in ascending order
              .map((question, questionIndex) => {
                const fieldName = `answers[${groupIndex}].questions[${questionIndex}].value`;

                return (
                  <div key={question.id} className={styles.question}>
                    <label className={styles.label}>
                      {question.text}{' '}
                      {question.required && (
                        <span className={styles.required}>*</span>
                      )}
                    </label>

                    {/* Handle different question types using Field */}
                    {question.type === 'text' && (
                      <Field
                        type="text"
                        name={fieldName}
                        className={styles.input}
                      />
                    )}

                    {question.type === 'number' && (
                      <Field
                        type="number"
                        name={fieldName}
                        className={styles.input}
                      />
                    )}

                    {question.type === 'date' && (
                      <Field
                        type="text"
                        name={fieldName}
                        placeholder="DD/MM/AAAA"
                        className={styles.input}
                      />
                    )}

                    {question.type === 'textarea' && (
                      <Field
                        as="textarea"
                        name={fieldName}
                        className={styles.textarea}
                      />
                    )}

                    {question.type === 'dropdown' && question.options && (
                      <Field
                        as="select"
                        name={fieldName}
                        className={styles.select}
                      >
                        <option value="">Selecione uma opção</option>
                        {question.options.map((option) => (
                          <option key={option.id} value={option.text}>
                            {option.text}
                          </option>
                        ))}
                      </Field>
                    )}

                    {question.type === 'yesno' && (
                      <div className={styles.radioGroup}>
                        <label className={styles.radioLabel}>
                          <Field
                            type="radio"
                            name={fieldName}
                            value="Sim"
                            className={styles.radio}
                          />
                          Sim
                        </label>
                        <label className={styles.radioLabel}>
                          <Field
                            type="radio"
                            name={fieldName}
                            value="Não"
                            className={styles.radio}
                          />
                          Não
                        </label>
                      </div>
                    )}

                    {question.type === 'multiple_choice' &&
                      question.options && (
                        <div className={styles.checkboxGroup}>
                          {question.options.map((option) => (
                            <label
                              key={option.id}
                              className={styles.checkboxLabel}
                            >
                              <Field
                                type="checkbox"
                                name={fieldName}
                                value={option.text}
                                className={styles.checkbox}
                              />
                              {option.text}
                            </label>
                          ))}
                        </div>
                      )}

                    <ErrorMessage
                      name={fieldName}
                      component="div"
                      className={styles.errorMessage}
                    />
                  </div>
                );
              })}
          </div>
        ))
      )}
    </div>
  );
};

export default FormAnamnesisResponses;
