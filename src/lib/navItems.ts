import {
  LayoutDashboard,
  Users,
  User,
  UserStar,
  Table2,
  Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { UCLIcon } from "@/components/icons/UCLIcon";

export interface NavItem {
  href: string;
  label: string;
  Icon: LucideIcon | React.FC<{ size?: number; className?: string }>;
  iconHoverClass: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "DASHBOARD",
    Icon: LayoutDashboard,
    iconHoverClass: "group-hover:stroke-[var(--color-neon)]",
  },
  {
    href: "/dream-player",
    label: "DREAM PLAYER",
    Icon: UserStar,
    iconHoverClass: "group-hover:stroke-[var(--color-neon)]",
  },
  {
    href: "/dream-team",
    label: "DREAM TEAM",
    Icon: Users,
    iconHoverClass: "group-hover:stroke-[var(--color-neon)]",
  },
  {
    href: "/league-standings",
    label: "LEAGUE STANDINGS",
    Icon: Table2,
    iconHoverClass: "group-hover:stroke-[var(--color-neon)]",
  },
  {
    href: "/ucl",
    label: "UCL",
    Icon: UCLIcon,
    iconHoverClass: "group-hover:fill-[var(--color-neon)]",
  },
  {
    href: "/players",
    label: "PLAYERS",
    Icon: User,
    iconHoverClass: "group-hover:fill-[var(--color-neon)]",
  },
  {
    href: "/teams",
    label: "TEAMS",
    Icon: Shield,
    iconHoverClass: "group-hover:stroke-[var(--color-neon)]",
  },
];
