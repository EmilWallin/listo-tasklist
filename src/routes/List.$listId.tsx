import { ForceReloadButton } from '#/components/ForceReloadButton/ForceReloadButton'
import { ListViewHeader } from '#/components/Header/ListViewHeader'
import { ListView } from '#/components/List/ListView'
import { useLists } from '#/stores/ListsStore'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/List/$listId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { listId } = Route.useParams()
  const { lists } = useLists()

  const list = lists.find((l) => l.id === Number(listId))

  useEffect(() => {
    if (!list) {
      redirect({ to: '/' })
    }
  }, [lists, list])

  return (
    <div className="flex flex-col h-full w-full">
      <ListViewHeader list={list} />
      <div className="h-full w-full overflow-y-scroll">
        {list ? (
          <ListView list={list} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full gap-4">
            <span>List not found</span>
            <ForceReloadButton />
          </div>
        )}
      </div>
    </div>
  )
}
