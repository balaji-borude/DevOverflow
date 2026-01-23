"use client";
import React from "react";
// here we are going to import MDXEditor from @mdxeditor/editor
//import { MDXEditor } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
// InitializedMDXEditor.tsx
import type { ForwardedRef } from "react";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  toolbarPlugin,
  UndoRedo,
  Separator,
  BoldItalicUnderlineToggles,
  ListsToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
  imagePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
} from "@mdxeditor/editor";

// import basic dark cm6 theme
import { basicDark } from "cm6-theme-basic-dark";

// import css for the dark mode
import "./dark-editor.css";
import { useTheme } from "next-themes";

type EditorProps = {
  editorRef: ForwardedRef<MDXEditorMethods> | null;
  markdown: string;
  onChange: (value: string) => void;
};


const Editor = ({ editorRef, markdown, onChange }: EditorProps) => {
  // cm6-theme-basic-dark package provides a basic dark theme for the editor

  const { resolvedTheme } = useTheme();

  const theme = resolvedTheme === "dark" ? [basicDark] : [];

  return (
    <div>
      <MDXEditor
        key={resolvedTheme}
     
      markdown={markdown}
      onChange={onChange}
        // styling for editor
        className="background-light800_dark200 light-border-2 markdown-editor dark-editor w-full border"
        plugins={[
          // Example Plugin Usage
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          quotePlugin(),
          markdownShortcutPlugin(),
          tablePlugin(),
          imagePlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              css: "css",
              js: "javascript",
              ts: "typescript",
              html: "html",
              json: "json",
              python: "python",
              saas: "saas",
              bash: "bash",
              go: "go",
              ruby: "ruby",
              php: "php",
              scss: "scss",
              java: "java",
              c: "c",
              cpp: "cpp",
              "": "plaintext",
              tsx: "Typescript (React)",
              jsx: "Javascript (React)",
            },
            autoLoadLanguageSupport: true,
            codeMirrorExtensions: theme,
          }),
          diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),

          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          toolbarPlugin({
            toolbarContents: () => {
              return (
                <ConditionalContents
                  options={[
                    {
                      when: (editor) => editor?.editorType === "codeblock",
                      contents: () => <ChangeCodeMirrorLanguage />,
                    },
                    {
                      fallback: () => (
                        <>
                          <UndoRedo />
                          <Separator />

                          {/* Bold and ittalic style */}
                          <BoldItalicUnderlineToggles />
                          <Separator />

                          <ListsToggle />
                          <Separator />

                          <CreateLink />
                          <InsertImage />
                             <Separator />

                          <InsertTable />
                          <InsertThematicBreak />
                          <Separator />

                          <InsertCodeBlock />
                        </>
                      ),
                    },
                  ]}
                />
              );
            },
          }),
        ]}
        
        ref={editorRef}
      />
    </div>
  );
};

export default Editor;
