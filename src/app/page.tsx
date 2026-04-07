import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ElGremio from "@/components/ElGremio";
import Servicios from "@/components/Servicios";
import Reservar from "@/components/Reservar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ElGremio />
      <Servicios />
      <Reservar />
      <Footer />
    </main>
  );
}
