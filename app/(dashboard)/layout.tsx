import { DashboardShell } from "@/components/layout/dashboard-shell";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Buat client Supabase di sisi Server
  const supabase = await createClient();

  // 2. Ambil data User yang sedang login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // (Opsional) Kalau tidak ada user login, tendang ke halaman login
  if (!user) {
    redirect("/login");
  }

  // 3. Ambil data detail dari tabel 'profiles' (yang sudah kita fix SQL-nya tadi)
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role") // Ambil kolom yang butuh aja
    .eq("id", user.id)
    .single();

  // 4. Siapkan data untuk ditampilkan (Pake fallback biar ga error kalau null)
  const displayName = profile?.full_name || user.email || "User";
  const displayEmail = user.email || "No Email";

  return (
    <DashboardShell
      userProfile={{
        name: displayName, // <-- Nah, sekarang ini dinamis!
        email: displayEmail,
      }}
    >
      {children}
    </DashboardShell>
  );
}