import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Newspaper, 
  BarChart3, 
  Bell, 
  Settings, 
  X,
  Activity,
  Globe,
  Shield,
  Send
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'News Articles', href: '/news', icon: Newspaper },
  { name: 'Submit News', href: '/submit-news', icon: Send },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Alerts', href: '/alerts', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-sidebar-foreground">PIB Monitor</h1>
              <p className="text-xs text-sidebar-foreground/60">News Intelligence</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              )
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-sidebar-border">
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
                System Status
              </h3>
            </div>
            
            <div className="space-y-3 px-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="text-sidebar-foreground/80">Crawling</span>
                </div>
                <span className="text-green-500 font-medium">Active</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span className="text-sidebar-foreground/80">Sources</span>
                </div>
                <span className="text-sidebar-foreground font-medium">200+</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Newspaper className="w-4 h-4 text-orange-500" />
                  <span className="text-sidebar-foreground/80">Today</span>
                </div>
                <span className="text-sidebar-foreground font-medium">1,247</span>
              </div>
            </div>
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/60 text-center">
            <p>Press Information Bureau</p>
            <p>Government of India</p>
          </div>
        </div>
      </div>
    </>
  )
}

