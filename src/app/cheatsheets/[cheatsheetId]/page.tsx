'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface CheatsheetContent {
  text: string;
}

interface Cheatsheet {
  id: string;
  videoId: string;
  processingStatus: string;
  comment: string;
  content: CheatsheetContent;
  createdAt: string;
  updatedAt: string;
}

export default function CheatsheetDetail({ params }: { params: { cheatsheetId: string } }) {
  const [cheatsheet, setCheatsheet] = useState<Cheatsheet | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCheatsheet = async () => {
      try {
        const response = await fetch(`http://localhost:3000/cheatsheets/${params.cheatsheetId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch cheatsheet');
        }
        const data = await response.json();
        setCheatsheet(data);
      } catch (error) {
        console.error('Error fetching cheatsheet:', error);
      }
    };

    fetchCheatsheet();
  }, [params.cheatsheetId]);

  if (!cheatsheet) {
    return <div>Loading...</div>;
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const renderContent = (content: CheatsheetContent) => {
    if (typeof content.text === 'string') {
      return (
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mt-5 mb-3" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-xl font-medium mt-4 mb-2" {...props} />,
            p: ({node, ...props}) => <p className="mb-4" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
            li: ({node, ...props}) => <li className="mb-1" {...props} />,
            code: ({node, inline, ...props}) => 
              inline 
                ? <code className="bg-gray-100 rounded px-1" {...props} />
                : <pre className="bg-gray-100 rounded p-4 overflow-x-auto"><code {...props} /></pre>
          }}
        >
          {cheatsheet.content.text}
        </ReactMarkdown>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => router.push(`/cheatsheets?videoId=${cheatsheet.videoId}`)}>Back to Video</Button>
        <p className="text-sm text-gray-500">
          Created: {formatDateTime(cheatsheet.createdAt)}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Comment</h2>
        <p className="text-gray-700">{cheatsheet.comment}</p>
      </div>

      <div className="space-y-8">
        {cheatsheet && renderContent(cheatsheet.content)}
      </div>
    </div>
  );
}