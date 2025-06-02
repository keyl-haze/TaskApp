import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tasks',
  description: 'Manage tasks in the system'
};

export default function TasksLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}