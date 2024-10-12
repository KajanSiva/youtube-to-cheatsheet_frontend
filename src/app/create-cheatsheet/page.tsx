'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"

interface VideoDetails {
  id: string;
  title: string;
}

const languages = [
  { name: 'English', code: 'en' },
  { name: 'French', code: 'fr' },
  { name: 'Spanish', code: 'es' },
  { name: 'German', code: 'de' },
  { name: 'Italian', code: 'it' },
  // Add more languages as needed
];

export default function CreateCheatsheet() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const videoId = searchParams.get('videoId')
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comment, setComment] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      if (!videoId) return

      try {
        const [videoResponse] = await Promise.all([
          fetch(`http://localhost:3000/youtube-videos/${videoId}`),
        ])

        if (!videoResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        const videoData = await videoResponse.json()

        setVideoDetails(videoData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [videoId])

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value)
  }

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value)
  }

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('http://localhost:3000/cheatsheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId,
          comment,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create cheatsheet')
      }

      const data = await response.json()

      toast({
        title: "Success",
        description: "Cheatsheet created successfully!",
      })

      // Redirect to the cheatsheets list page for this video
      router.push(`/cheatsheets?videoId=${videoId}`)
    } catch (error) {
      console.error('Error creating cheatsheet:', error)
      toast({
        title: "Error",
        description: "Failed to create cheatsheet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!videoDetails) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Create Cheatsheet for: {videoDetails.title}</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Enter Your Comment</h2>
        <p className="text-gray-600 mb-4">Provide a comment or instructions for generating the cheatsheet:</p>
        <Input
          type="text"
          placeholder="Enter your comment here"
          value={comment}
          onChange={handleCommentChange}
          className="w-full"
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Generate Cheatsheet</h2>
        <p className="text-gray-600 mb-4">Click the button below to create your personalized cheatsheet:</p>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Generating...' : 'Generate Cheatsheet'}
        </Button>
      </div>
    </div>
  )
}