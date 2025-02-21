/** @format */

import React from 'react';
import styles from './DeleteConfirmationModal.module.css';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  procedureName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  procedureName,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null; // ✅ Don't render if modal is closed

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Confirmação</h2>
        <p className={styles.message}>
          Você tem certeza que deseja excluir o procedimento{' '}
          <strong>{procedureName}</strong>?
        </p>
        <div className={styles.buttonContainer}>
          <button className={styles.confirmButton} onClick={onConfirm}>
            Sim
          </button>
          <button className={styles.cancelButton} onClick={onCancel}>
            Não
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
