'use client'

import { useEffect, useState } from "react"
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Link from 'next/link'
import Image from 'next/image'
import { CustomMarkdown } from '@/components/CustomMarkdown'

interface Cheatsheet {
  id: string;
  videoId: string;
  processingStatus: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface VideoDetails {
  id: string;
  title: string;
  thumbnailUrl: string;
  youtubeId: string;
  persona: string;
  mainTheme: string;
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
          <div className="flex items-center gap-6 mb-4">
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
          <h2 className="text-2xl font-semibold mt-6 mb-3">Video Context</h2>
          <div className="flex gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">View Persona</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] w-full">
                <DialogHeader>
                  <DialogTitle>Persona</DialogTitle>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto pr-4">
                  <CustomMarkdown className="prose">
                    {videoDetails.persona}
                  </CustomMarkdown>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">View Main Theme</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] w-full">
                <DialogHeader>
                  <DialogTitle>Main Theme</DialogTitle>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto pr-4">
                  <CustomMarkdown className="prose">
                    {videoDetails.mainTheme}
                  </CustomMarkdown>
                </div>
              </DialogContent>
            </Dialog>
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
              <p className="text-sm text-muted-foreground mb-2">Status: {cheatsheet.processingStatus}</p>
              <p className="text-sm text-muted-foreground mb-2">Comment: {cheatsheet.comment}</p>
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
