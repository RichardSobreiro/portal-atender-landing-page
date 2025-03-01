/** @format */

import React from 'react';
import styles from './QuestionsGroup.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Questions from './Questions';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

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
  onAddOption,
  onUpdateOption,
  onRemoveOption,
}) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return; // If dropped outside the list, do nothing
    onReorderQuestions(groupId, result.source.index, result.destination.index);
  };

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

      {/* Questions List with Drag & Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={groupId}>
          {(provided: any) => (
            <div
              className={styles.questionsList}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {questions
                .sort((a, b) => a.order - b.order) // Ensure order consistency
                .map((question, index) => (
                  <Draggable
                    key={question.id}
                    draggableId={question.id}
                    index={index}
                  >
                    {(provided: any) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Questions
                          groupId={groupId}
                          question={question}
                          onUpdateQuestion={onUpdateQuestion}
                          onDeleteQuestion={onDeleteQuestion}
                          onAddOption={onAddOption}
                          onUpdateOption={onUpdateOption}
                          onRemoveOption={onRemoveOption}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className={styles.addQuestionButtonContainer}>
        {/* Add Question Button */}
        <button
          className={styles.addQuestionButton}
          onClick={() => onAddQuestion(groupId)}
          type="button"
        >
          + Adicionar Pergunta
        </button>
      </div>
    </div>
  );
};

export default QuestionsGroup;
