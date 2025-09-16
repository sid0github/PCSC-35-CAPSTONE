import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Calendar, 
  Globe, 
  Building, 
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Eye,
  Clock,
  User
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Mock data for news articles
const mockArticles = [
  {
    id: 1,
    title: "Government Announces New Healthcare Initiative for Rural Areas",
    summary: "The Ministry of Health and Family Welfare has launched a comprehensive healthcare program targeting rural communities across India...",
    content: "Full article content here...",
    url: "https://example.com/article1",
    language: "English",
    author: "PIB Correspondent",
    publishedDate: "2024-01-15T10:30:00Z",
    crawledDate: "2024-01-15T10:35:00Z",
    sourceName: "PIB India",
    department: "Ministry of Health and Family Welfare",
    sentiment: "positive",
    sentimentScore: 0.85,
    sentimentConfidence: 0.92,
    keywords: ["healthcare", "rural", "government", "initiative"],
    readTime: "3 min read"
  },
  {
    id: 2,
    title: "Defence Budget Allocation Faces Parliamentary Scrutiny",
    summary: "Opposition parties have raised concerns about the proposed defence budget allocation for the upcoming fiscal year...",
    content: "Full article content here...",
    url: "https://example.com/article2",
    language: "English",
    author: "News Reporter",
    publishedDate: "2024-01-15T09:15:00Z",
    crawledDate: "2024-01-15T09:20:00Z",
    sourceName: "The Hindu",
    department: "Ministry of Defence",
    sentiment: "negative",
    sentimentScore: 0.25,
    sentimentConfidence: 0.78,
    keywords: ["defence", "budget", "parliament", "scrutiny"],
    readTime: "5 min read"
  },
  {
    
    id: 3,
    title: "Education Sector Reforms Show Promising Results",
    summary: "Recent data indicates significant improvements in literacy rates and educational outcomes following the implementation of new policies...",
    content: "Full article content here...",
    url: "https://example.com/article3",
    language: "Hindi",
    author: "शिक्षा संवाददाता",
    publishedDate: "2024-01-15T08:45:00Z",
    crawledDate: "2024-01-15T08:50:00Z",
    sourceName: "Dainik Bhaskar",
    department: "Ministry of Education",
    sentiment: "positive",
    sentimentScore: 0.78,
    sentimentConfidence: 0.85,
    keywords: ["education", "reforms", "literacy", "improvement"],
    readTime: "4 min read"
  },
  {
    id: 4,
    title: "Railway Infrastructure Development Project Delayed",
    summary: "The ambitious railway modernization project faces delays due to land acquisition issues and environmental clearances...",
    content: "Full article content here...",
    url: "https://example.com/article4",
    language: "English",
    author: "Transport Correspondent",
    publishedDate: "2024-01-15T07:20:00Z",
    crawledDate: "2024-01-15T07:25:00Z",
    sourceName: "Indian Express",
    department: "Ministry of Railways",
    sentiment: "neutral",
    sentimentScore: 0.45,
    sentimentConfidence: 0.72,
    keywords: ["railway", "infrastructure", "delay", "development"],
    readTime: "6 min read"
  },
  {
    id: 5,
    title: "Digital India Initiative Reaches New Milestone",
    summary: "The government's digital transformation program has successfully connected over 1 million villages with high-speed internet...",
    content: "Full article content here...",
    url: "https://example.com/article5",
    language: "English",
    author: "Tech Reporter",
    publishedDate: "2024-01-15T06:00:00Z",
    crawledDate: "2024-01-15T06:05:00Z",
    sourceName: "Times of India",
    department: "Ministry of Electronics and Information Technology",
    sentiment: "positive",
    sentimentScore: 0.92,
    sentimentConfidence: 0.95,
    keywords: ["digital", "internet", "villages", "milestone"],
    readTime: "3 min read"
  }
]

