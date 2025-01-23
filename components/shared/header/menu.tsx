import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";
import CartButton from "./cart-button";

export default function Menu() {
  return (
    <div className="flex justify-end">
      <nav className="flex gap-3 w-full ">
        <Link href={"/sign-in"} className="flex items-center header-button">
          Hello, Sign In
        </Link>
        <CartButton />
      </nav>
    </div>
  );
}
