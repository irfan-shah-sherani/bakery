import HeroCarousel from "@/components/HeroCarousel";
import About from "@/components/About";
import Services from "@/components/Services";
import Offer from "@/components/Offer";
import Menu from "@/components/Menu";
import Reservation from "@/components/Reservation";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { getJsonBakeryMenu } from "@/actions/menu";

export const dynamic = "force-dynamic";

export default async function Home() {
  const menuItems = await getJsonBakeryMenu();

  return (
    <main>
      <HeroCarousel />
      <About />
      <Services />
      {/* <Offer /> */}
      <Menu initialItems={menuItems} />
      {/* <Reservation /> */}
      <Testimonials />
      <Footer />
    </main>
  );
}

