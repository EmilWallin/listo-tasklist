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
        {list ? <ListView list={list} /> : <div>List not found</div>}
      </div>
    </div>
  )
}
