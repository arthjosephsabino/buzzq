import { BrandMark } from "@/components/layout/app-shell";
import { LoginForm } from "@/components/layout/login-form";

export const metadata = { title: "Admin sign in" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-muted px-4 py-12">
      <BrandMark href="/admin" />
      <div className="mt-8 w-full">
        <LoginForm
          mode="admin"
          title="Admin sign in"
          subtitle="Platform administrators only. Uses /auth/admins/token."
          redirectTo="/admin"
        />
      </div>
    </div>
  );
}
