"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Language = "id" | "en";

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Settings page
    "app.settings": "Settings",
    "app.settings.description": "Account details and application preferences",
    "app.settings.account": "Account",
    "app.settings.account.description":
      "Basic information for your Robotic Astratech account.",
    "app.settings.application": "Application",
    "app.settings.application.description":
      "Display and language preferences. Stored in your browser.",

    // Preferences section
    "preferences.theme": "Theme",
    "preferences.language": "Language",
    "preferences.theme.light": "Light",
    "preferences.theme.dark": "Dark",
    "preferences.language.id": "Bahasa Indonesia",
    "preferences.language.en": "English",
    "preferences.note":
      "Preferences are stored in your browser (localStorage). Theme affects the whole app, and language is used for UI translations.",

    // Header
    "header.settings": "Settings",
    "header.logout": "Log out",

    // Sidebar navigation
    "nav.dashboard": "Dashboard",
    "nav.members": "Members",
    "nav.divisions": "Divisions",
    "nav.tasks": "Tasks",
    "nav.news": "News",
    "nav.events": "Events",
    "nav.competitions": "Competitions",
    "nav.profile": "Profile",
    "nav.admin": "Admin",

    // Breadcrumbs
    "breadcrumbs.dashboard": "Dashboard",

    // Profile page
    "profile.title": "My Profile",
    "profile.subtitle": "Manage your profile information and experience",
    "profile.section.info": "Profile Information",
    "profile.section.info.description":
      "Your personal information and account details",
    "profile.label.email": "Email:",
    "profile.label.nim": "NIM:",
    "profile.label.division": "Division:",
    "profile.section.experience": "Experience & Background",
    "profile.section.experience.description":
      "Share your experience and background",
    "profile.form.full_name": "Full Name",
    "profile.avatar.hint": "Click your avatar above to change profile photo (JPG, PNG, max 2MB).",
    "profile.avatar.error.type": "Only image files (JPG, PNG, GIF, WebP) are allowed.",
    "profile.avatar.error.size": "Maximum file size is 2 MB.",
    "profile.avatar.error.upload": "Failed to upload photo. Please try again.",
    "profile.form.experience": "Experience",
    "profile.form.experience.placeholder":
      "Describe your experience and background...",
    "profile.button.edit": "Edit",
    "profile.button.save": "Save Changes",
    "profile.button.saving": "Saving...",
    "profile.button.cancel": "Cancel",
    "profile.empty.experience": "No experience added yet.",

    // Dashboard page
    "dashboard.title": "Dashboard",
    "dashboard.subtitle": "Overview of Robotic Astratech operations",
    "dashboard.cards.total_divisions.title": "Total Divisions",
    "dashboard.cards.total_divisions.description":
      "Registered organization divisions",
    "dashboard.cards.total_members.title": "Total Members",
    "dashboard.cards.total_members.description": "Across all divisions",
    "dashboard.cards.active_projects.title": "Active Projects",
    "dashboard.cards.active_projects.description":
      "Lomba yang sedang berlangsung",
    "dashboard.cards.completion_rate.title": "Win Rate",
    "dashboard.cards.completion_rate.description":
      "Win rate from completed competitions",

    // Competitions page
    "competitions.title": "Competitions",
    "competitions.subtitle": "Competitions we participate in and their results",
    "competitions.card.title": "All Competitions",
    "competitions.form.title.placeholder": "Competition name (e.g., KRTI 2025)",
    "competitions.form.description.placeholder": "Description...",
    "competitions.button.add": "Add Competition",
    "competitions.status.ongoing": "Ongoing",
    "competitions.status.completed": "Completed",
    "competitions.result.win": "Win",
    "competitions.result.lose": "Lose",
    "competitions.result.pending": "Pending",
    "competitions.button.setResult": "Set Result",
    "competitions.button.save": "Save",
    "competitions.button.delete": "Delete",
    "competitions.confirm.delete": "Are you sure you want to delete this competition?",
    "competitions.empty": "No competitions yet. Add one to get started.",

    // Members page
    "members.title": "Members",
    "members.subtitle": "Manage and view all organization members",
    "members.card.title": "Member List",
    "members.table.header.name": "Name",
    "members.table.header.nim": "NIM",
    "members.table.header.division": "Division",
    "members.table.header.role": "Role",

    // Divisions page (user)
    "divisions.title": "Divisions",
    "divisions.subtitle": "Manage organization divisions and teams",
    "divisions.card.description.prefix": "View and manage",
    "divisions.card.description.suffix":
      "division members and tasks",

    // Events page
    "events.title": "Event Calendar",
    "events.subtitle": "View upcoming UKM activities and events",
    "events.form.title.placeholder": "Event title",
    "events.form.date.placeholder": "Event date & time",
    "events.form.location.placeholder": "Location",
    "events.form.description.placeholder": "Event description...",
    "events.button.add": "Add Event",
    "events.section.upcoming": "Upcoming Events",
    "events.section.past": "Past Events",
    "events.badge.upcoming": "Upcoming",
    "events.badge.past": "Past",
    "events.empty": "No events scheduled at this time.",

    // News page
    "news.title": "Competition News",
    "news.subtitle": "Stay updated with the latest news and announcements",
    "news.form.title.placeholder": "News title",
    "news.form.content.placeholder": "News content...",
    "news.button.add": "Add News",
    "news.card.author": "Author",
    "news.empty": "No news articles available at this time.",

    // Tasks / Jobdesk page
    "tasks.title": "Tasks",
    "tasks.subtitle": "Manage and track tasks across all divisions",
    "tasks.form.title.placeholder": "Task title",
    "tasks.form.assign.placeholder": "Assign to member",
    "tasks.form.priority.low": "Low priority",
    "tasks.form.priority.high": "High priority",
    "tasks.form.description.placeholder": "Task description...",
    "tasks.button.add": "Add Task",
    "tasks.badge.priority.low": "low priority",
    "tasks.badge.priority.high": "high priority",
    "tasks.empty": "No tasks assigned to this division",
    "tasks.empty.myTasks": "No tasks assigned to you yet.",
    "tasks.myTasks": "My Tasks",

    // Admin dashboard
    "admin.dashboard.title": "Admin Dashboard",
    "admin.dashboard.subtitle":
      "Manage divisions, members, and system settings",
    "admin.dashboard.divisions.card.title": "Manage Divisions",
    "admin.dashboard.divisions.card.description":
      "Create, edit, and delete divisions",
    "admin.dashboard.divisions.button":
      "Go to Divisions Management",
    "admin.dashboard.members.card.title": "Manage Members",
    "admin.dashboard.members.card.description":
      "Edit member roles and divisions",
    "admin.dashboard.members.button":
      "Go to Members Management",

    // Admin members
    "admin.members.title": "Manage Members",
    "admin.members.subtitle": "Edit member roles and divisions",
    "admin.members.card.title": "All Members",
    "admin.members.table.header.name": "Name",
    "admin.members.table.header.nim": "NIM",
    "admin.members.table.header.division": "Division",
    "admin.members.table.header.role": "Role",
    "admin.members.table.header.actions": "Actions",
    "admin.members.dialog.title": "Edit Member",
    "admin.members.dialog.description":
      "Update the member's role and division assignment.",
    "admin.members.form.role.label": "Role",
    "admin.members.form.role.member": "Member",
    "admin.members.form.role.admin": "Admin",
    "admin.members.form.division.label": "Division",
    "admin.members.form.division.placeholder": "Select a division",
    "admin.members.button.cancel": "Cancel",
    "admin.members.button.update": "Update",
    "admin.members.confirm.delete":
      "Are you sure you want to delete this member?",

    // Admin divisions
    "admin.divisions.title": "Manage Divisions",
    "admin.divisions.subtitle":
      "Create, edit, and delete organization divisions",
    "admin.divisions.button.add": "Add Division",
    "admin.divisions.dialog.create.title": "Create Division",
    "admin.divisions.dialog.create.description":
      "Add a new division to the organization.",
    "admin.divisions.dialog.edit.title": "Edit Division",
    "admin.divisions.dialog.edit.description":
      "Update the division information below.",
    "admin.divisions.form.name.label": "Division Name",
    "admin.divisions.form.name.placeholder": "e.g., Programmer",
    "admin.divisions.form.icon.label": "Icon",
    "admin.divisions.form.icon.placeholder": "Select an icon",
    "admin.divisions.button.cancel": "Cancel",
    "admin.divisions.button.update": "Update",
    "admin.divisions.button.create": "Create",
    "admin.divisions.confirm.delete":
      "Are you sure you want to delete this division?",
  },
  id: {
    // Halaman pengaturan
    "app.settings": "Pengaturan",
    "app.settings.description":
      "Detail akun dan preferensi aplikasi kamu.",
    "app.settings.account": "Akun",
    "app.settings.account.description":
      "Informasi dasar akun Robotic Astratech kamu.",
    "app.settings.application": "Aplikasi",
    "app.settings.application.description":
      "Pengaturan tampilan dan bahasa. Disimpan di browser kamu.",

    // Bagian preferensi
    "preferences.theme": "Tema",
    "preferences.language": "Bahasa",
    "preferences.theme.light": "Terang",
    "preferences.theme.dark": "Gelap",
    "preferences.language.id": "Bahasa Indonesia",
    "preferences.language.en": "English",
    "preferences.note":
      "Pilihan disimpan di browser kamu (localStorage). Tema langsung berlaku ke seluruh aplikasi, dan bahasa dipakai untuk menerjemahkan UI.",

    // Header
    "header.settings": "Pengaturan",
    "header.logout": "Keluar",

    // Navigasi sidebar
    "nav.dashboard": "Dasbor",
    "nav.members": "Anggota",
    "nav.divisions": "Divisi",
    "nav.tasks": "Tugas",
    "nav.news": "Berita",
    "nav.events": "Acara",
    "nav.competitions": "Lomba",
    "nav.profile": "Profil",
    "nav.admin": "Admin",

    // Breadcrumbs
    "breadcrumbs.dashboard": "Dasbor",

    // Halaman profil
    "profile.title": "Profil Saya",
    "profile.subtitle":
      "Atur informasi profil dan pengalaman kamu",
    "profile.section.info": "Informasi Profil",
    "profile.section.info.description":
      "Informasi pribadi dan detail akun kamu",
    "profile.label.email": "Email:",
    "profile.label.nim": "NIM:",
    "profile.label.division": "Divisi:",
    "profile.section.experience": "Pengalaman & Latar Belakang",
    "profile.section.experience.description":
      "Ceritakan pengalaman dan latar belakang kamu",
    "profile.form.full_name": "Nama Lengkap",
    "profile.avatar.hint": "Klik avatar di atas untuk mengganti foto profil (JPG, PNG, maks 2MB).",
    "profile.avatar.error.type": "Hanya file gambar (JPG, PNG, GIF, WebP) yang diizinkan.",
    "profile.avatar.error.size": "Ukuran file maksimal 2 MB.",
    "profile.avatar.error.upload": "Gagal mengunggah foto. Silakan coba lagi.",
    "profile.form.experience": "Pengalaman",
    "profile.form.experience.placeholder":
      "Jelaskan pengalaman dan latar belakang kamu...",
    "profile.button.edit": "Ubah",
    "profile.button.save": "Simpan Perubahan",
    "profile.button.saving": "Menyimpan...",
    "profile.button.cancel": "Batal",
    "profile.empty.experience": "Belum ada pengalaman yang ditambahkan.",

    // Halaman dashboard
    "dashboard.title": "Dasbor",
    "dashboard.subtitle": "Ringkasan operasional Robotic Astratech",
    "dashboard.cards.total_divisions.title": "Total Divisi",
    "dashboard.cards.total_divisions.description":
      "Jumlah divisi organisasi yang terdaftar",
    "dashboard.cards.total_members.title": "Total Anggota",
    "dashboard.cards.total_members.description":
      "Tersebar di seluruh divisi",
    "dashboard.cards.active_projects.title": "Proyek Aktif",
    "dashboard.cards.active_projects.description":
      "Lomba yang sedang berlangsung",
    "dashboard.cards.completion_rate.title": "Win Rate",
    "dashboard.cards.completion_rate.description":
      "Win rate dari lomba yang sudah selesai",

    // Halaman lomba
    "competitions.title": "Lomba",
    "competitions.subtitle": "Lomba yang diikuti dan hasilnya",
    "competitions.card.title": "Semua Lomba",
    "competitions.form.title.placeholder": "Nama lomba (contoh: KRTI 2025)",
    "competitions.form.description.placeholder": "Deskripsi...",
    "competitions.button.add": "Tambah Lomba",
    "competitions.status.ongoing": "Berlangsung",
    "competitions.status.completed": "Selesai",
    "competitions.result.win": "Menang",
    "competitions.result.lose": "Kalah",
    "competitions.result.pending": "Menunggu",
    "competitions.button.setResult": "Set Hasil",
    "competitions.button.save": "Simpan",
    "competitions.button.delete": "Hapus",
    "competitions.confirm.delete": "Yakin ingin menghapus lomba ini?",
    "competitions.empty": "Belum ada lomba. Tambahkan untuk memulai.",

    // Halaman anggota
    "members.title": "Anggota",
    "members.subtitle": "Kelola dan lihat seluruh anggota organisasi",
    "members.card.title": "Daftar Anggota",
    "members.table.header.name": "Nama",
    "members.table.header.nim": "NIM",
    "members.table.header.division": "Divisi",
    "members.table.header.role": "Peran",

    // Halaman divisi (user)
    "divisions.title": "Divisi",
    "divisions.subtitle": "Kelola divisi dan tim organisasi",
    "divisions.card.description.prefix": "Lihat dan kelola divisi",
    "divisions.card.description.suffix":
      "beserta anggota dan tugasnya",

    // Halaman event
    "events.title": "Kalender Kegiatan",
    "events.subtitle": "Lihat jadwal kegiatan dan event UKM",
    "events.form.title.placeholder": "Judul kegiatan",
    "events.form.date.placeholder": "Tanggal & waktu kegiatan",
    "events.form.location.placeholder": "Lokasi",
    "events.form.description.placeholder": "Deskripsi kegiatan...",
    "events.button.add": "Tambah Kegiatan",
    "events.section.upcoming": "Kegiatan Mendatang",
    "events.section.past": "Kegiatan Selesai",
    "events.badge.upcoming": "Mendatang",
    "events.badge.past": "Selesai",
    "events.empty": "Belum ada kegiatan yang terjadwal.",

    // Halaman berita
    "news.title": "Berita Kompetisi",
    "news.subtitle":
      "Selalu update dengan berita dan pengumuman terbaru",
    "news.form.title.placeholder": "Judul berita",
    "news.form.content.placeholder": "Isi berita...",
    "news.button.add": "Tambah Berita",
    "news.card.author": "Penulis",
    "news.empty": "Belum ada berita yang tersedia.",

    // Halaman tugas / jobdesk
    "tasks.title": "Tugas",
    "tasks.subtitle":
      "Kelola dan pantau tugas untuk setiap divisi",
    "tasks.form.title.placeholder": "Judul tugas",
    "tasks.form.assign.placeholder": "Tugaskan ke anggota",
    "tasks.form.priority.low": "Prioritas rendah",
    "tasks.form.priority.high": "Prioritas tinggi",
    "tasks.form.description.placeholder": "Deskripsi tugas...",
    "tasks.button.add": "Tambah Tugas",
    "tasks.badge.priority.low": "prioritas rendah",
    "tasks.badge.priority.high": "prioritas tinggi",
    "tasks.empty": "Belum ada tugas untuk divisi ini.",
    "tasks.empty.myTasks": "Belum ada tugas yang ditugaskan kepadamu.",
    "tasks.myTasks": "Tugas Saya",

    // Dashboard admin
    "admin.dashboard.title": "Dasbor Admin",
    "admin.dashboard.subtitle":
      "Kelola divisi, anggota, dan pengaturan sistem",
    "admin.dashboard.divisions.card.title": "Kelola Divisi",
    "admin.dashboard.divisions.card.description":
      "Buat, ubah, dan hapus divisi",
    "admin.dashboard.divisions.button":
      "Buka Pengelolaan Divisi",
    "admin.dashboard.members.card.title": "Kelola Anggota",
    "admin.dashboard.members.card.description":
      "Ubah peran dan divisi anggota",
    "admin.dashboard.members.button":
      "Buka Pengelolaan Anggota",

    // Admin anggota
    "admin.members.title": "Kelola Anggota",
    "admin.members.subtitle": "Ubah peran dan divisi anggota",
    "admin.members.card.title": "Semua Anggota",
    "admin.members.table.header.name": "Nama",
    "admin.members.table.header.nim": "NIM",
    "admin.members.table.header.division": "Divisi",
    "admin.members.table.header.role": "Peran",
    "admin.members.table.header.actions": "Aksi",
    "admin.members.dialog.title": "Ubah Anggota",
    "admin.members.dialog.description":
      "Perbarui peran dan divisi untuk anggota ini.",
    "admin.members.form.role.label": "Peran",
    "admin.members.form.role.member": "Anggota",
    "admin.members.form.role.admin": "Admin",
    "admin.members.form.division.label": "Divisi",
    "admin.members.form.division.placeholder": "Pilih divisi",
    "admin.members.button.cancel": "Batal",
    "admin.members.button.update": "Perbarui",
    "admin.members.confirm.delete":
      "Yakin ingin menghapus anggota ini?",

    // Admin divisi
    "admin.divisions.title": "Kelola Divisi",
    "admin.divisions.subtitle":
      "Buat, ubah, dan hapus divisi organisasi",
    "admin.divisions.button.add": "Tambah Divisi",
    "admin.divisions.dialog.create.title": "Buat Divisi",
    "admin.divisions.dialog.create.description":
      "Tambahkan divisi baru ke organisasi.",
    "admin.divisions.dialog.edit.title": "Ubah Divisi",
    "admin.divisions.dialog.edit.description":
      "Perbarui informasi divisi di bawah ini.",
    "admin.divisions.form.name.label": "Nama Divisi",
    "admin.divisions.form.name.placeholder": "contoh: Programmer",
    "admin.divisions.form.icon.label": "Ikon",
    "admin.divisions.form.icon.placeholder": "Pilih ikon",
    "admin.divisions.button.cancel": "Batal",
    "admin.divisions.button.update": "Perbarui",
    "admin.divisions.button.create": "Buat",
    "admin.divisions.confirm.delete":
      "Yakin ingin menghapus divisi ini?",
  },
};

const getTranslation = (language: Language, key: string): string => {
  const langTable = translations[language];
  return langTable[key] ?? translations.en[key] ?? key;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>("id");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("ra-language") as
      | Language
      | null;
    const initial: Language = stored === "en" ? "en" : "id";
    setLanguageState(initial);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", initial);
    }
  }, []);

  const setLanguage = (value: Language) => {
    setLanguageState(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("ra-language", value);
    }
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", value);
    }
  };

  const t = (key: string): string => getTranslation(language, key);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}

export function useTranslations(): (key: string) => string {
  const { t } = useLanguage();
  return t;
}

