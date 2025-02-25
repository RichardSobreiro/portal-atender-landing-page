/** @format */

import React from 'react';
import styles from './Questions.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import YesNoQuestion from '../Questions/YesNoQuestion';

interface Question {
  id: string;
  type: string;
  text: string;
  required: boolean;
  order: number;
  options?: { id: string; text: string }[];
}

interface QuestionsProps {
  groupId: string;
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  onUpdateQuestion: (
    groupId: string,
    questionId: string,
    field: string,
    value: any
  ) => void;
  onDeleteQuestion: (groupId: string, questionId: string) => void;
  onReorderQuestions: (
    groupId: string,
    startIndex: number,
    endIndex: number
  ) => void;
}

const questionTypes = [
  { label: 'Sim/Não', value: 'yesno' },
  { label: 'Texto', value: 'text' },
  { label: 'Número Inteiro', value: 'number' },
  { label: 'Múltipla Escolha', value: 'multiple_choice' },
  { label: 'Dropdown', value: 'dropdown' },
];

const Questions: React.FC<QuestionsProps> = ({
  groupId,
  question,
  questionIndex,
  totalQuestions,
  onUpdateQuestion,
  onDeleteQuestion,
  onReorderQuestions,
}) => {
  return (
    <div className={styles.questionContainer}>
      {/* Drag Handle */}
      <div className={styles.dragHandle} onMouseDown={() => {}}>
        <FontAwesomeIcon icon={faGripVertical} />
      </div>

      {/* Question Type Selection */}
      <select
        value={question.type}
        onChange={(e) =>
          onUpdateQuestion(groupId, question.id, 'type', e.target.value)
        }
        className={styles.questionTypeSelect}
      >
        {questionTypes.map((q) => (
          <option key={q.value} value={q.value}>
            {q.label}
          </option>
        ))}
      </select>

      {/* Render the Correct Question Type Component */}
      {question.type === 'yesno' && (
        <YesNoQuestion
          groupId={groupId}
          questionId={question.id}
          questionText={question.text}
          required={question.required}
          onUpdateQuestion={onUpdateQuestion}
        />
      )}

      {/* Delete Question Button */}
      <button
        className={styles.deleteButton}
        onClick={() => onDeleteQuestion(groupId, question.id)}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
};

export default Questions;