const departments = [
  "All Departments",
  "Ministry of Health and Family Welfare",
  "Ministry of Defence",
  "Ministry of Education",
  "Ministry of Railways",
  "Ministry of Electronics and Information Technology",
  "Ministry of Finance",
  "Ministry of Agriculture",
  "Ministry of Home Affairs"
]

const languages = [
  "All Languages",
  "English",
  "Hindi",
  "Bengali",
  "Telugu",
  "Tamil",
  "Marathi",
  "Gujarati"
]

const sentiments = [
  "All Sentiments",
  "Positive",
  "Neutral", 
  "Negative"
]

export function NewsArticles() {
  const [articles, setArticles] = useState(mockArticles)
  const [filteredArticles, setFilteredArticles] = useState(mockArticles)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments')
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages')
  const [selectedSentiment, setSelectedSentiment] = useState('All Sentiments')
  const [sortBy, setSortBy] = useState('publishedDate')
  const [sortOrder, setSortOrder] = useState('desc')

  useEffect(() => {
    filterArticles()
  }, [searchQuery, selectedDepartment, selectedLanguage, selectedSentiment, sortBy, sortOrder])

  const filterArticles = () => {
    let filtered = [...articles]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    // Department filter
    if (selectedDepartment !== 'All Departments') {
      filtered = filtered.filter(article => article.department === selectedDepartment)
    }

    // Language filter
    if (selectedLanguage !== 'All Languages') {
      filtered = filtered.filter(article => article.language === selectedLanguage)
    }

    // Sentiment filter
    if (selectedSentiment !== 'All Sentiments') {
      filtered = filtered.filter(article => 
        article.sentiment.toLowerCase() === selectedSentiment.toLowerCase()
      )
    }

    // Sort articles
    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === 'publishedDate' || sortBy === 'crawledDate') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredArticles(filtered)
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
      month: 'short',
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">News Articles</h1>
          <p className="text-muted-foreground">
            Browse and analyze news articles from {articles.length} sources
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {filteredArticles.length} articles
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Department Filter */}
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <Building className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Language Filter */}
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sentiment Filter */}
            <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
              <SelectTrigger>
                <TrendingUp className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sentiment" />
              </SelectTrigger>
              <SelectContent>
                {sentiments.map((sentiment) => (
                  <SelectItem key={sentiment} value={sentiment}>
                    {sentiment}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-4 mt-4">
            <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="publishedDate">Published Date</SelectItem>
                <SelectItem value="crawledDate">Crawled Date</SelectItem>
                <SelectItem value="sentimentScore">Sentiment Score</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Article Header */}
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {article.language}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {article.department}
                    </Badge>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getSentimentColor(article.sentiment)}`}>
                      {getSentimentIcon(article.sentiment)}
                      <span className="capitalize">{article.sentiment}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <Link 
                    to={`/news/${article.id}`}
                    className="block group"
                  >
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>

                  {/* Summary */}
                  <p className="text-muted-foreground mt-2 line-clamp-2">
                    {article.summary}
                  </p>

                  {/* Keywords */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {article.keywords.slice(0, 4).map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                    {article.keywords.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{article.keywords.length - 4} more
                      </Badge>
                    )}
                  </div>

                  {/* Article Meta */}
                  <div className="flex items-center space-x-4 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Globe className="w-4 h-4" />
                      <span>{article.sourceName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(article.publishedDate)}</span>
                    </div>
                    <span>{article.readTime}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end space-y-2 ml-4">
                  <div className="text-sm text-muted-foreground">
                    {getTimeAgo(article.publishedDate)}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link to={`/news/${article.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    
                    {article.url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Source
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Sentiment Score */}
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Confidence</div>
                    <div className="text-sm font-medium">
                      {Math.round(article.sentimentConfidence * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {filteredArticles.length > 0 && (
        <div className="text-center">
          <Button variant="outline">
            Load More Articles
          </Button>
        </div>
      )}

      {/* No Results */}
      {filteredArticles.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No articles found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters to find more articles.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

