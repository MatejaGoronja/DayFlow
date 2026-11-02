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
        <Features/>
        <div className="h-[200vh]">
        {/* Temporary scroll testing */}
        </div>
        
        <Pricing/>
        <Faq/>
      </main>
      <Footer/>
    </>
  )
}