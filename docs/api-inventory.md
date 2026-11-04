# API inventory

Audit of the EventSphere frontend before the UI overhaul. Every network call below is wrapped in `src/services/*` with the same URL, body, headers, and credential flags the components used to send. Response handling stays in the component that used to call axios.

Base URL: `https://bookingapp-backend-hsy3.onrender.com` (`API_BASE` in `src/services/api.js`).

There is no axios instance. Services use the shared axios default so `Authorization` set by `setAuthToken` is attached to every request.

## Auth

| Piece | Behavior |
|---|---|
| Login | `POST /Public/LoginUser` with JSON `{ username, password }` and `withCredentials: true`. The body is a raw JWT string. `extractAuthToken` also accepts `{ token }` or `{ jwtToken }`. |
| Session | Token is stored in `localStorage` under `jwtToken`. `setAuthToken` sets `axios.defaults.headers.common.Authorization` to `Bearer <token>`. `src/main.jsx` imports `@/lib/api`, which loads `src/services/api.js` and calls `hydrateAuthToken()` on startup. |
| Profile after login | `completeLogin` then `GET /User/getUserDetails` and maps `username`, `email`, `userId` (or `id` / `_id`), `userImage`, `roles`, `createdAt`, `updatedAt`. |
| Navbar check | When Redux says the user is logged in, `GET /User/getCurrUser`. Failure clears the token and Redux user. |
| Logout | `POST /User/Logout` with body `null` and `withCredentials: true`, then clear token and Redux, then navigate to `/login`. |
| Redux | `src/Redux/userSlice.jsx` stores `userDetails`, `isLoggedIn`, and `token`. `redux-persist` key is `user` (localStorage). |
| Roles | Organizer UI checks `userDetails.roles.includes("ORGANIZER")`. There is no router-level guard. |

Signup does **not** send `withCredentials`. Login, logout, and every `/User` and `/Organizer` call do.

## Calls

### `src/services/auth.js`

| Function | Method and path | Body | Credentials | Callers | UI reads |
|---|---|---|---|---|---|
| `loginUser` | `POST /Public/LoginUser` | `{ username, password }` | yes | `Login`, `SignupAsUser`, `SignupAsOrganizer` | Passed to `completeLogin` |
| `addUser` | `POST /Public/AddUser` | `FormData` parts `user` (JSON string of username, email, password) and `image` | no | `SignupAsUser` | Status only; then login |
| `addOrganizer` | `POST /Public/AddOrganizer` | Same `FormData` shape as `addUser` | no | `SignupAsOrganizer` | Status only; then login |
| `getCurrUser` | `GET /User/getCurrUser` | none | yes | `Navbar` | Success/failure only. Profile is loaded by `fetchCurrentUserDetails` |
| `fetchCurrentUserDetails` | `GET /User/getUserDetails` | none | yes | `completeLogin`, `Navbar` | Mapped fields listed above |
| `updateUserDetails` | `PUT /User/updateUserDetails` | `{ username, password, currentPassword }` | yes | `Profile` | `response.status === 200`. 401 toast: current password incorrect |
| `logoutUser` | `POST /User/Logout` | `null` | yes | `Navbar` | Errors are logged; local session is cleared either way |
| `completeLogin` | orchestrates login token + `getUserDetails` | — | — | Login and both signups | `{ token, userDetails }` dispatched to Redux |

Multipart signup and create calls go through `postMultipart` in `src/services/uploads.js`. That helper sets `Content-Type: multipart/form-data` and adds `withCredentials: true` only when the caller asks for it.

### `src/services/events.js`

| Function | Method and path | Body | Callers | UI reads |
|---|---|---|---|---|
| `getAllEvents` | `GET /User/getAllEvents` | none | `Hero`, `EventGrid` (`/get-all-events`, `/book-events`) | Array of events. Empty or non-array becomes `[]` |
| `getEventById` | `GET /User/getEventById/:eventId` | none | `Event`, `EventAnalytics`, `Booking` | `title`, `aboutEvent`, `startTime`, `endTime`, `eventImage`, `venueId` (object or id) |
| `getSeatStatusByEventId` | `GET /User/getSeatStatusByEventId/:eventId` | none | `Event`, `EventAnalytics`, `Booking` | Array of `{ seatNumber, seatType, status }` |
| `getAllEventsByUserId` | `GET /Organizer/getAllEventsByUserId` | none | `MyEvents` | `response.data` as the list. Cards use `eventId`, `title`, times, image, `venueId`, `organizerId.username` |
| `deleteEventById` | `DELETE /Organizer/deleteEventById/:eventId` | none | `MyEvents` | Success removes the row where `event.eventId` matches |
| `createEvent` | `POST /Organizer/createEvent/:venueId` | `FormData`: `event` JSON (`title`, `aboutEvent`, `startTime`, `endTime`, `organizerId`) and `image` | `AddEvent` | `response.data._id` or `response.data.eventId`, then navigate to `/event/:id` |

`AddEvent` still sends `organizerId: userDetails._id`. `mapUserDetails` stores `userId`, not `_id`. That payload was left unchanged.

### `src/services/venues.js`

