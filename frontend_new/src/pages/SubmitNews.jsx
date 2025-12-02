import { useState, useEffect } from 'react'
import { 
  Link as LinkIcon, 
  FileText, 
  File, 
  Rocket, 
  Globe, 
  Building2, 
  Bot,
  Check,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function SubmitNews() {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [articleText, setArticleText] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [language, setLanguage] = useState('english')
  const [analytics, setAnalytics] = useState(null)
  const [languagesCount, setLanguagesCount] = useState(0)
  const [departmentsCount, setDepartmentsCount] = useState(0)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/analytics?days=30')
        if (res.ok) {
          const data = await res.json()
          setAnalytics(data)
          setLanguagesCount(Object.keys(data.language_distribution || {}).length)
          setDepartmentsCount(Object.keys(data.department_distribution || {}).length)
        }
      } catch (e) {
        console.error('Failed to load analytics', e)
      }
    }
    load()
  }, [])

  const handleUrlSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:8000/api/submit/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      console.log('URL submitted:', data)
      
      // Show detailed success message
      const message = `✅ Article Analyzed Successfully!

📊 Analysis Results:
• Sentiment: ${data.sentiment || 'Unknown'}
• Confidence: ${data.sentiment_score ? Math.round(data.sentiment_score * 100) + '%' : 'N/A'}
• Department: ${data.department || 'Unknown'}
• Language: ${data.detected_language || 'Unknown'}
• Article ID: ${data.id}

${data.translated_content ? '✓ Translation completed' : ''}`
      
      alert(message)
      setUrl('')
    } catch (err) {
      console.error('Failed to submit URL', err)
      alert('Failed to submit URL')
    }
  }

  const handleTextSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:8000/api/submit/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() || null, text: articleText })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      console.log('Text submitted:', data)
      
      // Show detailed success message with analysis results
      const message = `✅ Article Analyzed Successfully!

📊 Analysis Results:
• Sentiment: ${data.sentiment || 'Unknown'}
• Confidence: ${data.sentiment_score ? Math.round(data.sentiment_score * 100) + '%' : 'N/A'}
• Department: ${data.department || 'Unknown'}
• Language: ${data.detected_language || 'Unknown'}
• Article ID: ${data.id}

${data.translated_content ? '✓ Translation completed' : ''}`
      
      alert(message)
      
      // Clear form
      setTitle('')
      setArticleText('')
    } catch (err) {
      console.error('Failed to submit text', err)
      alert('Failed to submit text')
    }
  }

  const handlePdfSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!selectedFile) {
        alert('Please select a PDF file')
        return
      }
      const langMap = {
        english: 'eng',
        hindi: 'hin',
        bengali: 'ben',
        telugu: 'tel',
        tamil: 'tam',
        marathi: 'mar',
        gujarati: 'guj',
        kannada: 'kan',
        malayalam: 'mal',
        odia: 'ori',
        punjabi: 'pan',
        urdu: 'urd'
      }
      const form = new FormData()
      form.append('file', selectedFile)
      form.append('language', langMap[language] || 'eng')
      const res = await fetch('http://localhost:8000/api/submit/pdf', {
        method: 'POST',
        body: form
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      console.log('PDF submitted:', data)
      
      // Show detailed success message
      const message = `✅ PDF Analyzed Successfully!

📊 Analysis Results:
• Sentiment: ${data.sentiment || 'Unknown'}
• Confidence: ${data.sentiment_score ? Math.round(data.sentiment_score * 100) + '%' : 'N/A'}
• Department: ${data.department || 'Unknown'}
• Language: ${data.detected_language || 'Unknown'}
• Article ID: ${data.id}

${data.translated_content ? '✓ Translation completed' : ''}`
      
      alert(message)
      setSelectedFile(null)
    } catch (err) {
      console.error('Failed to submit PDF', err)
      alert('Failed to submit PDF')
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  const handleImageSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!selectedImage) {
        alert('Please select an image file')
        return
      }
      const langMap = {
        english: 'eng',
        hindi: 'hin',
        bengali: 'ben',
        telugu: 'tel',
        tamil: 'tam',
        marathi: 'mar',
        gujarati: 'guj',
        kannada: 'kan',
        malayalam: 'mal',
        odia: 'ori',
        punjabi: 'pan',
        urdu: 'urd'
      }
      const form = new FormData()
      form.append('file', selectedImage)
      form.append('language', langMap[language] || 'eng')
      const res = await fetch('http://localhost:8000/api/submit/image', {
        method: 'POST',
        body: form
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      console.log('Image submitted:', data)
      
      // Show detailed success message
      const message = `✅ Image Analyzed Successfully!

📊 Analysis Results:
• Sentiment: ${data.sentiment || 'Unknown'}
• Confidence: ${data.sentiment_score ? Math.round(data.sentiment_score * 100) + '%' : 'N/A'}
• Department: ${data.department || 'Unknown'}
• Language: ${data.detected_language || 'Unknown'}
• Article ID: ${data.id}

${data.translated_content ? '✓ Translation completed' : ''}`
      
      alert(message)
      setSelectedImage(null)
    } catch (err) {
      console.error('Failed to submit image', err)
      alert('Failed to submit image')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Submit News for Analysis</h1>
        <p className="text-muted-foreground mt-2">
          Submit news articles via URL, text, PDF, or image for comprehensive analysis
        </p>
      </div>

      {/* Main Content Card */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-4">
              <TabsTrigger value="url" className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                URL
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Text
              </TabsTrigger>
              <TabsTrigger value="pdf" className="flex items-center gap-2">
                <File className="w-4 h-4" />
                PDF
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Image
              </TabsTrigger>
            </TabsList>

            {/* URL Tab */}
            <TabsContent value="url" className="space-y-6 mt-6">
              <form onSubmit={handleUrlSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="article-url">Article URL</Label>
                  <Input
                    id="article-url"
                    type="url"
                    placeholder="https://example.com/news-article"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Examples: The Hindu, Indian Express, TV9, etc.
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 mt-6">
                  <Button type="submit" className="w-full" size="lg">
                    <Rocket className="w-4 h-4 mr-2" />
                    Submit URL
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* Text Tab */}
            <TabsContent value="text" className="space-y-6 mt-6">
              <form onSubmit={handleTextSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="article-title">Title (Optional)</Label>
                  <Input
                    id="article-title"
                    type="text"
                    placeholder="Article title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="article-text">Article Text</Label>
                  <Textarea
                    id="article-text"
                    placeholder="Paste your article text here..."
                    value={articleText}
                    onChange={(e) => setArticleText(e.target.value)}
                    rows={10}
                    required
                    className="resize-y"
                  />
                </div>

                <div className="bg-muted/50 rounded-lg p-4 mt-6">
                  <Button type="submit" className="w-full" size="lg">
                    <Rocket className="w-4 h-4 mr-2" />
                    Submit Text
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* PDF Tab */}
            <TabsContent value="pdf" className="space-y-6 mt-6">
              <form onSubmit={handlePdfSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pdf-file">Select PDF File</Label>
                  <Input
                    id="pdf-file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    required
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language (for OCR)</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language" className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="bengali">Bengali</SelectItem>
                      <SelectItem value="telugu">Telugu</SelectItem>
                      <SelectItem value="tamil">Tamil</SelectItem>
                      <SelectItem value="marathi">Marathi</SelectItem>
                      <SelectItem value="gujarati">Gujarati</SelectItem>
                      <SelectItem value="kannada">Kannada</SelectItem>
                      <SelectItem value="malayalam">Malayalam</SelectItem>
                      <SelectItem value="odia">Odia</SelectItem>
                      <SelectItem value="punjabi">Punjabi</SelectItem>
                      <SelectItem value="urdu">Urdu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 mt-6">
                  <Button type="submit" className="w-full" size="lg">
                    <Rocket className="w-4 h-4 mr-2" />
                    Submit PDF
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* Image Tab */}
            <TabsContent value="image" className="space-y-6 mt-6">
              <form onSubmit={handleImageSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-file">Select Image File</Label>
                  <Input
                    id="image-file"
                    type="file"
                    accept=".jpg,.jpeg,.png,.bmp,.tiff,.tif"
                    onChange={handleImageChange}
                    required
                  />
                  {selectedImage && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedImage.name}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Supported formats: JPG, PNG, BMP, TIFF
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image-language">Language (for OCR)</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="image-language" className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="bengali">Bengali</SelectItem>
                      <SelectItem value="telugu">Telugu</SelectItem>
                      <SelectItem value="tamil">Tamil</SelectItem>
                      <SelectItem value="marathi">Marathi</SelectItem>
                      <SelectItem value="gujarati">Gujarati</SelectItem>
                      <SelectItem value="kannada">Kannada</SelectItem>
                      <SelectItem value="malayalam">Malayalam</SelectItem>
                      <SelectItem value="odia">Odia</SelectItem>
                      <SelectItem value="punjabi">Punjabi</SelectItem>
                      <SelectItem value="urdu">Urdu</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Select the language of text in the image for better OCR accuracy
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 mt-6">
                  <Button type="submit" className="w-full" size="lg">
                    <Rocket className="w-4 h-4 mr-2" />
                    Analyze Image
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Multi-Language</p>
                <p className="text-2xl font-bold text-foreground">{languagesCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Departments</p>
                <p className="text-2xl font-bold text-foreground">{departmentsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Bot className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">AI Models</p>
                <p className="text-2xl font-bold text-foreground">{0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Features</h2>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-foreground">
                Automatic language detection for 8+ Indian regional languages
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-foreground">
                Sentiment analysis (Positive / Neutral / Negative)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-foreground">
                Department classification across 12 categories
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-foreground">
                OCR support for PDFs and e-papers
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-foreground">
                Real-time email alerts for negative sentiment
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground py-4">
        <p>© 2024 AI-Powered News Feedback System | Built with FastAPI + React + AI/ML</p>
      </div>
    </div>
  )
}

