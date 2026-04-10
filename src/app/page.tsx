import Hero from "@/components/Hero";
import Servicios from "@/components/Servicios";
import ElGremio from "@/components/ElGremio";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Servicios />
      <ElGremio />
      <Footer />
    </main>
  );
}
