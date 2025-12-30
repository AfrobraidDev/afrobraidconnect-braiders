import createMiddleware from "next-intl/middleware";
import { routing } from "./navigation";

export default createMiddleware(routing);

export const config = {
  matcher: ["/", "/(de|en|fr)/:path*"],
};
