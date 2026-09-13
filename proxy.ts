import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { getSetting } from "./lib/actions/setting.actions";

const publicPages = [
  "/",
  "/search",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password/(.*)",
  "/cart",
  "/cart/(.*)",
  "/product/(.*)",
  "/page/(.*)",
  "/maintenance",
  // (/secret requires auth)
];

// Pages that must stay reachable even while maintenance mode is on, so an
// admin is never locked out of the one place that can turn it back off.
// Sign-up is deliberately NOT included - there's no admin-lockout reason to
// let new accounts be created while the store is supposedly down.
const maintenanceBypassPages = [
  "/sign-in",
  "/forgot-password",
  "/reset-password/(.*)",
  "/maintenance",
];

const intlMiddleware = createMiddleware(routing);
const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const pathname = req.nextUrl.pathname;

  const isAdmin = req.auth?.user?.role === "Admin";
  const maintenanceBypassRegex = RegExp(
    `^(/(${routing.locales.join("|")}))?(${maintenanceBypassPages.join("|")})/?$`,
    "i"
  );
  const isMaintenanceBypassPage = maintenanceBypassRegex.test(pathname);

  if (!isAdmin && !isMaintenanceBypassPage) {
    const { common } = await getSetting();
    if (common.isMaintenanceMode) {
      return Response.redirect(new URL("/maintenance", req.nextUrl.origin));
    }
  }

  const publicPathnameRegex = RegExp(
    `^(/(${routing.locales.join("|")}))?(${publicPages
      .flatMap((p) => (p === "/" ? ["", "/"] : p))
      .join("|")})/?$`,
    "i"
  );
  const isPublicPage = publicPathnameRegex.test(pathname);

  if (isPublicPage) {
    // return NextResponse.next()
    return intlMiddleware(req);
  } else {
    if (!req.auth) {
      const newUrl = new URL(
        `/sign-in?callbackUrl=${encodeURIComponent(pathname) || "/"}`,
        req.nextUrl.origin
      );
      return Response.redirect(newUrl);
    } else {
      return intlMiddleware(req);
    }
  }
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
