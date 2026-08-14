import { signOut } from "@/auth";

export default function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="rounded-sm border border-[#d7dbe3] px-4 py-2 text-sm font-semibold text-[#2b2f38] transition-colors hover:border-brand-red hover:text-brand-red"
      >
        DÉCONNEXION
      </button>
    </form>
  );
}
