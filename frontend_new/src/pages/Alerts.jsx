import { useState } from 'react'
import { 
  AlertTriangle, 
  Bell, 
  Clock, 
  CheckCircle, 
  XCircle,
  Mail,
  MessageSquare,
  Smartphone,
  Filter,
  Search,
  Eye,
  MoreHorizontal
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

// Mock data for alerts
const mockAlerts = [
  {
    id: 1,
    title: "High negative sentiment detected in Health Ministry coverage",
    description: "Multiple articles about healthcare policy showing strong negative sentiment",
    severity: "critical",
    department: "Ministry of Health and Family Welfare",
    articleCount: 8,
    sentimentScore: 0.15,
    createdAt: "2024-01-15T14:30:00Z",
    status: "active",
    recipients: ["health@pib.gov.in", "+91-9876543210"],
    deliveryStatus: "sent",
    channels: ["email", "sms"],
    relatedArticles: [
      { id: 101, title: "Healthcare Budget Cuts Spark Controversy" },
      { id: 102, title: "Medical Staff Shortage Reaches Critical Level" }
    ]
  },
  {
    id: 2,
    title: "Unusual spike in Defence-related negative coverage",
    description: "Increased negative sentiment in defence sector news articles",
    severity: "high",
    department: "Ministry of Defence",
    articleCount: 5,
    sentimentScore: 0.25,
    createdAt: "2024-01-15T13:15:00Z",
    status: "acknowledged",
    recipients: ["defence@pib.gov.in"],
    deliveryStatus: "delivered",
    channels: ["email"],
    relatedArticles: [
      { id: 103, title: "Defence Procurement Delays Under Scrutiny" }
    ]
  },
  {
    id: 3,
    title: "Positive trend in Education sector coverage",
    description: "Significant improvement in education-related news sentiment",
    severity: "low",
    department: "Ministry of Education",
    articleCount: 12,
    sentimentScore: 0.85,
    createdAt: "2024-01-15T12:00:00Z",
    status: "resolved",
    recipients: ["education@pib.gov.in"],
    deliveryStatus: "delivered",
    channels: ["email"],
    relatedArticles: [
      { id: 104, title: "New Education Policy Shows Promising Results" },
      { id: 105, title: "Digital Learning Initiative Gains Momentum" }
    ]
  },
  {
    id: 4,
    title: "Railway infrastructure project coverage analysis",
    description: "Mixed sentiment detected in railway development news",
    severity: "medium",
    department: "Ministry of Railways",
    articleCount: 6,
    sentimentScore: 0.45,
    createdAt: "2024-01-15T11:30:00Z",
    status: "active",
    recipients: ["railways@pib.gov.in", "+91-9876543211"],
    deliveryStatus: "pending",
    channels: ["email", "sms"],
    relatedArticles: [
      { id: 106, title: "High-Speed Rail Project Faces Delays" }
    ]
  },
  {
    id: 5,
    title: "Technology sector positive momentum",
    description: "Strong positive sentiment in IT and digital initiatives",
    severity: "low",
    department: "Ministry of Electronics and Information Technology",
    articleCount: 9,
    sentimentScore: 0.92,
    createdAt: "2024-01-15T10:45:00Z",
    status: "resolved",
    recipients: ["meity@pib.gov.in"],
    deliveryStatus: "delivered",
    channels: ["email"],
    relatedArticles: [
      { id: 107, title: "Digital India Initiative Reaches New Milestone" }
    ]
  }
]

const severityConfig = {
  critical: {
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: AlertTriangle,
    iconColor: 'text-red-500'
  },
  high: {
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: AlertTriangle,
    iconColor: 'text-orange-500'
  },
  medium: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Bell,
    iconColor: 'text-yellow-500'
  },
  low: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Bell,
    iconColor: 'text-blue-500'
  }
}

const statusConfig = {
  active: {
    color: 'bg-red-100 text-red-800',
    label: 'Active'
  },
  acknowledged: {
    color: 'bg-yellow-100 text-yellow-800',
    label: 'Acknowledged'
  },
  resolved: {
    color: 'bg-green-100 text-green-800',
    label: 'Resolved'
  }
}

