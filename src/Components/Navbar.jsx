import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearUserDetails, setUserDetails } from '../Redux/userSlice';
import axios from 'axios';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/Components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/Components/ui/avatar';
import {
  API_BASE,
  clearAuthToken,
  fetchCurrentUserDetails,
  hydrateAuthToken,
} from '@/lib/api';

const linkClass = ({ isActive }) =>
  `relative text-sm font-semibold transition ${
    isActive
      ? 'text-brand after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-brand'
      : 'text-slate-600 hover:text-ink'
  }`;

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, userDetails, token } = useSelector((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const isOrganizer = userDetails?.roles?.includes('ORGANIZER');

  useEffect(() => {
    hydrateAuthToken(token);
  }, [token]);

  useEffect(() => {
    if (!isLoggedIn) return;

    let cancelled = false;

    const syncSession = async () => {
      hydrateAuthToken(token);
      try {
        await axios.get(`${API_BASE}/User/getCurrUser`, { withCredentials: true });
        const details = await fetchCurrentUserDetails();
        if (!cancelled && details) {
          dispatch(
            setUserDetails({
              userDetails: details,
              token: token || hydrateAuthToken(),
            })
          );
        }
      } catch (error) {
        console.error('Session validation failed:', error);
        if (!cancelled) {
          clearAuthToken();
          dispatch(clearUserDetails());
        }
      }
    };

    syncSession();
    return () => {
      cancelled = true;
    };
  }, [dispatch, isLoggedIn, token]);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE}/User/Logout`, null, { withCredentials: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthToken();
      dispatch(clearUserDetails());
      navigate('/login');
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[color:var(--border)]/80 bg-white/85 backdrop-blur-xl">
      <nav className="page-shell flex h-[4.25rem] items-center justify-between gap-4">
        <Link to="/" className="shrink-0 font-display text-[1.35rem] font-extrabold tracking-tight text-ink">
          Event<span className="text-brand">Sphere</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/get-all-events" className={linkClass}>Events</NavLink>
          <NavLink to="/book-events" className={linkClass}>Book</NavLink>
        </div>

        {isLoggedIn ? (
          <div className="hidden items-center gap-3 md:flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-brand/40">
                  <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-white shadow-sm">
                    <AvatarImage src={userDetails?.userImage || ''} alt={userDetails?.username || 'Account'} />
                    <AvatarFallback className="bg-brand-soft font-semibold text-brand">
                      {userDetails?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-2 w-52 rounded-xl" align="end">
                <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/my-bookings')}>My Bookings</DropdownMenuItem>
                {isOrganizer && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/my-events')}>My Events</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/create-event')}>Create Event</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/create-venue')}>Create Venue</DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-brand">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="hidden items-center gap-2 md:flex">
            <Link to="/signup-organizer" className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-ink">
              Host an event
            </Link>
            <Link to="/login" className="ghost-btn h-10 px-4">
              Sign in
            </Link>
            <Link to="/signup-user" className="brand-btn h-10 px-4">
              Sign up
            </Link>
          </div>
        )}

        <button
          type="button"
          className="rounded-xl p-2 text-ink md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-[color:var(--border)] bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-semibold text-slate-700">
            <Link to="/" onClick={closeMenu}>Home</Link>
            <Link to="/get-all-events" onClick={closeMenu}>Events</Link>
            <Link to="/book-events" onClick={closeMenu}>Book</Link>
            {isLoggedIn ? (
              <>
                <Link to="/profile" onClick={closeMenu}>Profile</Link>
                <Link to="/my-bookings" onClick={closeMenu}>My Bookings</Link>
                {isOrganizer && (
                  <>
                    <Link to="/my-events" onClick={closeMenu}>My Events</Link>
                    <Link to="/create-event" onClick={closeMenu}>Create Event</Link>
                    <Link to="/create-venue" onClick={closeMenu}>Create Venue</Link>
                  </>
                )}
                <button
                  type="button"
                  className="text-left text-brand"
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu}>Sign in</Link>
                <Link to="/signup-user" onClick={closeMenu}>Sign up</Link>
                <Link to="/signup-organizer" onClick={closeMenu}>Host an event</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
