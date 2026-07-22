"use client";

import { useAuth } from "@/lib/auth-context";
import { RegisterForm } from "@/components/RegisterForm";

export default function CompanyRegisterPage() {
  const { registerCompany } = useAuth();

  return (
    <RegisterForm
      title="企業アカウント登録"
      nameLabel="企業名"
      nameAutoComplete="organization"
      loginHref="/company/login"
      redirectTo="/company/mypage"
      onRegister={registerCompany}
    />
  );
}
