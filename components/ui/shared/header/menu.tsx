import Link from "next/link";
import { ShoppingCartIcon, UserIcon } from "lucide-react";

export default function Menu() {
  return (
    <div className="flex justify-end">
      <nav className="flex gap-3 w-full">
        <Link href={"/sign-in"} className="header-button">
          <UserIcon className="h-8 w-8" />
          <span className="font-bold">Sign In</span>
        </Link>
        <Link href={"/cart"} className="header-button">
          <ShoppingCartIcon className="h-8 w-8" />
          <span className="font-bold">Cart</span>
        </Link>
      </nav>
    </div>
  );
}
