import Image from "next/image";
import Home from "./home/hero";
import AboutPage from "./home/about";

export default function Page() {
  return (
    <div className="bg-gradient-to-b from-blue-900 to-[#9ADBF9]">
      <Home />
      <AboutPage />
    </div>
  );
}
