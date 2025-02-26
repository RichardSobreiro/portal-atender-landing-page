/** @format */

import React, { useState } from 'react';
import styles from './Questions.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import YesNoQuestion from '../Questions/YesNoQuestion';
import TextQuestion from '../Questions/TextQuestion';
import NumberQuestion from '../Questions/NumberQuestion';
import MultipleChoiceQuestion from '../Questions/MultipleChoiceQuestion';
import DeleteConfirmationModal from '@/general/DeleteConfirmationModal';

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
  onAddOption: (groupId: string, questionId: string) => void;
  onUpdateOption: (
    groupId: string,
    questionId: string,
    optionId: string,
    newText: string
  ) => void;
  onRemoveOption: (
    groupId: string,
    questionId: string,
    optionId: string
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
  onUpdateOption,
  onAddOption,
  onRemoveOption,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <div className={styles.questionContainer}>
      <div className={styles.questionTypeSelectContainer}>
        {/* Drag Handle */}
        <div className={styles.dragHandle}>
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
      </div>

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

      {question.type === 'text' && (
        <TextQuestion
          groupId={groupId}
          questionId={question.id}
          questionText={question.text}
          required={question.required}
          onUpdateQuestion={onUpdateQuestion}
        />
      )}

      {question.type === 'number' && (
        <NumberQuestion
          groupId={groupId}
          questionId={question.id}
          questionText={question.text}
          required={question.required}
          onUpdateQuestion={onUpdateQuestion}
        />
      )}

      {question.type === 'multiple_choice' && (
        <MultipleChoiceQuestion
          groupId={groupId}
          questionId={question.id}
          questionText={question.text}
          required={question.required}
          options={question.options || []}
          onUpdateQuestion={onUpdateQuestion}
          onUpdateOption={onUpdateOption!}
          onAddOption={onAddOption!}
          onRemoveOption={onRemoveOption!}
        />
      )}

      {/* Delete Question Button */}
      <button
        className={styles.deleteButton}
        onClick={() => setIsDeleteModalOpen(true)}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        procedureName={'esta pergunta'}
        onConfirm={() => {
          onDeleteQuestion(groupId, question.id);
          setIsDeleteModalOpen(false);
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Questions;
