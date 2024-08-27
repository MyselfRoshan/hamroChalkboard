import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/features')({
  component: () => <div>Hello /features!</div>
})