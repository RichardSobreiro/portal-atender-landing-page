import React from 'react';
import styles from './TextAreaQuestion.module.css';

interface TextAreaQuestionProps {
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

const TextAreaQuestion: React.FC<TextAreaQuestionProps> = ({
  groupId,
  questionId,
  questionText,
  required,
  onUpdateQuestion,
}) => {
  return (
    <div className={styles.textAreaContainer}>
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

      {/* Textarea Input */}
      <textarea
        className={styles.textAreaInput}
        placeholder="Resposta..."
        rows={5} // Ensure at least 5 lines by default
        disabled
      ></textarea>

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

export default TextAreaQuestion;
