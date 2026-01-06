import { useTranslation } from 'react-i18next'

export function EventsHeader() {
  const { t } = useTranslation()

  return (
    <div className="mb-12 text-center max-w-2xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold text-neutral-50">
        {t('events.exploreTitle', 'Explore Events')}
      </h1>
      <p className="text-lg text-neutral-400">
        {t('events.exploreSubtitle', 'Discover concerts, conferences, exhibitions, and more going on near you.')}
      </p>
    </div>
  )
}
