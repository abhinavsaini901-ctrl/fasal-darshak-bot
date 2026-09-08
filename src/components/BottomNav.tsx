import { Link } from "@tanstack/react-router";
import { Home, ScanLine, Users, User } from "lucide-react";

const ITEMS = [
  { to: "/", label: "होम", Icon: Home, exact: true },
  { to: "/scanner", label: "स्कैन", Icon: ScanLine, exact: false },
  { to: "/community", label: "समुदाय", Icon: Users, exact: false },
  { to: "/profile", label: "प्रोफ़ाइल", Icon: User, exact: false },
] as const;

export function BottomNav() {
  return (
    <nav
      aria-label="मुख्य नेविगेशन"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-lg items-stretch">
        {ITEMS.map(({ to, label, Icon, exact }) => (
          <li key={to} className="flex-1">
            <Link
              to={to}
              activeOptions={{ exact }}
              className="flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium text-muted-foreground"
              activeProps={{ className: "text-primary font-bold" }}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
