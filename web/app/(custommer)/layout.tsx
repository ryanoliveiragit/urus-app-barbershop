import { AppLayout } from "@/components/shared/layout";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}