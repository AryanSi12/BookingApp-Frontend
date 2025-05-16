import React, { use, useEffect, useRef } from "react";
import {
    CalendarCheck,
    MapPin,
    PlusSquare,
    Users,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "sonner";


const Hero = () => {
    const { userDetails, isLoggedIn } = useSelector((state) => state.user);
    const [events, setEvents] = React.useState([]);
    useEffect(() => {

        console.log(userDetails?.roles);

        if (isLoggedIn) {
            const fetchEvents = async () => {
                try {
                    const response = await axios.get(
                        `https://bookingapp-backend-hsy3.onrender.com/User/getAllEvents`,
                        { withCredentials: true }
                    );
                    console.log("Fetched events:", response.data);
                    setEvents(response.data);
                }
                catch (error) {
                    console.error("Error fetching events:", error);
                }
            }
            fetchEvents();
        }
    }, [isLoggedIn]);
    const scrollContainerRef = useRef(null);

    const scrollLeft = () => {
        scrollContainerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
    };

    const scrollRight = () => {
        scrollContainerRef.current?.scrollBy({ left: 300, behavior: "smooth" });
    };

    return (
        <section className="relative bg-gradient-to-br from-[#0f172a] to-[#1e293b] min-h-screen text-white overflow-hidden">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[900px] h-[900px] bg-cyan-400 opacity-10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 mt-6 max-w-7xl mx-auto px-6 pt-32 text-center">
                <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
                    EventSphere: Where Events Come Alive
                </h1>
                <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-14">
                    Discover, host, and manage world-class events. Whether you're an attendee or organizer,
                    EventSphere gives you the tools to create unforgettable experiences.
                </p>

                {/* Feature Cards */}
                <div className="mt-28 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {/* Explore Events */}
                    <Link
                        to={isLoggedIn ? "/book-events" : "#"}
                        onClick={(e) => {
                            if (!isLoggedIn) {
                                e.preventDefault();
                                toast.error("Please login to explore events.");
                            }
                        }}
                        className="cursor-pointer"
                    >
                        <Card className="bg-white text-gray-900 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1">
                            <img
                                src="/ChatGPT Image May 13, 2025, 12_29_44 AM.png"
                                alt="Explore Events"
                                className="w-full object-cover max-h-80"
                            />
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-purple-700 text-xl font-bold">
                                    <CalendarCheck size={20} /> Explore Events
                                </CardTitle>
                                <CardDescription className="text-gray-700 mt-1">
                                    Find and book events that match your vibe.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <span className="text-purple-700 font-medium">Go to Events →</span>
                            </CardContent>
                        </Card>
                    </Link>


                    {/* Create Event */}
                    <Link
                        to={isLoggedIn && userDetails?.roles?.includes("ORGANIZER") ? "/create-event" : "#"}
                        onClick={(e) => {
                            if (!isLoggedIn) {
                                e.preventDefault();
                                toast.error("Please login to create events.");
                            } else if (!userDetails?.roles?.includes("ORGANIZER")) {
                                e.preventDefault();
                                toast.error("Only organizers can create events.");
                            }
                        }}
                        className="cursor-pointer"
                    >
                        <Card className="bg-white text-gray-900 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1">
                            <img src="/ChatGPT Image May 12, 2025, 11_58_07 PM.png" alt="Create Event" className="w-full object-cover max-h-80" />
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-700 text-xl font-bold">
                                    <PlusSquare size={20} /> Create Event
                                </CardTitle>
                                <CardDescription className="text-gray-700 mt-1">
                                    Design your event, sell tickets, and manage attendees with ease.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <span className="text-green-700 font-medium">Create Event →</span>
                            </CardContent>
                        </Card>
                    </Link>


                    {/* Create Venue */}
                    <Link
                        to={isLoggedIn && userDetails?.roles?.includes("ORGANIZER") ? "/create-venue" : "#"}
                        onClick={(e) => {
                            if (!isLoggedIn) {
                                e.preventDefault();
                                toast.error("Please login to create venues.");
                            } else if (!userDetails?.roles?.includes("ORGANIZER")) {
                                e.preventDefault();
                                toast.error("Only organizers can create venues.");
                            }
                        }}
                        className="cursor-pointer"
                    >
                        <Card className="bg-white text-gray-900 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1">
                            <img src="/Screenshot 2025-05-13 142900.png" alt="Create Venue" className="w-full object-cover max-h-80" />
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-indigo-700 text-xl font-bold">
                                    <MapPin size={20} /> Create Venue
                                </CardTitle>
                                <CardDescription className="text-gray-700 mt-1">
                                    Set up your venue once and reuse it for all your future events.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <span className="text-indigo-700 font-medium">Create Venue →</span>
                            </CardContent>
                        </Card>
                    </Link>

                </div>

                {/* Why EventSphere */}
                <div className="mt-24 max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Why EventSphere?</h2>
                    <p className="text-slate-300 mb-6">
                        Our platform brings event organizers and attendees together through a seamless, secure,
                        and intuitive booking experience.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">

                        {/* For Attendees */}
                        <Link to="/explore" className="w-full sm:w-1/3">
                            <div className="bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                <Users className="text-cyan-400 mb-2" size={28} />
                                <h3 className="font-semibold text-lg mb-1">For Attendees</h3>
                                <p className="text-sm text-slate-400">
                                    Easily explore and reserve spots at your favorite events.
                                </p>
                            </div>
                        </Link>

                        {/* For Organizers */}
                        <Link to="/organizer" className="w-full sm:w-1/3">
                            <div className="bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                <PlusSquare className="text-green-400 mb-2" size={28} />
                                <h3 className="font-semibold text-lg mb-1">For Organizers</h3>
                                <p className="text-sm text-slate-400">
                                    Create events, track bookings, and manage payments effortlessly.
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Trending Events */}
                <div className="mt-32 relative">
                    <h2 className="text-3xl font-bold mb-10 text-center">Upcoming Events</h2>

                    {/* Scroll Buttons */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-slate-800/60 hover:bg-slate-700/80 backdrop-blur-md border border-slate-700 text-white"
                        onClick={scrollLeft}
                    >
                        <ChevronLeft size={36} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-slate-800/60 hover:bg-slate-700/80 backdrop-blur-md border border-slate-700 text-white"
                        onClick={scrollRight}
                    >
                        <ChevronRight size={36} />
                    </Button>

                    {/* Scrollable Row with Hidden Scrollbar */}
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-4 sm:gap-6 px-2 sm:px-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >

                        <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

                        {events.map((event, index) => {
                            const start = new Date(...event.startTime);
                            const end = new Date(...event.endTime);
                            const now = new Date();

                            const formattedDate = start.toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            });

                            const formattedTime = `${start.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })} - ${end.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}`;

                            const isExpired = now > end;

                            const truncateWords = (text, wordLimit) => {
                                const words = text.split(" ");
                                return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
                            };

                            const truncatedTitle = truncateWords(event.title, 6);
                            const truncatedDescription = truncateWords(event.aboutEvent, 12);
                            const showDescription = event.aboutEvent.split(" ").length > 0;

                            return (
                                <Link
                                    to={`/event/${event.eventId}`}
                                    key={index}
                                    className="snap-center shrink-0 w-[90%] sm:w-[300px] min-h-[60px] bg-gradient-to-br from-white via-slate-50 to-purple-100 text-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col"
                                >

                                    <img
                                        src={event.eventImage}
                                        alt={event.title}
                                        className="w-full h-48 object-cover rounded-t-2xl"
                                    />

                                    <div className="flex flex-col justify-start px-4 py-3 gap-2 flex-1">
                                        {/* Title & Status */}
                                        <div className="text-sm font-semibold flex items-center justify-between">
                                            <span className="max-w-[170px] whitespace-nowrap overflow-hidden text-ellipsis" title={event.title}>
                                                {truncatedTitle}
                                            </span>
                                            <span
                                                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${isExpired ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                                                    }`}
                                            >
                                                {isExpired ? "Expired ❌" : "Upcoming ✅"}
                                            </span>
                                        </div>

                                        {/* Description */}
                                        {showDescription && (
                                            <div className="text-xs text-slate-600">
                                                {truncatedDescription}
                                            </div>
                                        )}

                                        {/* Metadata */}
                                        <div className="mt-auto text-center text-[12px] text-slate-500 space-y-1 pt-2">
                                            <div>{formattedDate} | {formattedTime}</div>
                                            <div>📍 {event?.venueId?.venueLocation}</div>
                                            <div>🎤 {event?.organizerId?.username}</div>
                                        </div>
                                    </div>
                                </Link>

                            );
                        })}

                    </div>
                </div>

                {/* Venues Section */}
                <div className="mt-32 max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Popular Venues</h2>
                    <p className="text-slate-300">
                        Discover the most loved event venues by our community. Browse locations, capacity,
                        amenities, and more.
                    </p>
                    <div className="mt-8 italic text-slate-400">
                        Venue showcase coming soon...
                    </div>
                </div>

                {/* Footer/Ending Hero Note */}
                <div className="mt-32 py-16 border-t border-slate-700 text-slate-400 text-sm text-center">
                    Made with ❤️ by the EventSphere Team — All rights reserved © 2025
                </div>
            </div>
        </section>
    );
};

export default Hero;