| Function | Method and path | Body | Callers | UI reads |
|---|---|---|---|---|
| `getAllVenues` | `GET /User/getAllVenues` | none | `CreateEvent` | `venueId`, `venueName`, `venueLocation`, `venueImage`, `rows`, `col` |
| `getVenueById` | `GET /User/getVenueById/:venueId` | none | `Event`, `Venue` | `response.data.venue` or `response.data`. Fields: `venueName`, `venueLocation`, `venueImage`, `rows`, `col`, `seats`, `venueId` |
| `getAllVenuesByUserId` | `GET /Organizer/getAllVenuesByUserId` | none | `MyVenues` | `venueId`, `venueName`, `venueLocation`, `venueImage`, `rows`, `col`, `createdBy.username` |
| `deleteVenueById` | `DELETE /Organizer/deleteVenueById/:venueId` | none | `MyVenues` | Success removes the row where `venue.venueId` matches |
| `createVenue` | `POST /Organizer/createVenue` | `FormData`: `venue` JSON (`venueName`, `venueLocation`, `rows`, `col`) and `image` | `CreateVenue` | `response.data.id` or `_id` or `venueId`, then `/venue-by-id/:id` |

### `src/services/bookings.js`

| Function | Method and path | Body | Callers | UI reads |
|---|---|---|---|---|
| `fetchBookingByUserId` | `GET /User/fetchBookingByUserId` | none | `MyBookings` | Array. Cards use event title, image, times, seats |
| `fetchBookingByBookingId` | `GET /User/fetchBookingByBookingId/:bookingId` | none | `Ticket` | `bookingId`, `bookedSeats`, `amountPaid`, `eventId` (nested venue), `userId`. Failure navigates home |
| `bookSeat` | `POST /User/bookSeat/:eventId` | `{ bookedSeats }` | `Booking` | `clientSecret`, `bookingDetails.bookingId`. Stripe `confirmCardPayment` stays in the component |

## Left in the UI on purpose

| Call | Where | Why it stayed |
|---|---|---|
| `loadStripe("pk_test_…")` and `stripe.confirmCardPayment` | `StripeProvider`, `Booking` | Stripe.js, not this backend. `bookSeat` is the only backend call in checkout |
| `console.log(isLoggedIn)` | `CreateVenue` | Pre-existing debug log. Not a request |

`@stomp/stompjs` and `sockjs-client` are dependencies. No component opens a socket.

## Backend routes this UI does not call

These exist on the API and were not wrapped, because no component called them:

- `GET /Public/health`
- `GET /User/getEventsByQuery`
- `GET /Organizer/fetchAllBookingsByEventId/:eventId`

## Routes

Defined in `src/main.jsx`. `App` renders `Navbar` and an `Outlet`. Guards are inside the page, not the router.

| Path | Component | Who can open it | Data |
|---|---|---|---|
| `/` | `Hero` | Anyone | `getAllEvents` |
| `/signup-user` | `SignupAsUser` | Anyone | `addUser`, then login |
| `/signup-organizer` | `SignupAsOrganizer` | Anyone | `addOrganizer`, then login |
| `/login` | `Login` | Anyone | `loginUser` |
| `/get-all-events` | `GetAllEvents` → `EventGrid` | Anyone | `getAllEvents` |
| `/book-events` | `BookAnEvent` → `EventGrid` | Anyone | `getAllEvents` |
| `/event/:eventId` | `Event` | Anyone (API requires a session) | event, venue, seats |
| `/create-event` | `CreateEvent` | Anyone (API requires a session) | `getAllVenues` |
| `/create-event-final/:venueId` | `AddEvent` | Redirects to `/login` when logged out | `createEvent` |
| `/my-bookings` | `MyBookings` | Anyone (API requires a session) | `fetchBookingByUserId` |
| `/profile` | `Profile` | Renders nothing when logged out | `updateUserDetails` |
| `/create-venue` | `CreateVenue` | Redirects to `/login` when logged out | `createVenue` |
| `/venue-by-id/:venueId` | `Venue` | Anyone (API requires a session) | `getVenueById` |
| `/booking/:eventId` | `StripeProvider` + `Booking` | Needs `location.state.bookedSeats` | event, seats, `bookSeat` |
| `/ticket/:bookingId` | `Ticket` | Anyone (API requires a session) | `fetchBookingByBookingId` |
| `/Organizer` | `Organizer` | Logged-in organizer, else redirect `/` | Redux only |
| `/explore` | `User` | Logged-in user, else redirect `/` | Redux only |
| `/my-events` | `MyEvents` | Anyone (API requires organizer) | list + delete |
| `/event-analytics/:eventId` | `EventAnalytics` | Anyone (API requires a session) | event + seats |
| `/my-venues` | `MyVenues` | Anyone (API requires organizer) | list + delete |

`/User/**` and `/Organizer/**` return 403 without a bearer token. Logged-out catalog pages show their existing empty or error state. That is unchanged.

## Components that do not call the network

`App`, `BookAnEvent`, `GetAllEvents`, `EventPosterCard`, `Organizer`, `SeatMap`, `StripeProvider`, `User`, and everything under `src/Components/ui/`.
