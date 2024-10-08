'use client'

import { useEffect, useState } from "react"
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import Image from 'next/image'

interface Cheatsheet {
  id: string;
  videoId: string;
  processingStatus: string;
  neededTopics: string[];
  language: string;
  createdAt: string;
  updatedAt: string;
}

interface VideoDetails {
  id: string;
  title: string;
  thumbnailUrl: string;
  youtubeId: string;
}

export default function CheatsheetsList() {
  const [cheatsheets, setCheatsheets] = useState<Cheatsheet[]>([]);
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const searchParams = useSearchParams();
  const videoId = searchParams.get('videoId');

  useEffect(() => {
    if (videoId) {
      fetchCheatsheets();
      fetchVideoDetails();
    }
  }, [videoId]);

  const fetchCheatsheets = async () => {
    try {
      const response = await fetch(`http://localhost:3000/cheatsheets?videoId=${videoId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch cheatsheets');
      }
      const data = await response.json();
      setCheatsheets(data);
    } catch (error) {
      console.error('Error fetching cheatsheets:', error);
    }
  };

  const fetchVideoDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/youtube-videos/${videoId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch video details');
      }
      const data = await response.json();
      setVideoDetails(data);
    } catch (error) {
      console.error('Error fetching video details:', error);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/" passHref>
          <Button variant="outline">Back to Videos</Button>
        </Link>
        <Link href={`/create-cheatsheet?videoId=${videoId}`} passHref>
          <Button variant="default">Create Cheatsheet</Button>
        </Link>
      </div>

      {videoDetails && (
        <div className="mb-8">
          <div className="flex items-center gap-6">
            <Image
              src={videoDetails.thumbnailUrl || '/images/thumbnail-placeholder.png'}
              alt={videoDetails.title}
              width={240}
              height={135}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-3xl font-bold mb-2">Cheatsheet for: {videoDetails.title}</h1>
              <a
                href={`https://www.youtube.com/watch?v=${videoDetails.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Watch Video
              </a>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">Available Cheatsheets</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cheatsheets.map((cheatsheet) => (
          <Card key={cheatsheet.id} className="overflow-hidden flex flex-col h-full">
            <CardHeader>
              <CardTitle className="text-lg mb-2">{formatDateTime(cheatsheet.createdAt)}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <p className="text-sm text-muted-foreground mb-2">Language: {cheatsheet.language.toUpperCase()}</p>
              <p className="text-sm text-muted-foreground mb-2">Status: {cheatsheet.processingStatus}</p>
              <p className="text-sm text-muted-foreground mb-2">Topics: {cheatsheet.neededTopics.length}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Link href={`/cheatsheets/${cheatsheet.id}`} passHref>
                <Button variant="outline" className="w-full">View Cheatsheet</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}