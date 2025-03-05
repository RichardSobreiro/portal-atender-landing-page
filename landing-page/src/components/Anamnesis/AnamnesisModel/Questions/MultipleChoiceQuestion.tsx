/** @format */

import React from 'react';
import styles from './MultipleChoiceQuestion.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

interface MultipleChoiceQuestionProps {
  groupId: string;
  questionId: string;
  questionText: string;
  required: boolean;
  options: { id: string; text: string }[];
  onUpdateQuestion: (
    groupId: string,
    questionId: string,
    field: string,
    value: any
  ) => void;
  onUpdateOption: (
    groupId: string,
    questionId: string,
    optionId: string,
    newText: string
  ) => void;
  onAddOption: (groupId: string, questionId: string) => void;
  onRemoveOption: (
    groupId: string,
    questionId: string,
    optionId: string
  ) => void;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  groupId,
  questionId,
  questionText,
  required,
  options,
  onUpdateQuestion,
  onUpdateOption,
  onAddOption,
  onRemoveOption,
}) => {
  return (
    <div className={styles.multipleChoiceContainer}>
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
      </div>

      {/* Options Section */}
      <div className={styles.optionsContainer}>
        {options.map((option) => (
          <div key={option.id} className={styles.optionRow}>
            <input
              type="text"
              value={option.text}
              onChange={(e) =>
                onUpdateOption(groupId, questionId, option.id, e.target.value)
              }
              placeholder="Opção de resposta..."
              className={styles.optionInput}
            />
            <button
              type="button"
              className={styles.deleteOptionButton}
              onClick={() => onRemoveOption(groupId, questionId, option.id)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ))}

        {/* Add Option Button */}
        <button
          type="button"
          className={styles.addOptionButton}
          onClick={() => onAddOption(groupId, questionId)}
        >
          <FontAwesomeIcon icon={faPlus} /> Adicionar Opção
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

export default MultipleChoiceQuestion;
