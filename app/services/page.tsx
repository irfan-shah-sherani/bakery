// app/menu/page.tsx
import Services from "@/components/Services";


export default async function Page() {

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#FFF8ED] py-0 px-4 md:px-10 overflow-hidden" >
      <Services />
    </div>
  );
}