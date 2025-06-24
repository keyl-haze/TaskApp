import AuthLayout from '@/app/layouts/auth/authLayout';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import LoginForm from '@/components/custom/auth/loginForm';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return (
      <AuthLayout header="Dashboard">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
          <p className="mt-2 text-gray-600">
            This is your main dashboard area.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <div>
      <LoginForm />
    </div>
  );
}