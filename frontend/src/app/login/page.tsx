import { BrandMark } from "@/components/layout/app-shell";
import { LoginForm } from "@/components/layout/login-form";

export const metadata = { title: "Staff sign in" };

export default function PersonnelLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-muted px-4 py-12">
      <BrandMark href="/" />
      <div className="mt-8 w-full">
        <LoginForm
          mode="personnel"
          title="Staff sign in"
          subtitle="Use your organization personnel credentials."
          redirectTo="/dashboard"
        />
      </div>
    </div>
  );
}
