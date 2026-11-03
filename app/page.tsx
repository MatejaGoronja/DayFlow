import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import Faq from "@/components/landing/Faq";
import Cta from "@/components/landing/Cta";
import Footer from "@/components/landing/Footer";
import WaveDivider from "@/components/landing/WaveDivider";

export default function Home(){
  return(
    <>
      <Navbar/>
      <main>
        <Hero/>
        <WaveDivider/>
        <Features/>
        <WaveDivider flip/>
        <Pricing/>
        <WaveDivider variant="layered"/>
        <Faq/>
        <WaveDivider flip variant="curve"/>
        <Cta/>
      </main>
      <Footer/>
    </>
  )
}