import { Link, Outlet, createRootRouteWithContext, useRouter } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

interface MyRouterContext {
  queryClient: QueryClient
}

function NotFoundPage() {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon icon="lucide:file-question" />
          </EmptyMedia>
          <EmptyTitle>{t('error.notFound.title', '404 - Page Not Found')}</EmptyTitle>
          <EmptyDescription>
            {t('error.notFound.description', "The page you're looking for doesn't exist or has been moved.")}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex flex-row gap-4 justify-center">
          <Button onClick={() => router.history.back()} variant="outline">
            <Icon icon="lucide:arrow-left" className="mr-2 h-4 w-4" />
            {t('common.goBack', 'Go Back')}
          </Button>
          <Button variant="link">
            <Link to="/">
              {t('common.goHome', 'Go Home')}
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}

function ErrorPage({ error }: { error: Error }) {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
      <div className="text-center space-y-6 px-4">
        <div className="flex justify-center">
          <Icon icon="lucide:alert-triangle" className="w-24 h-24 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold text-white">
          {t('error.generic.title', 'Something went wrong')}
        </h1>
        <p className="text-neutral-400 max-w-md">
          {error.message || t('error.generic.description', 'An unexpected error occurred.')}
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.history.back()} variant="outline">
            <Icon icon="lucide:arrow-left" className="mr-2 h-4 w-4" />
            {t('common.goBack', 'Go Back')}
          </Button>
          <Button onClick={() => router.navigate({ to: '/' })}>
            <Icon icon="lucide:home" className="mr-2 h-4 w-4" />
            {t('common.goHome', 'Go Home')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Navbar />
      <main className="container mx-auto">
        <Outlet />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </main>
    </>
  ),
  notFoundComponent: NotFoundPage,
  errorComponent: ({ error }) => (
    <>
      <Navbar />
      <main className="container mx-auto">
        <ErrorPage error={error} />
      </main>
    </>
  ),
})
