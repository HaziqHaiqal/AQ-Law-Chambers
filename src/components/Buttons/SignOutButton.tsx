import { signOut } from "@/app/(auth)/actions";
import { LogOut } from "@/components/Icons";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        aria-label="Sign out"
        title="Sign out"
        className="grid size-9 place-items-center rounded-lg text-slate-light transition-colors hover:bg-white/10 hover:text-white"
      >
        <LogOut className="size-[18px]" />
      </button>
    </form>
  );
}
