"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Code,
  Undo,
  Redo,
  Type,
  Palette
} from "lucide-react";

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minHeight?: number;
}

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Start typing...",
  className,
  disabled = false,
  minHeight = 200
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleContentChange();
  };

  const handleContentChange = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      executeCommand("insertImage", url);
    }
  };

  const changeFontSize = (size: string) => {
    executeCommand("fontSize", size);
  };

  const changeTextColor = (color: string) => {
    executeCommand("foreColor", color);
  };

  const toolbarButtons = [
    {
      group: "format",
      buttons: [
        { icon: Bold, command: "bold", title: "Bold (Ctrl+B)" },
        { icon: Italic, command: "italic", title: "Italic (Ctrl+I)" },
        { icon: Underline, command: "underline", title: "Underline (Ctrl+U)" },
        { icon: Strikethrough, command: "strikeThrough", title: "Strikethrough" },
      ]
    },
    {
      group: "align",
      buttons: [
        { icon: AlignLeft, command: "justifyLeft", title: "Align Left" },
        { icon: AlignCenter, command: "justifyCenter", title: "Align Center" },
        { icon: AlignRight, command: "justifyRight", title: "Align Right" },
        { icon: AlignJustify, command: "justifyFull", title: "Justify" },
      ]
    },
    {
      group: "lists",
      buttons: [
        { icon: List, command: "insertUnorderedList", title: "Bullet List" },
        { icon: ListOrdered, command: "insertOrderedList", title: "Numbered List" },
        { icon: Quote, command: "formatBlock", value: "blockquote", title: "Quote" },
      ]
    },
    {
      group: "insert",
      buttons: [
        { icon: Link, action: insertLink, title: "Insert Link" },
        { icon: Image, action: insertImage, title: "Insert Image" },
        { icon: Code, command: "formatBlock", value: "pre", title: "Code Block" },
      ]
    },
    {
      group: "history",
      buttons: [
        { icon: Undo, command: "undo", title: "Undo (Ctrl+Z)" },
        { icon: Redo, command: "redo", title: "Redo (Ctrl+Y)" },
      ]
    }
  ] as const;

  return (
    <div className={cn("border rounded-md bg-background", className)}>
      {/* Toolbar */}
      <div className="border-b p-2 flex flex-wrap gap-1 bg-muted/30">
        {/* Font Size */}
        <select
          className="px-2 py-1 text-sm border rounded bg-background"
          onChange={(e) => changeFontSize(e.target.value)}
          disabled={disabled}
        >
          <option value="1">8pt</option>
          <option value="2">10pt</option>
          <option value="3" selected>12pt</option>
          <option value="4">14pt</option>
          <option value="5">18pt</option>
          <option value="6">24pt</option>
          <option value="7">36pt</option>
        </select>

        <Separator orientation="vertical" className="h-6" />

        {/* Text Color */}
        <div className="flex items-center gap-1">
          <Palette className="h-4 w-4" />
          <input
            type="color"
            className="w-8 h-6 border rounded cursor-pointer"
            onChange={(e) => changeTextColor(e.target.value)}
            disabled={disabled}
            title="Text Color"
          />
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Toolbar Buttons */}
        {toolbarButtons.map((group, groupIndex) => (
          <React.Fragment key={group.group}>
            <div className="flex gap-1">
              {group.buttons.map((button, buttonIndex) => (
                <Button
                  key={buttonIndex}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    if ('action' in button) {
                      button.action();
                    } else {
                      executeCommand(button.command, 'value' in button ? button.value : undefined);
                    }
                  }}
                  disabled={disabled}
                  title={button.title}
                >
                  <button.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
            {groupIndex < toolbarButtons.length - 1 && (
              <Separator orientation="vertical" className="h-6" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        className={cn(
          "p-4 outline-none focus:ring-0",
          "prose prose-sm max-w-none",
          "min-h-[200px]",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        style={{ minHeight }}
        onInput={handleContentChange}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      {/* Status Bar */}
      <div className="border-t px-4 py-2 text-xs text-muted-foreground bg-muted/30">
        <div className="flex justify-between items-center">
          <span>
            {editorRef.current?.textContent?.length || 0} characters
          </span>
          <span className="flex items-center gap-2">
            {isActive && <span className="text-green-600">● Active</span>}
            <span>Rich Text Editor</span>
          </span>
        </div>
      </div>

      {/* Custom Styles for the editor content */}
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #6b7280;
          pointer-events: none;
        }
        
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        
        [contenteditable] h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }
        
        [contenteditable] p {
          margin: 1em 0;
        }
        
        [contenteditable] blockquote {
          margin: 1em 0;
          padding-left: 1em;
          border-left: 4px solid #e5e7eb;
          font-style: italic;
        }
        
        [contenteditable] ul, [contenteditable] ol {
          margin: 1em 0;
          padding-left: 2em;
        }
        
        [contenteditable] pre {
          background-color: #f3f4f6;
          padding: 1em;
          border-radius: 0.375rem;
          overflow-x: auto;
          font-family: monospace;
        }
        
        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
        }
      `}</style>
    </div>
  );
}
