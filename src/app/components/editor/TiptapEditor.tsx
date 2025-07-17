"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";

interface Props {
  onChange: (content: string) => void;
}

export default function TiptapEditor({ onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    // Add this line to fix the SSR error
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-lg">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 text-gray-700 text-sm">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className="hover:text-purple-600 font-bold">B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className="hover:text-purple-600 italic">I</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="hover:text-purple-600">• List</button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className="hover:text-purple-600">“”</button>
        <button onClick={() => editor.chain().focus().toggleCode().run()} className="hover:text-purple-600">{'</>'}</button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className="hover:text-purple-600">─</button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="min-h-[120px] px-4 py-3 focus:outline-none text-sm"
      />
    </div>
  );
}