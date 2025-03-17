import { Button } from './ui/button'
import { Copy, Eye, Code } from 'lucide-react'

const components = [
  {
    name: 'Card',
    description: 'A container for content',
    preview: (
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="text-lg font-semibold">Card Title</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This is a sample card component with some content.
        </p>
      </div>
    ),
    code: `<div className="rounded-lg border bg-card text-card-foreground shadow-sm">
  <h3 className="text-lg font-semibold">Card Title</h3>
  <p className="mt-2 text-sm text-muted-foreground">
    This is a sample card component with some content.
  </p>
</div>`,
  },
  {
    name: 'Button',
    description: 'A clickable button component',
    preview: (
      <div className="flex flex-wrap gap-2">
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
          Button
        </button>
        <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
          Outline
        </button>
        <button className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm hover:bg-secondary/80">
          Secondary
        </button>
        <button className="inline-flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow-sm hover:bg-destructive/90">
          Destructive
        </button>
      </div>
    ),
    code: `<button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
  Button
</button>`,
  },
  {
    name: 'Input',
    description: 'A text input field',
    preview: (
      <div className="flex flex-col gap-2">
        <input
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="Enter text..."
        />
        <input
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          type="password"
          placeholder="Enter password..."
        />
      </div>
    ),
    code: `<input className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />`,
  },
  {
    name: 'Alert',
    description: 'A callout for important information',
    preview: (
      <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-primary" />
          <h4 className="font-medium">Alert Title</h4>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          This is an alert component for displaying important information.
        </p>
      </div>
    ),
    code: `<div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
  <div className="flex items-center gap-2">
    <div className="h-4 w-4 rounded-full bg-primary" />
    <h4 className="font-medium">Alert Title</h4>
  </div>
  <p className="mt-2 text-sm text-muted-foreground">
    This is an alert component for displaying important information.
  </p>
</div>`,
  },
  {
    name: 'Badge',
    description: 'A small status indicator',
    preview: (
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
          Primary
        </span>
        <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
          Secondary
        </span>
        <span className="inline-flex items-center rounded-full bg-destructive px-2.5 py-0.5 text-xs font-medium text-destructive-foreground">
          Destructive
        </span>
      </div>
    ),
    code: `<span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
  Primary
</span>`,
  },
  {
    name: 'Avatar',
    description: 'A user avatar component',
    preview: (
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-primary" />
        <div className="h-10 w-10 rounded-full bg-secondary" />
        <div className="h-10 w-10 rounded-full bg-destructive" />
      </div>
    ),
    code: `<div className="h-10 w-10 rounded-full bg-primary" />`,
  },
]

export function ComponentGrid() {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {components.map((component) => (
          <div
            key={component.name}
            className="group relative rounded-lg border bg-card p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{component.name}</h3>
              <div className="flex space-x-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Code className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {component.description}
            </p>
            <div className="mt-4 rounded-md border bg-muted/50 p-4">
              {component.preview}
            </div>
            <pre className="mt-4 rounded-md bg-muted p-2 text-xs">
              {component.code}
            </pre>
          </div>
        ))}
      </div>
    </div>
  )
}
