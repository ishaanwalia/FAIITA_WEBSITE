import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export default async function ChangePasswordPage() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="max-w-sm">
      <h1 className="font-display text-2xl font-bold">
        {admin.mustChangePassword ? "Choose your password" : "Change your password"}
      </h1>
      <p className="mt-2 text-sm text-white/50">
        {admin.mustChangePassword
          ? "The password you were given was generated for you and sent over chat. Replace it before you go any further."
          : "You'll stay signed in on this device."}
      </p>
      <ChangePasswordForm />
    </div>
  );
}
