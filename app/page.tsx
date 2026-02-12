import Link from "next/link";
import Image from "next/image";
import { Cpu, Code, Wrench, Zap, Users, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Division, Profile, News } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  code: Code,
  wrench: Wrench,
  zap: Zap,
  users: Users,
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function LandingPage() {
  const supabase = await createClient();

  const { data: divisionsData = [] } = await supabase
    .from("divisions")
    .select("*")
    .order("name", { ascending: true });

  const { data: membersData = [] } = await supabase
    .from("profiles")
    .select("id, full_name, nim, division_id")
    .order("full_name", { ascending: true });

  const { data: newsData = [] } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);

  const divisions = divisionsData as Division[];
  const members = membersData as Pick<
    Profile,
    "id" | "full_name" | "nim" | "division_id"
  >[];
  const newsList = newsData as News[];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-950 to-primary-900">
      {/* Hero Section */}
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-4 text-center overflow-hidden">
        <Image
          src="/ANGGOTA_ROBOTIC1.jpeg"
          alt="Anggota Robotic Astratech"
          fill
          priority
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Overlay netral agar foto tidak terlalu merah tetapi teks tetap terbaca */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative mb-8">
          <Image
            src="/LOGO_ROBOTIC.jpeg"
            alt="Robotic Astratech"
            width={80}
            height={80}
            className="mx-auto mb-6 h-20 w-20 rounded-full object-cover"
            priority
          />
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
            ROBOTIC ASTRATECH
          </h1>
          <p className="mt-4 text-lg text-primary-200 md:text-xl">
              We Learn, We Build, We Conquer
          </p>
        </div>
        <div className="relative flex flex-wrap justify-center gap-4">
          <Link href="/login">
            <Button
              size="lg"
              className="px-8 py-6 text-lg bg-white text-primary-900 hover:bg-primary-50"
            >
              Masuk Dashboard
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg border-2 border-white bg-transparent text-white hover:bg-white/10"
            >
              Daftar Anggota
            </Button>
          </Link>
        </div>
      </section>

      {/* Divisions & Members Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="text-center">
            <h2 className="mb-3 text-3xl font-bold text-primary-900">
              Divisi ROBOTIC Astratech
            </h2>
            <p className="text-muted-foreground">
              Struktur divisi dan anggota yang terlibat di dalamnya.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {divisions.map((division) => {
              const Icon = iconMap[division.icon_name] || Cpu;
              const divisionMembers = members.filter(
                (m) => m.division_id === division.id,
              );

              return (
                <Card
                  key={division.id}
                  className="flex h-full flex-col border-2 transition-colors hover:border-primary-500"
                >
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                      <Icon className="h-6 w-6 text-primary-900" />
                    </div>
                    <CardTitle className="text-xl">
                      {division.name}
                    </CardTitle>
                    <CardDescription>
                      {divisionMembers.length} anggota aktif
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {divisionMembers.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Belum ada anggota terdaftar pada divisi ini.
                      </p>
                    ) : (
                      <ul className="space-y-1 text-sm">
                        {divisionMembers.slice(0, 6).map((member) => (
                          <li
                            key={member.id}
                            className="flex items-center justify-between"
                          >
                            <span className="font-medium">
                              {member.full_name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {member.nim}
                            </span>
                          </li>
                        ))}
                        {divisionMembers.length > 6 && (
                          <li className="pt-1 text-xs text-muted-foreground">
                            +{divisionMembers.length - 6} anggota lainnya
                          </li>
                        )}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Public News Section */}
      <section className="bg-primary-950/95 px-4 py-16">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div>
              <h2 className="mb-3 text-3xl font-bold text-white">
                Berita &amp; Kegiatan Robotic
              </h2>
              <p className="text-primary-200">
                Informasi pelatihan, lomba, dan open recruitment terbaru.
              </p>
            </div>
            
          </div>

          {newsList.length === 0 ? (
            <div className="rounded-lg border border-primary-800 bg-primary-900/40 p-8 text-center text-primary-200">
              Belum ada berita yang dipublikasikan.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {newsList.map((news) => (
                <Card
                  key={news.id}
                  className="border-primary-800 bg-primary-900/60 text-white"
                >
                  <CardHeader>
                    <div className="mb-2 flex items-center gap-2 text-xs text-primary-200">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(news.created_at)}</span>
                    </div>
                    <CardTitle className="text-lg">{news.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-4 text-primary-100">
                      {news.content}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

