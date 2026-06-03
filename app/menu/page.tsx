// app/menu/page.tsx
import EnhancedBakeryMenu from "@/components/Menu";
import { getJsonBakeryMenu } from "@/actions/menu";

export const dynamic = "force-dynamic";

export default async function MenuPage() {

  const items = await getJsonBakeryMenu();

  return (
    <div>
      <EnhancedBakeryMenu initialItems={items} />
    </div>
  );
}