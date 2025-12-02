import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  ExternalLink, 
  Calendar, 
  User, 
  Globe, 
  Building,
  TrendingUp,
  TrendingDown,
  Minus,
  Share2,
  Bookmark,
  Flag,
  Eye,
  Clock
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

// Mock article data
const mockArticle = {
  id: 1,
  title: "Government Announces New Healthcare Initiative for Rural Areas",
  summary: "The Ministry of Health and Family Welfare has launched a comprehensive healthcare program targeting rural communities across India, aiming to improve access to medical services and reduce healthcare disparities.",
  content: `
The Ministry of Health and Family Welfare today announced the launch of a groundbreaking healthcare initiative specifically designed to address the medical needs of rural communities across India. This comprehensive program represents a significant step forward in the government's commitment to ensuring equitable healthcare access for all citizens, regardless of their geographical location.

## Key Features of the Initiative

The new healthcare program encompasses several innovative components designed to tackle the unique challenges faced by rural healthcare systems:

### Mobile Medical Units
The initiative will deploy state-of-the-art mobile medical units equipped with modern diagnostic equipment and staffed by qualified healthcare professionals. These units will travel to remote villages on a scheduled basis, providing essential medical services directly to communities that have traditionally struggled with healthcare access.

### Telemedicine Infrastructure
A robust telemedicine network will be established, connecting rural health centers with major hospitals in urban areas. This technology-driven approach will enable remote consultations, specialist opinions, and emergency medical guidance, effectively bridging the gap between rural and urban healthcare capabilities.

### Training and Capacity Building
The program includes comprehensive training modules for local healthcare workers, focusing on preventive care, basic treatment protocols, and emergency response procedures. This investment in human resources aims to build sustainable healthcare capacity within rural communities.

## Implementation Timeline

The rollout of this initiative will occur in three phases:

**Phase 1 (Months 1-6):** Pilot implementation in 100 selected villages across 10 states
**Phase 2 (Months 7-18):** Expansion to 500 villages across 20 states
**Phase 3 (Months 19-36):** Full nationwide implementation covering 2,000 rural communities

## Expected Impact

Healthcare experts predict that this initiative could significantly improve health outcomes in rural areas. Dr. Priya Sharma, a public health specialist, commented: "This program addresses the fundamental challenges of healthcare delivery in rural India. The combination of mobile units, telemedicine, and local capacity building creates a sustainable model for long-term improvement."

The government has allocated ₹5,000 crores for the initial three-year implementation period, with provisions for additional funding based on program effectiveness and expansion needs.

## Community Response

Initial reactions from rural communities have been overwhelmingly positive. Village leaders and local representatives have expressed enthusiasm for the program, particularly highlighting the potential for improved maternal and child healthcare services.

This initiative represents a significant milestone in India's journey toward universal healthcare coverage and demonstrates the government's commitment to addressing healthcare inequities across the nation.
  `,
  url: "https://pib.gov.in/healthcare-initiative-2024",
  language: "English",
  author: "PIB Health Correspondent",
  publishedDate: "2024-01-15T10:30:00Z",
  crawledDate: "2024-01-15T10:35:00Z",
  sourceName: "PIB India",
  department: "Ministry of Health and Family Welfare",
  sentiment: "positive",
  sentimentScore: 0.85,
  sentimentConfidence: 0.92,
  keywords: ["healthcare", "rural", "government", "initiative", "telemedicine", "mobile units"],
  entities: [
    { text: "Ministry of Health and Family Welfare", type: "organization" },
    { text: "Dr. Priya Sharma", type: "person" },
    { text: "India", type: "location" },
    { text: "₹5,000 crores", type: "money" }
  ],
  readTime: "5 min read",
  wordCount: 487,
  relatedArticles: [
    { id: 2, title: "Rural Healthcare Infrastructure Development Program", sentiment: "positive" },
    { id: 3, title: "Telemedicine Adoption in Remote Areas Shows Promise", sentiment: "positive" },
    { id: 4, title: "Healthcare Budget Allocation for Rural Development", sentiment: "neutral" }
  ]
}

export function ArticleDetail() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/news/${id}`)
        if (res.ok) {
          const data = await res.json()
          setArticle(data)
        }
        setLoading(false)
      } catch (err) {
        console.error('Failed to fetch article', err)
        setLoading(false)
      }
    }
    fetchArticle()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground mb-2">Article not found</h2>
        <p className="text-muted-foreground mb-4">The article you're looking for doesn't exist.</p>
        <Link to="/news">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Button>
        </Link>
      </div>
    )
  }

  const getSentimentIcon = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  const getSentimentColor = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeAgo = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center space-x-4">
        <Link to="/news">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Button>
        </Link>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Bookmark className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Flag className="w-4 h-4 mr-2" />
            Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Article Header */}
          <Card>
            <CardContent className="p-6">
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="outline">{article.detected_language || article.original_language || 'Unknown'}</Badge>
                <Badge variant="outline">{article.department}</Badge>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getSentimentColor(article.sentiment)}`}>
                  {getSentimentIcon(article.sentiment)}
                  <span className="capitalize">{article.sentiment}</span>
                </div>
                <Badge variant="secondary">{article.readTime}</Badge>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-foreground mb-4 leading-tight">
                {article.title}
              </h1>

              {/* Summary */}
              {article.translated_content && (
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {article.translated_content.substring(0, 300)}...
                </p>
              )}

              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                {article.authors && article.authors.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{article.authors.join(', ')}</span>
                  </div>
                )}
                {article.source_url && (
                  <div className="flex items-center space-x-1">
                    <Globe className="w-4 h-4" />
                    <span>{new URL(article.source_url).hostname}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(article.created_at)}</span>
                </div>
              </div>

              {/* Source Link */}
              {article.source_url && (
                <div className="mb-6">
                  <Button variant="outline" asChild>
                    <a href={article.source_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Original Source
                    </a>
                  </Button>
                </div>
              )}

              <Separator />
            </CardContent>
          </Card>

          {/* Article Content */}
          <Card>
            <CardContent className="p-6">
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {article.translated_content || article.content}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Keywords removed - not in backend response */}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Sentiment Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sentiment Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full border ${getSentimentColor(article.sentiment)}`}>
                    {getSentimentIcon(article.sentiment)}
                    <span className="font-medium capitalize">{article.sentiment}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sentiment Score</span>
                    <span className="font-medium">{Math.round(article.sentimentScore * 100)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        article.sentiment === 'positive' ? 'bg-green-500' :
                        article.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${article.sentimentScore * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Confidence</span>
                    <span className="font-medium">{article.department_score != null ? Math.round(article.department_score * 100) + '%' : '—'}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${(article.department_score || 0) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Article Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Article Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Word Count</span>
                  <span className="font-medium">{article.wordCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reading Time</span>
                  <span className="font-medium">{article.readTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Language</span>
                  <span className="font-medium">{article.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Published</span>
                  <span className="font-medium">{getTimeAgo(article.publishedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Crawled</span>
                  <span className="font-medium">{getTimeAgo(article.crawledDate)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Related Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {article.relatedArticles.map((related) => (
                  <Link key={related.id} to={`/news/${related.id}`}>
                    <div className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-foreground line-clamp-2 flex-1">
                          {related.title}
                        </p>
                        <div className={`ml-2 px-2 py-1 rounded text-xs border ${getSentimentColor(related.sentiment)}`}>
                          {related.sentiment}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

