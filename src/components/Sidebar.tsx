import { Button } from './ui/button'
import {
  Layout,
  Component,
  Layers,
  Settings,
  Plus,
  History,
  Star,
} from 'lucide-react'

const categories = [
  { name: 'New', icon: Plus },
  { name: 'Recent', icon: History },
  { name: 'Favorites', icon: Star },
  { name: 'Layout', icon: Layout },
  { name: 'Components', icon: Component },
  { name: 'Layers', icon: Layers },
  { name: 'Settings', icon: Settings },
]

export function Sidebar() {
  return (
    <div className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-1 p-2">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.name}
                variant="ghost"
                className="w-full justify-start text-sm font-normal"
              >
                <Icon className="mr-2 h-4 w-4" />
                {category.name}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
