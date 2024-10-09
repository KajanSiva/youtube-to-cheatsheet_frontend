'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

interface CheatsheetContent {
  [key: string]: any;
}

interface Cheatsheet {
  id: string;
  videoId: string;
  processingStatus: string;
  neededTopics: string[];
  content: CheatsheetContent;
  language: string;
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

  const renderContent = (content: any, depth: number = 0) => {
    if (typeof content === 'string') {
      return <p>{content}</p>;
    }

    if (Array.isArray(content)) {
      return (
        <ul className="list-disc pl-6">
          {content.map((item, index) => (
            <li key={index}>{renderContent(item, depth + 1)}</li>
          ))}
        </ul>
      );
    }

    if (typeof content === 'object' && content !== null) {
      return (
        <div className="space-y-4">
          {Object.entries(content).map(([key, value]) => (
            <div key={key}>
              <h3 className={`font-semibold ${depth === 0 ? 'text-2xl mb-4' : 'text-xl mb-2'}`}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </h3>
              {renderContent(value, depth + 1)}
            </div>
          ))}
        </div>
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

      <h1 className="text-3xl font-bold mb-6">Cheatsheet Content</h1>

      <div className="space-y-8">
        {renderContent(cheatsheet.content)}
      </div>
    </div>
  );
}