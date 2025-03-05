/** @format */

import React, { useEffect, useState, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './FormAnamnesisModel.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faPlus } from '@fortawesome/free-solid-svg-icons';
import QuestionsGroup from './Questions/QuestionsGroup';

interface Question {
  id: string;
  type: string;
  text: string;
  required: boolean;
  order: number;
  options?: { id: string; text: string }[];
}

interface QuestionGroup {
  id: string;
  name: string;
  questions: Question[];
}

interface FormAnamnesisModelProps {
  initialValues: { name: string; type: string };
  anamnesisForm: { name: string; type: string; groups: QuestionGroup[] };
  setAnamnesisForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      type: string;
      companyId: string | null | undefined;
      groups: QuestionGroup[];
    }>
  >;
  handleSubmit: (values: { name: string; type: string }) => Promise<void>;
}

const FormAnamnesisModel: React.FC<FormAnamnesisModelProps> = ({
  initialValues,
  anamnesisForm,
  setAnamnesisForm,
  handleSubmit,
}) => {
  const validationSchema = Yup.object({
    name: Yup.string().required('Nome é obrigatório'),
    type: Yup.string().required('Tipo é obrigatório'),
  });

  // Add a New Group
  const addGroup = () => {
    setAnamnesisForm((prev) => ({
      ...prev,
      groups: [
        ...prev.groups,
        {
          id: crypto.randomUUID(),
          name: '',
          questions: [],
        },
      ],
    }));
  };

  // Update Group Name
  const updateGroupName = (groupId: string, newName: string) => {
    setAnamnesisForm((prev) => ({
      ...prev,
      groups: prev.groups.map((group) =>
        group.id === groupId ? { ...group, name: newName } : group
      ),
    }));
  };

  // Delete a Group
  const deleteGroup = (groupId: string) => {
    setAnamnesisForm((prev) => ({
      ...prev,
      groups: prev.groups.filter((group) => group.id !== groupId),
    }));
  };

  // Add a Question to a Group
  const addQuestion = (groupId: string) => {
    setAnamnesisForm((prev) => ({
      ...prev,
      groups: prev.groups.map((group) => {
        if (group.id !== groupId) return group;

        const newQuestion = {
          id: crypto.randomUUID(),
          type: 'text',
          text: '',
          required: false,
          order: group.questions.length + 1,
        };

        return { ...group, questions: [...group.questions, newQuestion] };
      }),
    }));
  };

  // Update a Question Property
  const updateQuestion = (
    groupId: string,
    questionId: string,
    field: string,
    value: any
  ) => {
    setAnamnesisForm((prev) => ({
      ...prev,
      groups: prev.groups.map((group) => {
        if (group.id !== groupId) return group;

        return {
          ...group,
          questions: group.questions.map((question) =>
            question.id === questionId
              ? { ...question, [field]: value }
              : question
          ),
        };
      }),
    }));
  };

  // Delete a Question from a Group
  const deleteQuestion = (groupId: string, questionId: string) => {
    setAnamnesisForm((prev) => ({
      ...prev,
      groups: prev.groups.map((group) => {
        if (group.id !== groupId) return group;

        const updatedQuestions = group.questions.filter(
          (q) => q.id !== questionId
        );

        const reorderedQuestions = updatedQuestions.map((q, index) => ({
          ...q,
          order: index + 1,
        }));

        return { ...group, questions: reorderedQuestions };
      }),
    }));
  };

  // Reorder Questions Inside a Group
  const reorderQuestions = (
    groupId: string,
    startIndex: number,
    endIndex: number
  ) => {
    setAnamnesisForm((prev) => ({
      ...prev,
      groups: prev.groups.map((group) => {
        if (group.id !== groupId) return group;

        const updatedQuestions = [...group.questions];
        const [movedItem] = updatedQuestions.splice(startIndex, 1);
        updatedQuestions.splice(endIndex, 0, movedItem);

        // Update order explicitly
        const reorderedQuestions = updatedQuestions.map((q, index) => ({
          ...q,
          order: index + 1,
        }));

        return { ...group, questions: reorderedQuestions };
      }),
    }));
  };

  const addOption = (groupId: string, questionId: string) => {
    setAnamnesisForm((prev) => ({
      ...prev,
      groups: prev.groups.map((group) => {
        if (group.id !== groupId) return group;

        return {
          ...group,
          questions: group.questions.map((question) => {
            if (question.id !== questionId) return question;

            const newOption = {
              id: crypto.randomUUID(),
              text: '',
            };

            return {
              ...question,
              options: [...(question.options || []), newOption],
            };
          }),
        };
      }),
    }));
  };

  // Update an option text
  const updateOption = (
    groupId: string,
    questionId: string,
    optionId: string,
    newText: string
  ) => {
    setAnamnesisForm((prev) => ({
      ...prev,
      groups: prev.groups.map((group) => {
        if (group.id !== groupId) return group;

        return {
          ...group,
          questions: group.questions.map((question) => {
            if (question.id !== questionId) return question;

            return {
              ...question,
              options: question.options?.map((option) =>
                option.id === optionId ? { ...option, text: newText } : option
              ),
            };
          }),
        };
      }),
    }));
  };

  // Remove an option from a multiple-choice question
  const removeOption = (
    groupId: string,
    questionId: string,
    optionId: string
  ) => {
    setAnamnesisForm((prev) => ({
      ...prev,
      groups: prev.groups.map((group) => {
        if (group.id !== groupId) return group;

        return {
          ...group,
          questions: group.questions.map((question) => {
            if (question.id !== questionId) return question;

            return {
              ...question,
              options: question.options?.filter(
                (option) => option.id !== optionId
              ),
            };
          }),
        };
      }),
    }));
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form id="anamnesisModelForm" className={styles.formContainer}>
          <div className={styles.inputRow}>
            <div className={`${styles.inputGroup} ${styles.nameInput}`}>
              <label className={styles.label}>Nome do Modelo *</label>
              <Field type="text" name="name" className={styles.input} />
              <ErrorMessage
                name="name"
                component="div"
                className={styles.errorMessage}
              />
            </div>

            <div className={`${styles.inputGroup} ${styles.typeInput}`}>
              <label className={styles.label}>Tipo *</label>
              <Field as="select" name="type" className={styles.inputSelect}>
                <option value="">Selecione um tipo</option>
                <option value="Geral">Geral</option>
                <option value="Facial">Facial</option>
                <option value="Corporal">Corporal</option>
                <option value="Capilar">Capilar</option>
              </Field>
              <ErrorMessage
                name="type"
                component="div"
                className={styles.errorMessage}
              />
            </div>
          </div>

          {/* Question Groups */}
          {anamnesisForm.groups.map((group) => (
            <QuestionsGroup
              key={group.id}
              groupId={group.id}
              name={group.name}
              questions={group.questions}
              onUpdateGroupName={updateGroupName}
              onAddQuestion={addQuestion}
              onDeleteGroup={deleteGroup}
              onUpdateQuestion={updateQuestion}
              onDeleteQuestion={deleteQuestion}
              onReorderQuestions={reorderQuestions}
              onAddOption={addOption}
              onUpdateOption={updateOption}
              onRemoveOption={removeOption}
            />
          ))}

          <div className={styles.addGroupButtonContainer}>
            <button
              type="button"
              className={styles.addGroupButton}
              onClick={addGroup}
            >
              <FontAwesomeIcon icon={faPlus} className={styles.icon} />
              Adicionar Grupo
            </button>
          </div>

          <div className={styles.saveButtonFloatingContainer}>
            <button
              id="saveButtonFloating"
              type="submit"
              form="anamnesisModelForm"
              className={styles.saveButtonFloating}
              disabled={isSubmitting}
            >
              <FontAwesomeIcon icon={faSave} className={styles.icon} />
              Salvar
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FormAnamnesisModel;
