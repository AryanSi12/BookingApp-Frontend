import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Hero from './Components/Hero.jsx'
import { Provider } from 'react-redux'
import { persistor, store } from './Redux/userStore.jsx'
import { PersistGate } from 'redux-persist/integration/react'
import SignupAsUser from './Components/SignupAsUser.jsx'
import Login from './Components/Login.jsx'
import SignupAsOrganizer from './Components/SignupAsOrganizer.jsx'
import ProfilePage from './Components/Profile.jsx'
import CreateVenue from './Components/CreateVenue.jsx'
import Venue from './Components/Venue.jsx'
import CreateEvent from './Components/CreateEvent.jsx'
import AddEvent from './Components/AddEvent.jsx'
import Event from './Components/Event.jsx'
import StripeProvider from './Components/StripeProvider.jsx'
import Booking from './Components/Booking.jsx'
import Ticket from './Components/Ticket.jsx'
import MyBookings from './Components/MyBookings.jsx'
import GetAllEvents from './Components/GetAllEvents.jsx'
import Organizer from './Components/Organizer.jsx'
import User from './Components/User.jsx'
import MyEvents from './Components/MyEvents.jsx'
import EventAnalytics from './Components/EventAnalytics.jsx'
import MyVenues from './Components/MyVenues.jsx'
import BookAnEvent from './Components/BookAnEvent.jsx'

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
        element : <AddEvent />
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
        element : <CreateVenue />
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
        element : <Organizer />
      },
      {
        path : "/explore",
        element : <User />
      },
      {
        path : "/my-events",
        element : <MyEvents />
      },
      {
        path : "/event-analytics/:eventId",
        element : <EventAnalytics />
      },
      {
        path : "/my-venues",
        element : <MyVenues />
      },
      {
        path : "/book-events",
        element : <BookAnEvent />
      }
      
    ]
    }
])

createRoot(document.getElementById('root')).render(
 <StrictMode>
  <Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
    <RouterProvider router={router}/>
  </PersistGate>
  </Provider>
  </StrictMode>,
)
