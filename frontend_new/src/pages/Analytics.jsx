import { useState, useEffect } from 'react'
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
  AreaChart,
  ComposedChart
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  Filter
} from 'lucide-react'

// Mock data for analytics
const sentimentTrends = [
  { date: '2024-01-01', positive: 45, neutral: 35, negative: 20 },
  { date: '2024-01-02', positive: 48, neutral: 32, negative: 20 },
  { date: '2024-01-03', positive: 42, neutral: 38, negative: 20 },
  { date: '2024-01-04', positive: 50, neutral: 30, negative: 20 },
  { date: '2024-01-05', positive: 46, neutral: 34, negative: 20 },
  { date: '2024-01-06', positive: 52, neutral: 28, negative: 20 },
  { date: '2024-01-07', positive: 49, neutral: 31, negative: 20 }
]

const departmentAnalysis = [
  { department: 'Health', positive: 156, neutral: 89, negative: 34, total: 279 },
  { department: 'Defence', positive: 98, neutral: 145, negative: 67, total: 310 },
  { department: 'Education', positive: 134, neutral: 78, negative: 23, total: 235 },
  { department: 'Finance', positive: 87, neutral: 123, negative: 89, total: 299 },
  { department: 'Agriculture', positive: 112, neutral: 67, negative: 45, total: 224 },
  { department: 'Railways', positive: 78, neutral: 89, negative: 34, total: 201 }
]

const languageDistribution = [
  { language: 'Hindi', articles: 342, percentage: 28, color: '#3b82f6' },
  { language: 'English', articles: 298, percentage: 24, color: '#10b981' },
  { language: 'Bengali', articles: 156, percentage: 13, color: '#f59e0b' },
  { language: 'Telugu', articles: 134, percentage: 11, color: '#ef4444' },
  { language: 'Tamil', articles: 123, percentage: 10, color: '#8b5cf6' },
  { language: 'Marathi', articles: 89, percentage: 7, color: '#06b6d4' },
  { language: 'Others', articles: 88, percentage: 7, color: '#64748b' }
]

const sourceAnalysis = [
  { source: 'PIB India', articles: 234, sentiment: 0.78, reliability: 0.95 },
  { source: 'The Hindu', articles: 189, sentiment: 0.65, reliability: 0.92 },
  { source: 'Times of India', articles: 167, sentiment: 0.58, reliability: 0.88 },
  { source: 'Indian Express', articles: 145, sentiment: 0.62, reliability: 0.90 },
  { source: 'Hindustan Times', articles: 134, sentiment: 0.55, reliability: 0.87 },
  { source: 'Dainik Bhaskar', articles: 123, sentiment: 0.72, reliability: 0.85 }
]

const hourlyActivity = [
  { hour: '00', articles: 12, sentiment: 0.6 },
  { hour: '01', articles: 8, sentiment: 0.7 },
  { hour: '02', articles: 5, sentiment: 0.8 },
  { hour: '03', articles: 3, sentiment: 0.9 },
  { hour: '04', articles: 7, sentiment: 0.7 },
  { hour: '05', articles: 15, sentiment: 0.6 },
  { hour: '06', articles: 28, sentiment: 0.65 },
  { hour: '07', articles: 45, sentiment: 0.7 },
  { hour: '08', articles: 67, sentiment: 0.68 },
  { hour: '09', articles: 89, sentiment: 0.72 },
  { hour: '10', articles: 123, sentiment: 0.75 },
  { hour: '11', articles: 145, sentiment: 0.73 },
  { hour: '12', articles: 167, sentiment: 0.7 },
  { hour: '13', articles: 156, sentiment: 0.68 },
  { hour: '14', articles: 134, sentiment: 0.65 },
  { hour: '15', articles: 123, sentiment: 0.67 },
  { hour: '16', articles: 112, sentiment: 0.69 },
  { hour: '17', articles: 98, sentiment: 0.71 },
  { hour: '18', articles: 87, sentiment: 0.73 },
  { hour: '19', articles: 76, sentiment: 0.75 },
  { hour: '20', articles: 65, sentiment: 0.72 },
  { hour: '21', articles: 54, sentiment: 0.7 },
  { hour: '22', articles: 43, sentiment: 0.68 },
  { hour: '23', articles: 32, sentiment: 0.65 }
]

