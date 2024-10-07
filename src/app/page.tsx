'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Plus } from 'lucide-react'  // Import the Plus icon
import { AddVideoModal } from "@/components/add-video-modal"
import { Toaster } from "@/components/ui/toaster"

export enum VideoProcessingStatus {
  PENDING = 'pending',
  AUDIO_FETCHED = 'audio_fetched',
  TRANSCRIPT_GENERATED = 'transcript_generated',
  TOPICS_FETCHED = 'topics_fetched',
}

function mapStatusToFrontend(status: VideoProcessingStatus): string {
  switch (status) {
    case VideoProcessingStatus.PENDING:
      return 'Pending';
    case VideoProcessingStatus.AUDIO_FETCHED:
    case VideoProcessingStatus.TRANSCRIPT_GENERATED:
      return 'In Progress';
    case VideoProcessingStatus.TOPICS_FETCHED:
      return 'Done';
    default:
      return 'Unknown';
  }
}

interface VideoCard {
  id: string;
  youtubeId: string;
  title: string | null;
  processingStatus: VideoProcessingStatus;
  cheatsheetCount: number;
  thumbnailUrl: string;
}

export default function Home() {
  const [videoCards, setVideoCards] = useState<VideoCard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchVideos = async () => {
    try {
      const response = await fetch('http://localhost:3000/youtube-videos');
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      const data = await response.json();
      setVideoCards(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleAddVideo = async (url: string) => {
    const response = await fetch('http://localhost:3000/youtube-videos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error('Failed to add video');
    }

    await fetchVideos();
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Video Gallery</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add a video
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videoCards.map((card) => (
          <Card key={card.id} className="overflow-hidden flex flex-col h-full">
            <CardHeader className="p-0 relative">
              <img
                src={card.thumbnailUrl || '/images/thumbnail-placeholder.png'}
                alt={`Thumbnail for ${card.title}`}
                className="w-full h-48 object-cover"
              />
              <span className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-semibold">
                {mapStatusToFrontend(card.processingStatus)}
              </span>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <CardTitle className="text-lg mb-2 line-clamp-2 h-14">
                <a href={`https://www.youtube.com/watch?v=${card.youtubeId}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {card.title}
                </a>
              </CardTitle>
              <p className="text-sm text-muted-foreground mb-2">ID: {card.youtubeId}</p>
              <p className="text-sm text-muted-foreground">Cheatsheets: {card.cheatsheetCount}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center h-16">
              {card.cheatsheetCount > 0 && (
                <Button variant="outline">View Cheatsheets</Button>
              )}
              {card.processingStatus === VideoProcessingStatus.TOPICS_FETCHED && (
                <Button>Create Cheatsheet</Button>
              )}
              {card.cheatsheetCount === 0 && card.processingStatus !== VideoProcessingStatus.TOPICS_FETCHED && (
                <div className="w-full text-center text-sm text-muted-foreground">
                  Processing video...
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      <AddVideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddVideo}
      />
      <Toaster />
    </div>
  );
}
