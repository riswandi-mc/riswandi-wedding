import { WebsiteSettingsManager } from "@/components/admin/website-settings-manager";
import { getAdminSession, getAdminWebsiteSettings } from "@/lib/data/admin";

export default async function SettingsPage() {
  const [session, settings] = await Promise.all([
    getAdminSession(),
    getAdminWebsiteSettings(),
  ]);

  if (!session) {
    return null;
  }

  return (
    <WebsiteSettingsManager
      initialSettings={settings}
      profile={session.profile}
    />
  );
}
