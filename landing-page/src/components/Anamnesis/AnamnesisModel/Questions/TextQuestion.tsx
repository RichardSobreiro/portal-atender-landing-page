/** @format */

import React from 'react';
import styles from './TextQuestion.module.css';

interface TextQuestionProps {
  groupId: string;
  questionId: string;
  questionText: string;
  required: boolean;
  onUpdateQuestion: (
    groupId: string,
    questionId: string,
    field: string,
    value: any
  ) => void;
}

const TextQuestion: React.FC<TextQuestionProps> = ({
  groupId,
  questionId,
  questionText,
  required,
  onUpdateQuestion,
}) => {
  return (
    <div className={styles.textQuestionContainer}>
      <div className={styles.inputContainer}>
        {/* Question Text Input */}
        <input
          type="text"
          value={questionText}
          onChange={(e) =>
            onUpdateQuestion(groupId, questionId, 'text', e.target.value)
          }
          placeholder="Digite sua pergunta..."
          className={styles.input}
        />

        {/* Text Answer Preview */}
        <input
          type="text"
          placeholder="Resposta do usuário..."
          className={styles.answerPreview}
          disabled
        />
      </div>

      {/* Required Checkbox */}
      <div className={styles.requiredContainer}>
        <label className={styles.requiredLabel}>Obrigatório?</label>
        <input
          type="checkbox"
          checked={required}
          onChange={(e) =>
            onUpdateQuestion(groupId, questionId, 'required', e.target.checked)
          }
          className={styles.requiredCheckbox}
        />
      </div>
    </div>
  );
};

export default TextQuestion;
