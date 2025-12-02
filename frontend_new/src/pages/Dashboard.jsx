import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Newspaper, 
  Globe, 
  AlertTriangle,
  Activity,
  Clock,
  Users
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'

const sentimentData = [
  { name: 'Positive', value: 45, color: '#22c55e' },
  { name: 'Neutral', value: 35, color: '#64748b' },
  { name: 'Negative', value: 20, color: '#ef4444' }
]

const departmentData = [
  { name: 'Health', articles: 156, sentiment: 'positive' },
  { name: 'Defence', articles: 89, sentiment: 'neutral' },
  { name: 'Finance', articles: 134, sentiment: 'negative' },
  { name: 'Education', articles: 78, sentiment: 'positive' },
  { name: 'Agriculture', articles: 92, sentiment: 'neutral' },
  { name: 'Railways', articles: 67, sentiment: 'positive' }
]

const trendData = [
  { time: '00:00', positive: 12, neutral: 8, negative: 3 },
  { time: '04:00', positive: 15, neutral: 12, negative: 5 },
  { time: '08:00', positive: 28, neutral: 18, negative: 8 },
  { time: '12:00', positive: 45, neutral: 25, negative: 12 },
  { time: '16:00', positive: 38, neutral: 22, negative: 15 },
  { time: '20:00', positive: 32, neutral: 19, negative: 9 }
]

const languageData = [
  { language: 'Hindi', articles: 342, percentage: 28 },
  { language: 'English', articles: 298, percentage: 24 },
  { language: 'Bengali', articles: 156, percentage: 13 },
  { language: 'Telugu', articles: 134, percentage: 11 },
  { language: 'Tamil', articles: 123, percentage: 10 },
  { language: 'Others', articles: 167, percentage: 14 }
]

const recentAlerts = [
  {
    id: 1,
    title: "Negative sentiment spike in Health Ministry coverage",
    department: "Health",
    severity: "high",
    time: "2 minutes ago",
    articles: 5
  },
  {
    id: 2,
    title: "Unusual activity detected in Defence news",
    department: "Defence", 
    severity: "medium",
    time: "15 minutes ago",
    articles: 3
  },
  {
    id: 3,
    title: "Positive trend in Education sector",
    department: "Education",
    severity: "low",
    time: "1 hour ago",
    articles: 8
  }
]

export function Dashboard() {
  const [stats, setStats] = useState({
    totalArticles: 0,
    todayArticles: 0,
    activeSources: 0,
    alertsToday: 0,
    sentimentScore: 0,
    processingRate: 0
  })
  const [sentimentData, setSentimentData] = useState([])
  const [departmentData, setDepartmentData] = useState([])
  const [languageData, setLanguageData] = useState([])

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/analytics?days=30')
        if (res.ok) {
          const data = await res.json()
          
          // Calculate sentiment score (weighted avg)
          const sd = data.sentiment_distribution || {}
          const total = Object.values(sd).reduce((a, b) => a + b, 0)
          let sentScore = 0
          if (total > 0) {
            const pos = sd.positive || sd.Positive || 0
            const neu = sd.neutral || sd.Neutral || 0
            const neg = sd.negative || sd.Negative || 0
            sentScore = Math.round(((pos * 1 + neu * 0.5 + neg * 0) / total) * 100)
          }
          
          setStats({
            totalArticles: data.total_articles || 0,
            todayArticles: 0,
            activeSources: 0,
            alertsToday: data.recent_alerts || 0,
            sentimentScore: sentScore,
            processingRate: 0
          })
          
          // Map sentiment distribution to chart data
          const sentMap = { positive: '#22c55e', neutral: '#64748b', negative: '#ef4444', Positive: '#22c55e', Neutral: '#64748b', Negative: '#ef4444' }
          const sentData = Object.entries(sd).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
            value: Math.round((value / total) * 100),
            color: sentMap[name] || '#64748b'
          }))
          setSentimentData(sentData.length > 0 ? sentData : [
            { name: 'No Data', value: 100, color: '#64748b' }
          ])
          
          // Map department distribution
          setDepartmentData(
            Object.entries(data.department_distribution || {}).map(([name, articles]) => ({
              name,
              articles,
              sentiment: 'neutral'
            }))
          )
          
          // Map language distribution
          const langTotal = Object.values(data.language_distribution || {}).reduce((a, b) => a + b, 0)
          setLanguageData(
            Object.entries(data.language_distribution || {}).map(([language, articles]) => ({
              language,
              articles,
              percentage: langTotal > 0 ? Math.round((articles / langTotal) * 100) : 0
            }))
          )
        }
      } catch (err) {
        console.error('Failed to fetch dashboard', err)
      }
    }
    fetchDashboard()
  }, [])

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time overview of news monitoring and sentiment analysis
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Activity className="w-3 h-3 mr-1" />
            System Active
          </Badge>
          <Button variant="outline" size="sm">
            <Clock className="w-4 h-4 mr-2" />
            Last updated: 2 min ago
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArticles.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats.todayArticles}</span> today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sources</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSources}</div>
            <p className="text-xs text-muted-foreground">
              Across 14 languages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts Today</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.alertsToday}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">3 high priority</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sentiment Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sentimentScore}%</div>
            <Progress value={stats.sentimentScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
            <CardDescription>
              Current sentiment breakdown across all articles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              {sentimentData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hourly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>24-Hour Sentiment Trends</CardTitle>
            <CardDescription>
              Sentiment analysis trends over the last 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="positive" 
                    stackId="1"
                    stroke="#22c55e" 
                    fill="#22c55e" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="neutral" 
                    stackId="1"
                    stroke="#64748b" 
                    fill="#64748b" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="negative" 
                    stackId="1"
                    stroke="#ef4444" 
                    fill="#ef4444" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Analysis and Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Analysis */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Department-wise Analysis</CardTitle>
            <CardDescription>
              Article count and sentiment by government department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="articles" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>
              Latest system alerts and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                  <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                    alert.severity === 'high' ? 'text-red-500' :
                    alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {alert.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {alert.department}
                      </Badge>
                      <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert.articles} articles • {alert.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Alerts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Language Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Language Distribution</CardTitle>
          <CardDescription>
            News coverage across different Indian languages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {languageData.map((lang) => (
              <div key={lang.language} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium text-foreground">{lang.language}</p>
                  <p className="text-sm text-muted-foreground">{lang.articles} articles</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">{lang.percentage}%</p>
                  <Progress value={lang.percentage} className="w-16 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

