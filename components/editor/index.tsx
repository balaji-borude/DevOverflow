"use client";
import "@mdxeditor/editor/style.css";
import { type ForwardedRef } from "react";
import {
  headingsPlugin, listsPlugin, quotePlugin, thematicBreakPlugin,
  markdownShortcutPlugin, MDXEditor, type MDXEditorMethods,
  ConditionalContents, ChangeCodeMirrorLanguage, toolbarPlugin,
  UndoRedo, Separator, BoldItalicUnderlineToggles, ListsToggle,
  CreateLink, InsertImage, InsertTable, InsertThematicBreak,
  InsertCodeBlock, linkPlugin, linkDialogPlugin, tablePlugin,
  imagePlugin, codeBlockPlugin, codeMirrorPlugin, diffSourcePlugin,
} from "@mdxeditor/editor";
import { basicDark } from "cm6-theme-basic-dark";
import "./dark-editor.css";
import { useTheme } from "next-themes";

type EditorProps = {
  editorRef: ForwardedRef<MDXEditorMethods> | null;
  markdown: string;
  onChange: (value: string) => void;
};

const Editor = ({ editorRef, markdown, onChange }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? [basicDark] : [];

  return (
    <MDXEditor
      key={resolvedTheme}
      ref={editorRef}
      markdown={markdown}
      onChange={onChange}
      className="background-light800_dark200 light-border-2 markdown-editor dark-editor w-full border"
      // ❌ REMOVED: suppressHtmlProcessing — this was blocking rich text rendering
      // ❌ REMOVED: hasParseError fallback — was swapping to plain textarea
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        tablePlugin(),
        imagePlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            "": "Plaintext", js: "JavaScript", jsx: "JavaScript (React)",
            ts: "TypeScript", tsx: "TypeScript (React)", html: "HTML",
            css: "CSS", scss: "SCSS", json: "JSON", bash: "Bash",
            shell: "Bash", python: "Python", java: "Java", c: "C",
            cpp: "C++", go: "Go", ruby: "Ruby", php: "PHP",
          },
          autoLoadLanguageSupport: true,
          codeMirrorExtensions: theme,
        }),
        diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
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
          ),
        }),
      ]}
    />
  );
};

export default Editor;