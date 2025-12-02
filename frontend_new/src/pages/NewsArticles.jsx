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

const mockArticles = []

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
  const [articles, setArticles] = useState([])
  const [filteredArticles, setFilteredArticles] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments')
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages')
  const [selectedSentiment, setSelectedSentiment] = useState('All Sentiments')
  const [sortBy, setSortBy] = useState('publishedDate')
  const [sortOrder, setSortOrder] = useState('desc')

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const params = new URLSearchParams()
        if (selectedLanguage !== 'All Languages') {
          const languageCodeMap = { English: 'en', Hindi: 'hi', Bengali: 'bn', Telugu: 'te', Tamil: 'ta', Marathi: 'mr', Gujarati: 'gu' }
          params.set('language', languageCodeMap[selectedLanguage] || selectedLanguage)
        }
        if (selectedSentiment !== 'All Sentiments') {
          params.set('sentiment', selectedSentiment)
        }
        if (selectedDepartment !== 'All Departments') {
          params.set('department', selectedDepartment)
        }
        const res = await fetch(`http://localhost:8000/api/news?${params.toString()}`)
        if (res.ok) {
          const data = await res.json()
          console.log('Fetched articles:', data)
          setArticles(data)
        }
      } catch (err) {
        console.error('Failed to fetch news', err)
      }
    }
    fetchArticles()
  }, [selectedDepartment, selectedLanguage, selectedSentiment])

  useEffect(() => {
    filterArticles()
  }, [articles, searchQuery, sortBy, sortOrder])

  const filterArticles = () => {
    let filtered = [...articles]

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(article =>
        (article.title || '').toLowerCase().includes(q) ||
        (article.translated_content || article.content || '').toLowerCase().includes(q)
      )
    }

    // Server-side filters are applied during fetch; client-side keeps only search and sort.

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
                      {(article.detected_language || article.original_language || 'Unknown')}
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
                    {(article.translated_content || article.content || '').slice(0, 160)}
                  </p>

                  {/* Article Meta */}
                  <div className="flex items-center space-x-4 mt-4 text-sm text-muted-foreground">
                    {article.authors && article.authors.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{article.authors.join(', ')}</span>
                      </div>
                    )}
                    {article.source_url && (
                      <div className="flex items-center space-x-1">
                        <Globe className="w-4 h-4" />
                        <span>{article.source_url}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(article.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end space-y-2 ml-4">
                  <div className="text-sm text-muted-foreground">
                    {getTimeAgo(article.created_at)}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link to={`/news/${article.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    
                    {article.source_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={article.source_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Source
                        </a>
                      </Button>
                    )}
                  </div>

                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Score</div>
                    <div className="text-sm font-medium">
                      {article.sentiment_score != null ? Math.round(article.sentiment_score * 100) + '%' : '—'}
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

