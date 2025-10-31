import Homelisting from "./components/Homelisting";
import "./globals.css"
import About from "./components/About";
import Places from "./components/Places";
import WhyUs from "./components/WhyUs";
import { Hero } from "./components/Hero";
import Categories from "./components/Categories";
import { Phone } from "lucide-react";
export default function Home() {
  return (
    <div className="Home">
      <Hero/>
     <Homelisting/>
     <About/>
     <Places/>
     <Categories/>
     <WhyUs/>
    </div>
  );
}
