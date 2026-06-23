import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  ImagePlus,
  Undo,
  Redo,
} from 'lucide-react';
import { useCloudinaryUpload } from '../../hooks/useCloudinaryUpload';

interface Props {
  value: string;
  onChange: (html: string) => void;
}

function ToolbarButton({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded p-1.5 transition-colors ${
        active ? 'bg-brand/10 text-brand' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const { open } = useCloudinaryUpload('articles');

  function addLink() {
    const url = window.prompt('URL du lien :');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }

  function addImage() {
    open((url) => editor.chain().focus().setImage({ src: url }).run());
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 p-2">
      <ToolbarButton
        title="Gras"
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Italique"
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Titre 2"
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Titre 3"
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Liste à puces"
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Liste numérotée"
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Lien"
        active={editor.isActive('link')}
        onClick={addLink}
      >
        <LinkIcon size={16} />
      </ToolbarButton>
      <ToolbarButton title="Image" onClick={addImage}>
        <ImagePlus size={16} />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-gray-200" />
      <ToolbarButton
        title="Annuler"
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Rétablir"
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo size={16} />
      </ToolbarButton>
    </div>
  );
}

export function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Image],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
