import React, { use, useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, userDetails } = useSelector((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        console.log("Validating token...");
        
        const response = await axios.get('https://bookingapp-backend-hsy3.onrender.com/User/getCurrUser', {
          withCredentials: true,
        });
        console.log("Token validation response:", response.data);
        
        if (response) {
        } else {
          dispatch(clearUserDetails());
        }
      } catch (error) {
        dispatch(clearUserDetails());
      }
    };

    if (isLoggedIn) {
      validateToken();
    }
  }, []);

  useEffect(() => {
    console.log(userDetails);

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("https://bookingapp-backend-hsy3.onrender.com/User/getUserDetails", { withCredentials: true });
        console.log("User details fetched:", response.data);
        dispatch(
          setUserDetails({
            userDetails: {
              username: response.data.username,
              email: response.data.email,
              userId: response.data.userId,
              userImage: response.data.userImage,
              roles: response.data.roles,
              createdAt: response.data.createdAt,
              updatedAt: response.data.updatedAt,
            },
            token: response.data.token,
            isLoggedIn: true,
          })
        );
        // You can dispatch the user details to the Redux store if needed
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (isLoggedIn) {
      fetchUserDetails();
    }
  }, [isLoggedIn]);

  const handleLogout = async () => {
    try {
      const response = await axios.post("https://bookingapp-backend-hsy3.onrender.com/User/Logout", null, { withCredentials: true });
      console.log("Logout successful:", response);

      dispatch(clearUserDetails());
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="w-full ml-0 md:ml-36 absolute top-0 left-0 z-20 bg-transparent px-4 md:px-6 py-4 md:py-5 flex justify-between items-center max-w-7xl mx-auto">

      <div className="text-2xl font-bold text-white">EventSphere</div>

      {isLoggedIn ? (
        <>
          <div className="hidden md:flex gap-8 text-white text-sm font-medium items-center">
            <Link to="/" className="hover:text-cyan-300 transition">Home</Link>
            <Link to="/get-all-events" className="hover:text-cyan-300 transition">Events</Link>
            <Link to="/create-event" className="hover:text-cyan-300 transition">Create Event</Link>
            <Link to="/create-venue" className="hover:text-cyan-300 transition">Create Venue</Link>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={userDetails?.userImage || ''} alt="@user" />
                  <AvatarFallback>{userDetails?.username || 'U'}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 mt-2">
                <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/my-bookings')}>My Bookings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/my-events')}>My Events</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            {menuOpen ? (
              <X size={28} onClick={() => setMenuOpen(false)} className="cursor-pointer" />
            ) : (
              <Menu size={28} onClick={() => setMenuOpen(true)} className="cursor-pointer" />
            )}
          </div>

          {/* Mobile Dropdown Menu */}
          {menuOpen && (
            <div className="absolute top-16 right-6 bg-slate-800 p-5 rounded-lg shadow-lg flex flex-col gap-4 md:hidden z-30 text-white">
              <Link to="/profile" onClick={() => setMenuOpen(false)}>My Profile</Link>
              <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/get-all-events" onClick={() => setMenuOpen(false)}>Events</Link>
              <Link to="/create-event" onClick={() => setMenuOpen(false)}>Create Event</Link>
              <Link to="/create-venue" onClick={() => setMenuOpen(false)}>Create Venue</Link>
              
              <Link to="/my-bookings" onClick={() => setMenuOpen(false)}>My Bookings</Link>
              <Link to="/my-events" onClick={() => setMenuOpen(false)}>My Events</Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-left hover:text-red-400"
              >
                Logout
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex gap-4">
            <Link to="/signup-organizer" className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
              Sign Up as Organizer
            </Link>
            <Link to="/signup-user" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
              Sign Up as User
            </Link>
            <Link to="/login" className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
              Login
            </Link>
          </div>

          {/* Mobile Auth Buttons */}
          <div className="md:hidden">
            {menuOpen ? (
              <X size={28} onClick={() => setMenuOpen(false)} className="cursor-pointer" />
            ) : (
              <Menu size={28} onClick={() => setMenuOpen(true)} className="cursor-pointer" />
            )}
          </div>

          {menuOpen && (
            <div className="absolute top-16 right-6 bg-slate-800 p-5 rounded-lg shadow-lg flex flex-col gap-4 md:hidden z-30 text-white">
              <Link to="/signup-organizer" onClick={() => setMenuOpen(false)}>Sign Up as Organizer</Link>
              <Link to="/signup-user" onClick={() => setMenuOpen(false)}>Sign Up as User</Link>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            </div>
          )}

        </>
      )}
    </nav>
  );
};

export default Navbar;
