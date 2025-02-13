/** @format */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { RichTextEditor } from '@mantine/tiptap';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import styles from './RichTextEditorComponent.module.css';

export interface RichTextEditorRef {
  clearContent: () => void; // ✅ Exposed method
}

interface RichTextEditorProps {
  initialContent?: string;
  onContentChange: (content: string) => void;
}

const RichTextEditorComponent = forwardRef<
  RichTextEditorRef,
  RichTextEditorProps
>(({ initialContent = '', onContentChange }, ref) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Ensures SSR-safe rendering
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit, // ✅ Includes BulletList, OrderedList, and ListItem
      Placeholder.configure({
        placeholder: 'Digite aqui sua anotação...',
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: styles.autoGrowEditor, // Applied styles for height expansion
        style: `
          padding: 12px;
          line-height: 1.5;
          word-wrap: break-word; /* ✅ Ensures long words wrap */
          overflow-wrap: break-word; /* ✅ Alternative for better browser support */
          white-space: pre-wrap; /* ✅ Ensures text wraps naturally */
          max-width: 100%; /* ✅ Prevents editor from stretching */
          width: 100%; /* ✅ Ensures content does not exceed container */
          display: block;
          box-sizing: border-box; /* ✅ Ensures padding is included in width */
        `,
      },
    },
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // ✅ Expose `clearContent` method
  useImperativeHandle(ref, () => ({
    clearContent: () => {
      if (editor) {
        editor.commands.clearContent();
      }
    },
  }));

  return (
    <div className={styles.editorContainer}>
      {mounted && editor && (
        <RichTextEditor editor={editor} className={styles.editor}>
          {/* Toolbar */}
          <RichTextEditor.Toolbar sticky className={styles.toolbar}>
            <RichTextEditor.Bold disabled={!editor.can().toggleBold?.()} />
            <RichTextEditor.Italic disabled={!editor.can().toggleItalic?.()} />
            <RichTextEditor.Underline
              disabled={!editor.can().toggleUnderline?.()}
            />
            {/* <RichTextEditor.BulletList
              disabled={!editor.can().toggleBulletList?.()}
            />
            <RichTextEditor.OrderedList
              disabled={!editor.can().toggleOrderedList?.()}
            /> */}
            <RichTextEditor.Undo disabled={!editor.can().undo?.()} />
            <RichTextEditor.Redo disabled={!editor.can().redo?.()} />
          </RichTextEditor.Toolbar>

          {/* Editor Content */}
          <RichTextEditor.Content className={styles.editorContent} />
        </RichTextEditor>
      )}
    </div>
  );
});

export default RichTextEditorComponent;
