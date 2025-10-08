import Homelisting from "./components/Homelisting";
import "./globals.css"
import About from "./components/About";
import Places from "./components/Places";
import WhyUs from "./components/WhyUs";
export default function Home() {
  return (
    <div className="Home">
     <Homelisting/>
     <About/>
     <Places/>
     <WhyUs/>
    </div>
  );
}
