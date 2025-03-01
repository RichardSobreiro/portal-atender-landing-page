/** @format */

import React, { useState } from 'react';
import styles from './Questions.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import YesNoQuestion from '../Questions/YesNoQuestion';
import TextQuestion from '../Questions/TextQuestion';
import NumberQuestion from '../Questions/NumberQuestion';
import MultipleChoiceQuestion from '../Questions/MultipleChoiceQuestion';
import DropdownQuestion from '../Questions/DropdownQuestion';
import DeleteConfirmationModal from '@/general/DeleteConfirmationModal';
import DateQuestion from './DateQuestion';
import TextAreaQuestion from './TextAreaQuestion';

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
  onUpdateQuestion: (
    groupId: string,
    questionId: string,
    field: string,
    value: any
  ) => void;
  onDeleteQuestion: (groupId: string, questionId: string) => void;
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
  { label: 'Opções', value: 'dropdown' },
  { label: 'Data', value: 'date' },
  { label: 'Texto Longo', value: 'textarea' },
];

const Questions: React.FC<QuestionsProps> = ({
  groupId,
  question,
  onUpdateQuestion,
  onDeleteQuestion,
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

      {question.type === 'dropdown' && (
        <DropdownQuestion
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

      {question.type === 'date' && (
        <DateQuestion
          groupId={groupId}
          questionId={question.id}
          questionText={question.text}
          required={question.required}
          onUpdateQuestion={onUpdateQuestion}
        />
      )}

      {question.type === 'textarea' && (
        <TextAreaQuestion
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
        onClick={() => setIsDeleteModalOpen(true)}
        type="button"
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
