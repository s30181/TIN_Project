import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function Banner() {
  const { t } = useTranslation()
  return (
    <section className="relative h-[600px] w-full bg-neutral-900 text-white overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop"
        alt="Concert crowd with colorful lights at a live music event"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-linear-to-t from-neutral-900 to-transparent" />

      <div className="relative mx-auto px-4 h-full flex flex-col justify-center items-start pt-20">
        <Badge className="mb-4 bg-primary text-primary-foreground hover:bg-primary/90">
          {t('home.featuredEvent', 'Featured Event')}
        </Badge>
        <h1 className="text-7xl font-bold mb-6">
          {t('home.heroTitle', 'Discover Your Next Unforgettable Experience')}
        </h1>
        <p className="text-2xl text-neutral-300 max-w-2xl mb-8">
          {t('home.heroSubtitle', 'Browse thousands of concerts, festivals, conferences, and exhibitions happening near you.')}
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
