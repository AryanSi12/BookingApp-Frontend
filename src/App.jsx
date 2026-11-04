import { useEffect, useState } from "react";
import Navbar from "./Components/Navbar";
import PageTransition from "./Components/PageTransition";
import { Toaster } from "@/Components/ui/sonner";

function AppToaster() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const apply = () => setMobile(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  return <Toaster richColors position={mobile ? "bottom-center" : "top-right"} />;
}

function App() {
  return (
    <>
      <AppToaster />
      <div className="min-h-screen bg-background text-foreground">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <Navbar />
        <div id="content">
          <PageTransition />
        </div>
      </div>
    </>
  );
}

export default App
