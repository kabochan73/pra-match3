"use client";

import { useAuth } from "@/lib/auth-context";
import { LoginForm } from "@/components/LoginForm";

export default function CompanyLoginPage() {
  const { loginCompany } = useAuth();

  return (
    <LoginForm
      title="企業ログイン"
      registerHref="/company/register"
      redirectTo="/company/mypage"
      onLogin={loginCompany}
    />
  );
}
