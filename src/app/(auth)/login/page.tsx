import type { Metadata } from "next";
import { LoginForm } from "@/components/Forms/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next, confirm } = await searchParams;
  return (
    <div className="w-full max-w-[400px]">
      <h1 className="font-serif text-[2rem] leading-tight tracking-[-0.02em]">
        Welcome back
      </h1>
      <p className="mt-2 mb-8 text-[15px] leading-relaxed text-slate">
        Sign in to view your case, documents and updates.
      </p>
      <LoginForm
        next={typeof next === "string" ? next : ""}
        notice={
          confirm === "failed"
            ? "That confirmation link has expired or was already used. Please sign in."
            : undefined
        }
      />
    </div>
  );
}
