import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Banner } from '@/components/home/banner'
import { EventSection } from '@/components/home/events-section'
import { getEvents } from '@/api'
import { queryKeys } from '@/lib/query-keys'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { t } = useTranslation()
  const { data } = useSuspenseQuery({
    queryKey: queryKeys.events(1, 10),
    queryFn: () => getEvents({ query: { page: 1, limit: 10 }, throwOnError: true }),
  })

  return (
    <div className="flex flex-col min-h-screen bg-neutral-900">
      <Banner />
      <EventSection events={data.data.events} />
    </div>
  )
}
