import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { EventCard } from '../event/event-card'
import type { EventDto } from '@/api/types.gen'
import { Button } from '@/components/ui/button'

export function EventSection({ events }: { events: Array<EventDto> }) {
  const { t } = useTranslation()

  return (
    <section className="py-16">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-neutral-50">
            {t('home.recentEvents', 'Recent Events')}
          </h2>
          <p className="text-neutral-400">
            {t('home.recentEventsSubtitle', 'Freshly added events you might like.')}
          </p>
        </div>
        <Button
          variant="ghost"
          className="text-neutral-300"
          render={<Link to="/events" search={{ page: 1 }} />}
        >
          {t('home.viewAll', 'View all')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  )
}
