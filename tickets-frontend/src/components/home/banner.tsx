import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function Banner() {
  const { t } = useTranslation()

  return (
    <section className="relative h-[600px] w-full bg-neutral-900 text-white overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt={t('home.bannerAlt', 'Colorfull banner image')}
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-linear-to-t from-neutral-900 to-transparent" />

      <div className="relative mx-auto px-4 h-full flex flex-col justify-center items-start pt-20">

        <h1 className="text-7xl font-bold mb-6">
          {t('home.heroTitle', 'Welcome to Ticket Masters!')}
        </h1>
        <p className="text-2xl text-neutral-300 max-w-2xl mb-8">
          {t('home.heroSubtitle', 'Browse events, reservations and users.')}
        </p>
        <div className="flex gap-4">
          <Button
            size="lg"
            className="text-lg px-7 py-6 rounded-2xl"
            render={<Link to="/events" search={{ page: 1 }} />}
          >
            {t('home.exploreEvents', 'Explore Events')}
          </Button>
        </div>
      </div>
    </section>
  )
}