const keywordTrends = [
  { keyword: 'healthcare', mentions: 234, trend: 'up', change: 15 },
  { keyword: 'economy', mentions: 189, trend: 'down', change: -8 },
  { keyword: 'education', mentions: 167, trend: 'up', change: 22 },
  { keyword: 'infrastructure', mentions: 145, trend: 'up', change: 12 },
  { keyword: 'technology', mentions: 134, trend: 'up', change: 18 },
  { keyword: 'agriculture', mentions: 123, trend: 'down', change: -5 }
]

export function Analytics() {
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('sentiment')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  const daysMap = { '1d': 1, '7d': 7, '30d': 30, '90d': 90 }

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        const res = await fetch(`http://localhost:8000/api/analytics?days=${daysMap[timeRange] || 30}`)
        if (res.ok) {
          const data = await res.json()
          console.log('Analytics data:', data)
          setAnalytics(data)
        }
      } catch (err) {
        console.error('Failed to fetch analytics', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [timeRange])

  const exportData = (format) => {
    // Implement export functionality
    console.log(`Exporting data in ${format} format`)
  }

  return (
    <div className="space-y-6">
      {loading && !analytics ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading analytics...</div>
        </div>
      ) : (
        <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive analysis of news sentiment and trends
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={() => exportData('csv')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Sentiment Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(() => { if (!analytics || !analytics.sentiment_distribution) return '0%'; const sd = analytics.sentiment_distribution; const total = Object.values(sd).reduce((a,b)=>a+b,0); if (!total) return '0%'; const pos = sd.positive || sd.Positive || 0; const neu = sd.neutral || sd.Neutral || 0; const neg = sd.negative || sd.Negative || 0; const score = ((pos*1 + neu*0.5 + neg*0) / total) * 100; return `${Math.round(score)}%`; })()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.3%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articles Analyzed</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics ? analytics.total_articles : '—'}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+156</span> today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negative Alerts</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics ? analytics.recent_alerts : '—'}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">+5</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coverage Score</CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics ? '0%' : '0%'}</div>
            <p className="text-xs text-muted-foreground">
              Across all departments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Distribution</CardTitle>
          <CardDescription>Across analyzed articles</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics && Object.keys(analytics.sentiment_distribution || {}).length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(analytics.sentiment_distribution).map(([name, value]) => ({ 
                      name: name.charAt(0).toUpperCase() + name.slice(1), 
                      value 
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="value"
                    label
                  >
                    {Object.entries(analytics.sentiment_distribution).map((entry, index) => {
                      const colors = { positive: '#22c55e', negative: '#ef4444', neutral: '#64748b' }
                      return <Cell key={`sent-${index}`} fill={colors[entry[0].toLowerCase()] || '#64748b'} />
                    })}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              No sentiment data available for the selected time range
            </div>
          )}
        </CardContent>
      </Card>

      {/* Department Analysis and Language Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Articles by Department</CardTitle>
            <CardDescription>Count per department</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics && Object.keys(analytics.department_distribution || {}).length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={Object.entries(analytics.department_distribution).map(([department, value]) => ({ department, value }))} 
                    layout="horizontal"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="department" type="category" width={120} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                No department data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Language Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Language Distribution</CardTitle>
            <CardDescription>Articles by language</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics && Object.keys(analytics.language_distribution || {}).length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(analytics.language_distribution).map(([language, value]) => ({ 
                        language: language || 'Unknown', 
                        value 
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {Object.entries(analytics.language_distribution).map((entry, index) => (
                        <Cell key={`lang-${index}`} fill={['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#64748b'][index % 7]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                No language data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Hourly Activity and Source Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Hourly Activity - Data not available from backend yet */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>24-Hour Activity Pattern</CardTitle>
          <CardDescription>
            Hourly analysis coming soon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No hourly data available yet
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Keyword Trends - Data not available from backend yet */}
      <Card>
        <CardHeader>
          <CardTitle>Trending Keywords</CardTitle>
          <CardDescription>
            Keyword analysis coming soon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center text-muted-foreground">
            No keyword trend data available yet
          </div>
        </CardContent>
      </Card>
        </>
      )}
    </div>
  )
}

