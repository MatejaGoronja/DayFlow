import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import Faq from "@/components/landing/Faq";
import Footer from "@/components/landing/Footer";

export default function Home(){
  return(
    <>
      <Navbar/>
      <main>
        <Hero/>
        <div className="h-[200vh]">
        {/* Temporary scroll testing */}
        </div>
        <Features/>
        <Pricing/>
        <Faq/>
      </main>
      <Footer/>
    </>
  )
}