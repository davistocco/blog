import Header from "@/components/header/component";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function Post({ params }: { params: { slug: string } }) {
  const markdown = `
~~~js
console.log('Hello, World!');
~~~
## Referências
1. 
`;
  return (
    <main>
      <Header
        title={params.slug}
        createdAt='15/12/2023 11:08'
      />
      <Markdown
        components={{
          code(props) {
            const { children, className, node, ...rest } = props
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
              <SyntaxHighlighter
                PreTag="div"
                language={match[1]}
                style={dracula}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            )
          }
        }}
      >
        {markdown}
      </Markdown>
    </main>
  );
}
