import { AddListButton } from '#/components/AddList/AddListButton'
import { AddListPlusButton } from '#/components/AddList/AddListPlusButton'
import { IndexHeader } from '#/components/Header/IndexHeader'
import { Lists } from '#/components/Lists/Lists'
import { useLists } from '#/stores/ListsStore'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({
        to: '/Login',
        search: {
          redirect: '/',
        },
      })
    }
  },
  component: Home,
})

function Home() {
  const { lists } = useLists()

  return (
    <Suspense fallback={<div>Loading your lists...</div>}>
      <IndexHeader />
      {lists.length > 0 ? (
        <>
          <Lists />
          <div className="absolute bottom-4 right-4">
            <AddListPlusButton />
          </div>
        </>
      ) : (
        <AddListButton />
      )}
    </Suspense>
  )
}
