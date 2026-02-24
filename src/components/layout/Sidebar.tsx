import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  UserCog,
  FileText, 
  Settings,
  Warehouse
} from 'lucide-react'

const menuItems = [
  { icon: LayoutDashboard, label: 'Табло', path: '/' },
  { icon: FileText, label: 'Документи', path: '/documents' },
  { icon: Users, label: 'Клиенти', path: '/clients' },
  { icon: Warehouse, label: 'Складове', path: '/storeHouseParts' },
  { icon: ShoppingCart, label: 'Поръчки', path: '/orders' },
  { icon: UserCog, label: 'Служители', path: '/employees' },
  { icon: Settings, label: 'Настройки', path: '/settings' },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <h1 className="sidebar__title">Axeron Solutions</h1>
      </div>
      <nav className="sidebar__nav">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
            >
              <Icon />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
