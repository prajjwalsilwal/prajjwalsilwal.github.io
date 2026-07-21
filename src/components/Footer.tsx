import { profile } from '@/content/profile';

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-edge px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <p className="text-[13px] text-ink-dim">
          {profile.name} — {profile.role}
        </p>
        <p className="mono-label">
          {profile.location} · © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
