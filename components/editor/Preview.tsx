import React from "react";
import { Code } from "bright";
import { MDXRemote } from "next-mdx-remote/rsc";

Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
};

const preview = ({ content = " " }: { content: string }) => {
  // it replace the
  const formattedContent = content.replace(/\\n/g, "").replace(/&#x20;/g, "");

  return (
    <section className="markdown prose grid wrap-break-word">
      <MDXRemote
        source={formattedContent}
        components={{
          pre: (props) => (
            <Code
              {...props}
              lineNumbers
              className="shadow-light-200 dark:shadow-dark-200"
            />
          ),
        }}
      />
    </section>
  );
};

export default preview;
