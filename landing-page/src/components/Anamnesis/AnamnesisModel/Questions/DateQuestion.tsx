import React from 'react';
import styles from './DateQuestion.module.css';

interface DateQuestionProps {
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

const DateQuestion: React.FC<DateQuestionProps> = ({
  groupId,
  questionId,
  questionText,
  required,
  onUpdateQuestion,
}) => {
  // Handle input change with Brazilian date format
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters

    if (value.length > 8) value = value.slice(0, 8);

    // Format as DD/MM/YYYY
    if (value.length >= 2) value = value.replace(/^(\d{2})/, '$1/');
    if (value.length >= 5) value = value.replace(/^(\d{2})\/(\d{2})/, '$1/$2/');

    onUpdateQuestion(groupId, questionId, 'text', value);
  };

  return (
    <div className={styles.dateContainer}>
      {/* Question Text */}
      <input
        type="text"
        value={questionText}
        onChange={(e) =>
          onUpdateQuestion(groupId, questionId, 'text', e.target.value)
        }
        placeholder="Digite sua pergunta..."
        className={styles.input}
      />

      {/* Date Input Field */}
      <input
        type="text"
        placeholder="DD/MM/AAAA"
        className={styles.dateInput}
        onChange={handleDateChange}
        maxLength={10} // Limit input length
        disabled
      />

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

export default DateQuestion;
