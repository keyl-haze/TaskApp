import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Manage projects in the system",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}