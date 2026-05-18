// // app/menu/page.tsx
// import EnhancedBakeryMenu from "@/components/Menu";
// import { getJsonBakeryMenu } from "@/actions/menu";

// // Forces real-time file reading on layout reload
// export const dynamic = "force-dynamic";

// export default async function MenuPage() {
//   // Reads strictly from ./data/menu.json
//   const items = await getJsonBakeryMenu();
//   console.log("✅ Menu page loaded. Items from menu.json:", items);

//   return (
//     <div className="pt-16">
//       <EnhancedBakeryMenu initialItems={items} />
//     </div>
//   );
// }