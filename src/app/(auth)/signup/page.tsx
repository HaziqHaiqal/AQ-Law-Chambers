import type { Metadata } from "next";
import { SignupForm } from "@/components/Forms/SignupForm";

export const metadata: Metadata = { title: "Create an account" };

export default async function SignupPage({
  searchParams,
}: PageProps<"/signup">) {
  const { email, name } = await searchParams;
  return (
    <div className="w-full max-w-[460px]">
      <h1 className="font-serif text-[2rem] leading-tight tracking-[-0.02em]">
        Create your account
      </h1>
      <p className="mt-2 mb-7 text-[15px] leading-relaxed text-slate">
        After you register, the firm will link your case to this account.
      </p>
      <SignupForm
        defaults={{
          email: typeof email === "string" ? email : undefined,
          full_name: typeof name === "string" ? name : undefined,
        }}
      />
    </div>
  );
}
