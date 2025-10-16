import Homelisting from "./components/Homelisting";
import "./globals.css"
import About from "./components/About";
import Places from "./components/Places";
import WhyUs from "./components/WhyUs";
import { Hero } from "./components/Hero";
export default function Home() {
  return (
    <div className="Home">
      <Hero/>
     <Homelisting/>
     <About/>
     <Places/>
     <WhyUs/>
    </div>
  );
}
