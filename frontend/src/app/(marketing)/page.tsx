import Link from "next/link";
import { BrandMark } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";

export const revalidate = 3600; // ISR for marketing

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-muted">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <BrandMark size="lg" />
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-muted hover:text-navy">
            Staff sign in
          </Link>
          <Link href="/admin/login">
            <Button variant="secondary" className="!py-2">
              Admin
            </Button>
          </Link>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-border bg-navy px-6 py-20 text-white sm:py-28">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 70% 20%, #1e3a8a 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 10% 80%, #0ea5e933 0%, transparent 50%)",
            }}
          />
          <div className="relative mx-auto max-w-5xl animate-fade-up">
            <p className="text-sm font-semibold tracking-[0.2em] text-accent-soft uppercase">
              BuzzQ
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Wait anywhere. Know when it&apos;s your turn.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/75">
              A calm virtual queue for clinics, banks, restaurants, and any
              place that still makes people stand in line.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login">
                <Button className="!bg-accent hover:!bg-accent-hover">
                  Open staff dashboard
                </Button>
              </Link>
              <Link href="#how">
                <Button variant="secondary" className="!border-white/20 !bg-white/10 !text-white hover:!bg-white/15">
                  How it works
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="how" className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-3xl font-semibold text-navy">How it works</h2>
          <p className="mt-3 max-w-2xl text-muted">
            One QR code. One ticket. Clear progress — without the crowded lobby.
          </p>
          <ol className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Scan to join",
                body: "Customers scan your queue QR and share a name and phone. No account required.",
              },
              {
                step: "2",
                title: "Get a ticket",
                body: "They receive a clear ticket number and can check how many people are ahead.",
              },
              {
                step: "3",
                title: "Come back when called",
                body: "When their status becomes current, they head to the desk — not a guess.",
              },
            ].map((item) => (
              <li
                key={item.step}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <span className="text-sm font-semibold text-accent">{item.step}</span>
                <h3 className="mt-2 text-lg font-semibold text-navy">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{item.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-border bg-surface px-6 py-16">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-semibold text-navy">
                Built for the people running the queue
              </h2>
              <p className="mt-2 max-w-lg text-muted">
                Staff see who&apos;s waiting, who&apos;s current, and can share a QR
                in seconds.
              </p>
            </div>
            <Link href="/login">
              <Button>Staff sign in</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted">
        © {new Date().getFullYear()} BuzzQ
      </footer>
    </div>
  );
}
