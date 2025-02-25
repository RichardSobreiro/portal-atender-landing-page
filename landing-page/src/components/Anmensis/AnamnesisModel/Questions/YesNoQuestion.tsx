/** @format */

import React from 'react';
import styles from './YesNoQuestion.module.css';

interface YesNoQuestionProps {
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

const YesNoQuestion: React.FC<YesNoQuestionProps> = ({
  groupId,
  questionId,
  questionText,
  required,
  onUpdateQuestion,
}) => {
  return (
    <div className={styles.yesNoContainer}>
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

      {/* Yes/No Buttons (Preview Only) */}
      <div className={styles.buttonGroup}>
        <button type="button" className={styles.yesButton}>
          Sim
        </button>
        <button type="button" className={styles.noButton}>
          Não
        </button>
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

export default YesNoQuestion;
