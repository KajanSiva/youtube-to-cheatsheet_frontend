'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

interface CheatsheetContent {
  summary: string;
  glossary: string[];
  keyPoints: string[];
  detailedNotes: string[];
  importantQuotes: string[];
  actionsTakeaways: string[];
  referencesAndResources: string[];
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

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => router.push(`/cheatsheets?videoId=${cheatsheet.videoId}`)}>Back to Video</Button>
        <p className="text-sm text-gray-500">
          Created: {formatDateTime(cheatsheet.createdAt)}
        </p>
      </div>

      <h1 className="text-3xl font-bold mb-6">Cheatsheet content</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Summary</h2>
          <p>{cheatsheet.content.summary}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Glossary</h2>
          <ul className="list-disc pl-6">
            {cheatsheet.content.glossary.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Key Points</h2>
          <ul className="list-disc pl-6">
            {cheatsheet.content.keyPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Detailed Notes</h2>
          {cheatsheet.content.detailedNotes.map((note, index) => (
            <p key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: note }} />
          ))}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Important Quotes</h2>
          <ul className="list-disc pl-6">
            {cheatsheet.content.importantQuotes.map((quote, index) => (
              <li key={index}>{quote}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Actions & Takeaways</h2>
          <ul className="list-disc pl-6">
            {cheatsheet.content.actionsTakeaways.map((action, index) => (
              <li key={index}>{action}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">References & Resources</h2>
          <ul className="list-disc pl-6">
            {cheatsheet.content.referencesAndResources.map((resource, index) => (
              <li key={index}>{resource}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}