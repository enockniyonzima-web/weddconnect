import { getSessionUser } from "@/server-actions/user.actions";
import { fetchClientById } from "@/server-actions/client.actions";
import { SClientSettings } from "@/select-types/client";
import { redirect } from "next/navigation";
import { ProfileSettingsForm } from "@/components/forms/profile/ProfileSettingsForm";

export default async function ProfileSettingsPage() {
  const { user } = await getSessionUser();
  if (!user) redirect("/auth/login");
  if (!user.client) redirect("/");

  const client = await fetchClientById(user.client.id, SClientSettings);
  if (!client) redirect("/");

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <div>
        <h2 className="text-base font-bold text-white">Account Settings</h2>
        <p className="text-xs text-gray-500 mt-0.5">Update your personal information</p>
      </div>
      <ProfileSettingsForm client={client} />
    </div>
  );
}
