import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface CustomMarkdownProps {
  children: string;
  className?: string;
}

export function CustomMarkdown({ children, className = '' }: CustomMarkdownProps) {
  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
      className={className}
      components={{
        h1: ({...props}) => <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />,
        h2: ({...props}) => <h2 className="text-2xl font-semibold mt-5 mb-3" {...props} />,
        h3: ({...props}) => <h3 className="text-xl font-medium mt-4 mb-2" {...props} />,
        p: ({...props}) => <p className="mb-4" {...props} />,
        ul: ({...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
        ol: ({...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
        li: ({...props}) => <li className="mb-1" {...props} />,
        code: ({inline, ...props}) => 
          inline 
            ? <code className="bg-gray-100 rounded px-1" {...props} />
            : <pre className="bg-gray-100 rounded p-4 overflow-x-auto"><code {...props} /></pre>
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