export function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [filteredAlerts, setFilteredAlerts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSeverity, setSelectedSeverity] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedAlert, setSelectedAlert] = useState(null)

  useEffect(() => {
    // Alerts come from alert_history table - backend doesn't expose this yet
    // Show empty state for now
    setAlerts([])
    setFilteredAlerts([])
  }, [])

  const filterAlerts = () => {
    let filtered = [...alerts]

    if (searchQuery) {
      filtered = filtered.filter(alert =>
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.department.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === selectedSeverity)
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(alert => alert.status === selectedStatus)
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(alert => alert.department === selectedDepartment)
    }

    setFilteredAlerts(filtered)
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

  const updateAlertStatus = (alertId, newStatus) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, status: newStatus } : alert
    ))
    filterAlerts()
  }

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'email':
        return <Mail className="w-4 h-4" />
      case 'sms':
        return <MessageSquare className="w-4 h-4" />
      case 'push':
        return <Smartphone className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  React.useEffect(() => {
    filterAlerts()
  }, [searchQuery, selectedSeverity, selectedStatus, selectedDepartment])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alerts & Notifications</h1>
          <p className="text-muted-foreground">
            Monitor and manage system alerts and notifications
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-red-600 border-red-600">
            {filteredAlerts.filter(a => a.status === 'active').length} Active
          </Badge>
          <Badge variant="outline">
            {filteredAlerts.length} Total
          </Badge>
        </div>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {alerts.filter(a => a.severity === 'critical').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {alerts.filter(a => a.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {alerts.filter(a => a.status === 'resolved').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully handled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">12m</div>
            <p className="text-xs text-muted-foreground">
              Average response time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search alerts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Severity Filter */}
            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger>
                <AlertTriangle className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>

            {/* Department Filter */}
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Ministry of Health and Family Welfare">Health</SelectItem>
                <SelectItem value="Ministry of Defence">Defence</SelectItem>
                <SelectItem value="Ministry of Education">Education</SelectItem>
                <SelectItem value="Ministry of Railways">Railways</SelectItem>
                <SelectItem value="Ministry of Electronics and Information Technology">IT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const severityInfo = severityConfig[alert.severity]
          const statusInfo = statusConfig[alert.status]
          const SeverityIcon = severityInfo.icon

          return (
            <Card key={alert.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Severity Icon */}
                    <div className={`p-2 rounded-full ${severityInfo.color}`}>
                      <SeverityIcon className={`w-5 h-5 ${severityInfo.iconColor}`} />
                    </div>

                    {/* Alert Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={severityInfo.color}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <Badge className={statusInfo.color}>
                          {statusInfo.label}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {getTimeAgo(alert.createdAt)}
                        </span>
                      </div>

                      {/* Title and Description */}
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {alert.title}
                      </h3>
                      <p className="text-muted-foreground mb-3">
                        {alert.description}
                      </p>

                      {/* Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-foreground">Department:</span>
                          <p className="text-muted-foreground">{alert.department}</p>
                        </div>
                        <div>
                          <span className="font-medium text-foreground">Articles:</span>
                          <p className="text-muted-foreground">{alert.articleCount} articles</p>
                        </div>
                        <div>
                          <span className="font-medium text-foreground">Sentiment Score:</span>
                          <p className="text-muted-foreground">
                            {Math.round(alert.sentimentScore * 100)}%
                          </p>
                        </div>
                      </div>

                      {/* Delivery Info */}
                      <div className="flex items-center space-x-4 mt-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-foreground">Sent via:</span>
                          <div className="flex items-center space-x-1">
                            {alert.channels.map((channel, index) => (
                              <div key={index} className="flex items-center space-x-1">
                                {getChannelIcon(channel)}
                                <span className="text-sm text-muted-foreground capitalize">
                                  {channel}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <Badge variant={alert.deliveryStatus === 'delivered' ? 'default' : 'secondary'}>
                          {alert.deliveryStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{alert.title}</DialogTitle>
                          <DialogDescription>
                            Alert details and related articles
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Description</h4>
                            <p className="text-muted-foreground">{alert.description}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Related Articles</h4>
                            <div className="space-y-2">
                              {alert.relatedArticles.map((article) => (
                                <div key={article.id} className="p-3 border rounded-lg">
                                  <p className="font-medium">{article.title}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Article ID: {article.id}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Recipients</h4>
                            <div className="flex flex-wrap gap-2">
                              {alert.recipients.map((recipient, index) => (
                                <Badge key={index} variant="outline">
                                  {recipient}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {alert.status === 'active' && (
                          <DropdownMenuItem onClick={() => updateAlertStatus(alert.id, 'acknowledged')}>
                            Mark as Acknowledged
                          </DropdownMenuItem>
                        )}
                        {alert.status !== 'resolved' && (
                          <DropdownMenuItem onClick={() => updateAlertStatus(alert.id, 'resolved')}>
                            Mark as Resolved
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          Resend Notification
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete Alert
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* No Results */}
      {filteredAlerts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No alerts found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters to find more alerts.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

