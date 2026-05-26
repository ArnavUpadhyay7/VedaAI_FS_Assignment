import {
  BookOpen,
  ClipboardList,
  Home,
  Library,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:4000";

export const QUESTION_TYPE_OPTIONS = [
  "Multiple Choice Questions",
  "Short Questions",
  "Numerical Problems",
  "Long Answer Questions",
  "True / False",
] as const;

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

export const MAIN_NAV: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "My Groups", href: "#", icon: Users },
  { label: "Assignments", href: "/assignments", icon: ClipboardList },
  { label: "AI Teacher's Toolkit", href: "#", icon: Sparkles },
  { label: "My Library", href: "#", icon: Library, badge: 32 },
];

export const MOBILE_NAV: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Assignments", href: "/assignments", icon: ClipboardList },
  { label: "Library", href: "#", icon: Library },
  { label: "AI Toolkit", href: "#", icon: Sparkles },
];

export const SCHOOL_NAME = "Delhi Public School, Sector-4, Bokaro";
