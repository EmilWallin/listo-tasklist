import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { supabase } from './api/supabase'
import { useEffect, useState } from 'react'
import { useLists } from './stores/ListsStore'
import { useUser } from './stores/UserStore'

const router = createRouter({
  routeTree,
  context: {
    supabase,
    user: null, // Fallback
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  const { user, setUser } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const { init } = useLists()

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const setup = async () => {
      supabase.auth.getUser().then(({ data: { user: receivedUser } }) => {
        setUser(receivedUser)
        setIsLoading(false)
      })

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        setIsLoading(false)
      })

      const unsub = await init()

      unsubscribe = () => {
        subscription.unsubscribe()
        unsub()
      }
    }

    setup()

    return () => {
      unsubscribe?.()
    }
  }, [])

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        Loading...
      </div>
    )
  }

  // 4. Pass the reactive 'user' state into the RouterProvider
  // TanStack will merge this with the default context we defined above
  return <RouterProvider router={router} context={{ user }} />
}

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<App />)
}
