import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import type { SupabaseClient, User } from '@supabase/supabase-js'

import '../styles.css'
import { Slide, ToastContainer } from 'react-toastify'

interface RouterContext {
  supabase: SupabaseClient
  user: User | null
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <Outlet />
      <ToastContainer
        position="bottom-center"
        transition={Slide}
        autoClose={2000}
        closeOnClick={true}
        pauseOnHover={false}
        theme="dark"
        closeButton={true}
      />
      {/* <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      /> */}
    </>
  )
}
