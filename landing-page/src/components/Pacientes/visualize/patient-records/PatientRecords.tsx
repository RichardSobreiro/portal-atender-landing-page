/** @format */
import React, { useEffect, useRef, useState } from 'react';
import styles from './PatientRecords.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import RichTextEditorComponent, {
  RichTextEditorRef,
} from '@/general/RichText/RichTextEditorComponent';
import { Button } from '@mantine/core';
import { toast } from 'react-toastify';
import { useSpinner } from '@/context/SpinnerContext';
import axiosInstance from '@/services/axiosInstance';

interface PatientRecordsProps {
  patientId: string | undefined;
}

interface PatientRecordDto {
  id: string;
  content: string;
  createdAt: string;
}

const PatientRecords: React.FC<PatientRecordsProps> = ({ patientId }) => {
  const [editorContent, setEditorContent] = useState('');
  const [patientRecords, setPatientRecords] = useState<PatientRecordDto[]>([]);
  const { showSpinner, hideSpinner } = useSpinner();
  const editorRef = useRef<RichTextEditorRef>(null);

  // Fetch patient records
  const fetchPatientRecords = async () => {
    if (!patientId) return;
    showSpinner();
    try {
      const response = await axiosInstance.get<PatientRecordDto[]>(
        `/patient-records/${patientId}`
      );
      const sortedRecords = response.data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setPatientRecords(sortedRecords);
    } catch (error: any) {
      toast.error('Erro ao carregar os registros do paciente.');
    } finally {
      hideSpinner();
    }
  };

  useEffect(() => {
    fetchPatientRecords();
  }, [patientId]);

  const handleContentChange = (content: string) => {
    setEditorContent(content);
  };

  const isContentEmpty = (content: string) => {
    const strippedContent = content.replace(/<[^>]*>/g, '').trim();
    return strippedContent.length === 0;
  };

  const handleSave = async () => {
    if (isContentEmpty(editorContent)) {
      toast.error('O conteúdo da anotação não pode estar vazio.');
      return;
    }

    showSpinner();
    try {
      const payload = {
        patientId,
        content: editorContent.trim(),
      };

      await axiosInstance.post('/patient-records', payload);
      toast.success('Prontuário do paciente salvo com sucesso!');
      editorRef.current?.clearContent();
      setEditorContent('');
      fetchPatientRecords();
    } catch (error: any) {
      const errorMessages = error.response?.data?.message;
      if (Array.isArray(errorMessages)) {
        errorMessages.forEach((msg) => toast.error(msg));
      } else {
        toast.error(errorMessages || 'Ocorreu um erro ao salvar o registro.');
      }
    } finally {
      hideSpinner();
    }
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString(
      'pt-BR',
      {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }
    )}`;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.notesTitle}>
        <FontAwesomeIcon icon={faFileAlt} className={styles.icon} />
        Adicionar anotação
      </h2>
      <p className={styles.description}>
        Adicionar uma anotação ao prontuário do cliente. Não será possível
        editar as informações posteriormente.
      </p>

      {/* Rich Text Editor */}
      <RichTextEditorComponent
        ref={editorRef}
        initialContent={editorContent}
        onContentChange={handleContentChange}
      />

      {/* Save Button */}
      <div className={styles.buttonContainer}>
        <Button
          className={styles.saveButton}
          disabled={isContentEmpty(editorContent)}
          onClick={handleSave}
        >
          Salvar
        </Button>
      </div>

      {/* Render saved patient records */}
      <div className={styles.recordsContainer}>
        {patientRecords.map((record) => (
          <div key={record.id} className={styles.record}>
            <div className={styles.recordHeader}>
              <div className={styles.recordHeaderItem}>
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className={styles.recordIcon}
                />
                <h3 className={styles.recordTitle}>Anotação</h3>
              </div>

              <div className={styles.recordHeaderItem}>
                <FontAwesomeIcon icon={faClock} className={styles.clockIcon} />
                <span className={styles.recordDate}>
                  {formatDate(record.createdAt)}
                </span>
              </div>
            </div>
            <div
              className={styles.recordContent}
              dangerouslySetInnerHTML={{ __html: record.content }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientRecords;
