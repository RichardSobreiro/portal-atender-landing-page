/** @format */
import React, { useEffect, useState } from 'react';
import styles from './PatientRecords.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const PatientRecords: React.FC = () => {
  const [editorReady, setEditorReady] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      console.log('Content:', editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor) {
      setEditorReady(true);
      editor.commands.focus();
    }
  }, [editor]);

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

      {editor && (
        <RichTextEditor editor={editor} className={styles.editor}>
          {/* ✅ Keep all icons in a single row */}
          {editorReady && (
            <RichTextEditor.Toolbar sticky className={styles.toolbar}>
              <RichTextEditor.Bold disabled={!editor} />
              <RichTextEditor.Italic disabled={!editor} />
              <RichTextEditor.Underline disabled={!editor} />

              <RichTextEditor.BulletList disabled={!editor} />
              <RichTextEditor.OrderedList disabled={!editor} />

              <RichTextEditor.Undo disabled={!editor} />
              <RichTextEditor.Redo disabled={!editor} />
            </RichTextEditor.Toolbar>
          )}

          <RichTextEditor.Content
            className={styles.editorContent}
            style={{ minHeight: '250px' }}
          />
        </RichTextEditor>
      )}
    </div>
  );
};

export default PatientRecords;
