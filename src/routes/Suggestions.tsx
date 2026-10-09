import { getSuggestionsPage } from '#/api/suggestions'
import SuggestionsViewHeader from '#/components/Header/SuggestionsViewHeader'
import SuggestionsList from '#/components/SuggestionsList/SuggestionsList'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Suggestions')({
  loader: () => getSuggestionsPage(),
  component: RouteComponent,
})

function RouteComponent() {
  const suggestions = Route.useLoaderData()

  return (
    <div className="flex flex-col w-full h-full gap-2">
      <SuggestionsViewHeader />
      <SuggestionsList suggestions={suggestions} />
    </div>
  )
}
