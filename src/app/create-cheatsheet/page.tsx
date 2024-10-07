'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface VideoDetails {
  id: string;
  title: string;
  // Add other relevant fields
}

export default function CreateCheatsheet() {
  const searchParams = useSearchParams()
  const videoId = searchParams.get('id')
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null)

  useEffect(() => {
    const fetchVideoDetails = async () => {
      if (!videoId) return

      try {
        const response = await fetch(`http://localhost:3000/youtube-videos/${videoId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch video details')
        }
        const data = await response.json()
        setVideoDetails(data)
      } catch (error) {
        console.error('Error fetching video details:', error)
      }
    }

    fetchVideoDetails()
  }, [videoId])

  if (!videoDetails) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Cheatsheet for: {videoDetails.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Video ID: {videoId}</p>
          {/* Add more content for cheatsheet creation here */}
        </CardContent>
      </Card>
    </div>
  )
}