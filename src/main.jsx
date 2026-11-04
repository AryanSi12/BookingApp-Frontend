import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import './index.css'
import '@/lib/api'
import App from './App.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
})
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Hero from './Components/Hero.jsx'
import { Provider } from 'react-redux'
import { persistor, store } from './Redux/userStore.jsx'
import { PersistGate } from 'redux-persist/integration/react'
import SignupAsUser from './Components/SignupAsUser.jsx'
import Login from './Components/Login.jsx'
import SignupAsOrganizer from './Components/SignupAsOrganizer.jsx'
import ProfilePage from './Components/Profile.jsx'
import Venue from './Components/Venue.jsx'
import CreateEvent from './Components/CreateEvent.jsx'
const CreateVenue = lazy(() => import('./Components/CreateVenue.jsx'))
const AddEvent = lazy(() => import('./Components/AddEvent.jsx'))
import Event from './Components/Event.jsx'
import StripeProvider from './Components/StripeProvider.jsx'
import Booking from './Components/Booking.jsx'
import Ticket from './Components/Ticket.jsx'
import MyBookings from './Components/MyBookings.jsx'
import GetAllEvents from './Components/GetAllEvents.jsx'
import User from './Components/User.jsx'
import BookAnEvent from './Components/BookAnEvent.jsx'
import NotFound from './Components/NotFound.jsx'
import Styleguide from './Components/Styleguide.jsx'
const Organizer = lazy(() => import('./Components/Organizer.jsx'))
const MyEvents = lazy(() => import('./Components/MyEvents.jsx'))
const EventAnalytics = lazy(() => import('./Components/EventAnalytics.jsx'))
const MyVenues = lazy(() => import('./Components/MyVenues.jsx'))

function LazyPage({ children }) {
  return <Suspense fallback={<p className="px-4 pt-28 text-center text-muted-foreground">Loading…</p>}>{children}</Suspense>
}

const router = createBrowserRouter([
  {path: "/",
    element: <App />,
    children :[
      {
      path : "/",
      element : <Hero />
      },
      {
        path : "/signup-user",
        element : <SignupAsUser />
      },
      {
        path : "/signup-organizer",
        element : <SignupAsOrganizer />
      },
      {
        path : "/login",
        element : <Login />
      },
      {
        path : "/get-all-events",
        element : <GetAllEvents />
      },
      {
        path : "/event/:eventId",
        element : <Event />
      },
      {
        path : "/create-event",
        element : <CreateEvent />
      },
      {
        path : "/create-event-final/:venueId",
        element : <LazyPage><AddEvent /></LazyPage>
      },
      {
        path : "/my-bookings",
        element : <MyBookings />
      },
      {
        path : "/profile",
        element : <ProfilePage />
      },
      {
        path : "/create-venue",
        element : <LazyPage><CreateVenue /></LazyPage>
      },
      {
        path : "/venue-by-id/:venueId",
        element : <Venue />
      },
      {
    path: "/booking/:eventId",
     element: (
    <StripeProvider>
      <Booking />
    </StripeProvider>
   )
  },
      {
        path : "/ticket/:bookingId",
        element : <Ticket />
      },
      {
        path : "/Organizer",
        element : <LazyPage><Organizer /></LazyPage>
      },
      {
        path : "/explore",
        element : <User />
      },
      {
        path : "/my-events",
        element : <LazyPage><MyEvents /></LazyPage>
      },
      {
        path : "/event-analytics/:eventId",
        element : <LazyPage><EventAnalytics /></LazyPage>
      },
      {
        path : "/my-venues",
        element : <LazyPage><MyVenues /></LazyPage>
      },
      {
        path : "/book-events",
        element : <BookAnEvent />
      },
      {
        path : "/_styleguide",
        element : <Styleguide />
      },
      {
        path : "*",
        element : <NotFound />
      }
      
    ]
    }
])

createRoot(document.getElementById('root')).render(
 <StrictMode>
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="theme">
  <QueryClientProvider client={queryClient}>
  <Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
    <RouterProvider router={router}/>
   </PersistGate>
  </Provider>
  </QueryClientProvider>
  </ThemeProvider>
  </StrictMode>,
)
