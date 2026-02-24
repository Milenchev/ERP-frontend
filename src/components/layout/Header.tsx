import { Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="header">
      <div className="header__actions">
        <Button variant="ghost" size="icon">
          <Bell />
        </Button>
        <div className="header__user">
          <Button variant="ghost" size="icon">
            <User />
          </Button>
          <span className="header__user-name">Georgi Milenchev</span>
        </div>
      </div>
    </header>
  )
}
