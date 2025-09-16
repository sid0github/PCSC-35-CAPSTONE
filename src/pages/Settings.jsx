import { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  Bell, 
  Globe, 
  Database, 
  Shield,
  Mail,
  MessageSquare,
  Smartphone,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  Edit
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function Settings() {
  const [settings, setSettings] = useState({
    // General Settings
    systemName: 'PIB News Monitoring System',
    refreshInterval: 60,
    maxArticlesPerCrawl: 20,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    alertThreshold: 0.4,
    
    // Crawling Settings
    crawlFrequency: 60,
    enableOCR: true,
    ocrLanguages: ['en', 'hi', 'bn'],
    
    // API Settings
    groqApiKey: '',
    googleVisionEnabled: false,
    twilioEnabled: true,
    
    // User Preferences
    defaultLanguage: 'en',
    timezone: 'Asia/Kolkata',
    theme: 'light'
  })

  const [newsSources, setNewsSources] = useState([
    { id: 1, name: 'PIB India', url: 'https://pib.gov.in', language: 'en', active: true },
    { id: 2, name: 'The Hindu', url: 'https://thehindu.com', language: 'en', active: true },
    { id: 3, name: 'Dainik Bhaskar', url: 'https://bhaskar.com', language: 'hi', active: true }
  ])

  const [departments, setDepartments] = useState([
    { id: 1, name: 'Ministry of Health and Family Welfare', code: 'MOHFW', active: true },
    { id: 2, name: 'Ministry of Defence', code: 'MOD', active: true },
    { id: 3, name: 'Ministry of Education', code: 'MOE', active: true }
  ])

  const [alertRules, setAlertRules] = useState([
    { 
      id: 1, 
      name: 'Critical Negative Sentiment', 
      condition: 'sentiment < 0.3', 
      department: 'all',
      recipients: ['admin@pib.gov.in'],
      active: true 
    },
    { 
      id: 2, 
      name: 'High Volume Health News', 
      condition: 'articles > 10 AND department = "Health"', 
      department: 'health',
      recipients: ['health@pib.gov.in'],
      active: true 
    }
  ])

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const saveSettings = () => {
    // Implement save functionality
    console.log('Saving settings:', settings)
  }

  const testConnection = (service) => {
    // Implement connection testing
    console.log(`Testing ${service} connection`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Configure system settings and preferences
          </p>
        </div>
        <Button onClick={saveSettings}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="sources">News Sources</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="api">API & Services</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SettingsIcon className="w-5 h-5" />
                <span>General Settings</span>
              </CardTitle>
              <CardDescription>
                Basic system configuration and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="systemName">System Name</Label>
                  <Input
                    id="systemName"
                    value={settings.systemName}
                    onChange={(e) => updateSetting('systemName', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refreshInterval">Refresh Interval (minutes)</Label>
                  <Input
                    id="refreshInterval"
                    type="number"
                    value={settings.refreshInterval}
                    onChange={(e) => updateSetting('refreshInterval', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxArticles">Max Articles per Crawl</Label>
                  <Input
                    id="maxArticles"
                    type="number"
                    value={settings.maxArticlesPerCrawl}
                    onChange={(e) => updateSetting('maxArticlesPerCrawl', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => updateSetting('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultLanguage">Default Language</Label>
                  <Select value={settings.defaultLanguage} onValueChange={(value) => updateSetting('defaultLanguage', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="bn">Bengali</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={settings.theme} onValueChange={(value) => updateSetting('theme', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Crawling Settings</CardTitle>
              <CardDescription>
                Configure web crawling and OCR processing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="crawlFrequency">Crawl Frequency (minutes)</Label>
                  <Input
                    id="crawlFrequency"
                    type="number"
                    value={settings.crawlFrequency}
                    onChange={(e) => updateSetting('crawlFrequency', parseInt(e.target.value))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableOCR"
                    checked={settings.enableOCR}
                    onCheckedChange={(checked) => updateSetting('enableOCR', checked)}
                  />
                  <Label htmlFor="enableOCR">Enable OCR Processing</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>OCR Languages</Label>
                <div className="flex flex-wrap gap-2">
                  {['en', 'hi', 'bn', 'te', 'ta', 'mr', 'gu'].map((lang) => (
                    <Badge
                      key={lang}
                      variant={settings.ocrLanguages.includes(lang) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        const newLanguages = settings.ocrLanguages.includes(lang)
                          ? settings.ocrLanguages.filter(l => l !== lang)
                          : [...settings.ocrLanguages, lang]
                        updateSetting('ocrLanguages', newLanguages)
                      }}
                    >
                      {lang.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Configure how and when you receive alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive alerts via SMS</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => updateSetting('smsNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alertThreshold">Alert Threshold (Sentiment Score)</Label>
                <Input
                  id="alertThreshold"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={settings.alertThreshold}
                  onChange={(e) => updateSetting('alertThreshold', parseFloat(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">
                  Trigger alerts when sentiment score falls below this threshold
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Rules</CardTitle>
              <CardDescription>
                Configure custom alert rules and conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{rule.name}</h4>
                        <Badge variant={rule.active ? 'default' : 'secondary'}>
                          {rule.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{rule.condition}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Recipients: {rule.recipients.join(', ')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Rule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* News Sources */}
        <TabsContent value="sources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>News Sources</span>
              </CardTitle>
              <CardDescription>
                Manage news sources for crawling and monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {newsSources.map((source) => (
                  <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{source.name}</h4>
                        <Badge variant="outline">{source.language.toUpperCase()}</Badge>
                        <Badge variant={source.active ? 'default' : 'secondary'}>
                          {source.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{source.url}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Source
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Departments */}
        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Government Departments</span>
              </CardTitle>
              <CardDescription>
                Manage government departments for classification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departments.map((dept) => (
                  <div key={dept.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{dept.name}</h4>
                        <Badge variant="outline">{dept.code}</Badge>
                        <Badge variant={dept.active ? 'default' : 'secondary'}>
                          {dept.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Department
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API & Services */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>API Keys & Services</span>
              </CardTitle>
              <CardDescription>
                Configure external API keys and service integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="groqApiKey">Groq API Key</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="groqApiKey"
                      type="password"
                      value={settings.groqApiKey}
                      onChange={(e) => updateSetting('groqApiKey', e.target.value)}
                      placeholder="Enter Groq API key"
                    />
                    <Button variant="outline" onClick={() => testConnection('groq')}>
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Google Vision API</Label>
                    <p className="text-sm text-muted-foreground">Enable Google Vision for OCR</p>
                  </div>
                  <Switch
                    checked={settings.googleVisionEnabled}
                    onCheckedChange={(checked) => updateSetting('googleVisionEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Twilio SMS Service</Label>
                    <p className="text-sm text-muted-foreground">Enable SMS notifications via Twilio</p>
                  </div>
                  <Switch
                    checked={settings.twilioEnabled}
                    onCheckedChange={(checked) => updateSetting('twilioEnabled', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Status</CardTitle>
              <CardDescription>
                Current status of integrated services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Database Connection</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Groq API</span>
                  <Badge variant="secondary">Not Configured</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Google Vision API</span>
                  <Badge variant="secondary">Disabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Twilio SMS</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

