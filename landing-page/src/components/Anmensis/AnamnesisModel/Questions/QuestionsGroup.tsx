/** @format */

import React from 'react';
import styles from './QuestionsGroup.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Questions from './Questions';

interface Question {
  id: string;
  type: string;
  text: string;
  required: boolean;
  order: number;
  options?: { id: string; text: string }[];
}

interface QuestionsGroupProps {
  groupId: string;
  name: string;
  questions: Question[];
  onUpdateGroupName: (groupId: string, newName: string) => void;
  onAddQuestion: (groupId: string) => void;
  onDeleteGroup: (groupId: string) => void;
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

const QuestionsGroup: React.FC<QuestionsGroupProps> = ({
  groupId,
  name,
  questions,
  onUpdateGroupName,
  onAddQuestion,
  onDeleteGroup,
  onUpdateQuestion,
  onDeleteQuestion,
  onReorderQuestions,
}) => {
  return (
    <div className={styles.groupContainer}>
      {/* Group Header */}
      <div className={styles.groupHeader}>
        <input
          type="text"
          value={name}
          onChange={(e) => onUpdateGroupName(groupId, e.target.value)}
          placeholder="Nome do Grupo de Perguntas"
          className={styles.groupNameInput}
        />
        <button
          className={styles.deleteGroupButton}
          onClick={() => onDeleteGroup(groupId)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>

      {/* Questions List */}
      <div className={styles.questionsList}>
        {questions
          .sort((a, b) => a.order - b.order) // Ensure order consistency
          .map((question, index) => (
            <Questions
              key={question.id}
              groupId={groupId}
              question={question}
              onUpdateQuestion={onUpdateQuestion}
              onDeleteQuestion={onDeleteQuestion}
              onReorderQuestions={onReorderQuestions}
              questionIndex={index}
              totalQuestions={questions.length}
            />
          ))}
      </div>

      {/* Add Question Button */}
      <button
        className={styles.addQuestionButton}
        onClick={() => onAddQuestion(groupId)}
      >
        + Adicionar Pergunta
      </button>
    </div>
  );
};

export default QuestionsGroup;
