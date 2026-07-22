"use client";

import { useAuth } from "@/lib/auth-context";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  const { loginUser } = useAuth();

  return (
    <LoginForm
      title="求職者ログイン"
      registerHref="/seeker/register"
      redirectTo="/seeker/mypage"
      onLogin={loginUser}
    />
  );
}
