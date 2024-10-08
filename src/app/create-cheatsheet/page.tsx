'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface VideoDetails {
  id: string;
  title: string;
}

interface Theme {
  title: string;
  subThemes: string[];
  description: string;
}

interface DiscussionTopics {
  themes: Theme[];
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
  const [discussionTopics, setDiscussionTopics] = useState<DiscussionTopics | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!videoId) return

      try {
        const [videoResponse, topicsResponse] = await Promise.all([
          fetch(`http://localhost:3000/youtube-videos/${videoId}`),
          fetch(`http://localhost:3000/youtube-videos/${videoId}/discussion-topics`)
        ])

        if (!videoResponse.ok || !topicsResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        const videoData = await videoResponse.json()
        const topicsData = await topicsResponse.json()

        setVideoDetails(videoData)
        setDiscussionTopics(topicsData.discussionTopics)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [videoId])

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value)
  }

  const handleTopicToggle = (title: string) => {
    setSelectedTopics(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    )
  }

  const handleSubmit = async () => {
    if (!selectedLanguage) {
      toast({
        title: "Error",
        description: "Please select a language.",
        variant: "destructive",
      })
      return
    }

    if (selectedTopics.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one topic.",
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
          neededTopics: selectedTopics,
          language: selectedLanguage,
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

  if (!videoDetails || !discussionTopics) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Create Cheatsheet for: {videoDetails.title}</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">1. Select Language</h2>
        <p className="text-gray-600 mb-4">Choose the language for your cheatsheet:</p>
        <Select onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map(lang => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2. Choose Topics</h2>
        <p className="text-gray-600 mb-4">Select one or more topics to include in your cheatsheet:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {discussionTopics.themes.map((theme, index) => (
            <Card 
              key={index} 
              className={`cursor-pointer ${selectedTopics.includes(theme.title) ? 'border-blue-500 border-2' : ''}`}
              onClick={() => handleTopicToggle(theme.title)}
            >
              <CardHeader>
                <CardTitle>{theme.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{theme.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">3. Generate Cheatsheet</h2>
        <p className="text-gray-600 mb-4">Click the button below to create your personalized cheatsheet:</p>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Generating...' : 'Generate Cheatsheet'}
        </Button>
      </div>
    </div>
  )
}