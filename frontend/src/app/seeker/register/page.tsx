"use client";

import { useAuth } from "@/lib/auth-context";
import { RegisterForm } from "@/components/RegisterForm";

export default function RegisterPage() {
  const { registerUser } = useAuth();

  return (
    <RegisterForm
      title="求職者アカウント登録"
      nameLabel="氏名"
      nameAutoComplete="name"
      loginHref="/seeker/login"
      redirectTo="/seeker/mypage"
      onRegister={registerUser}
    />
  );
}
