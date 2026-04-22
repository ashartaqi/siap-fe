import { LayoutShell } from "@/components/ui/LayoutShell";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutShell>{children}</LayoutShell>;
}
