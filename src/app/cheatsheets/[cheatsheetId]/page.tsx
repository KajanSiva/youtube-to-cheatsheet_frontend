'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { CustomMarkdown } from '@/components/CustomMarkdown'

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
      return <CustomMarkdown>{cheatsheet.content.text}</CustomMarkdown>;
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

      <div className="max-w-3xl mx-auto space-y-8">
        {cheatsheet && renderContent(cheatsheet.content)}
      </div>
    </div>
  );
}
