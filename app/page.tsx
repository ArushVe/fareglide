'use client';

import { useState } from 'react';
import {
  ArrowRight,
  BellRing,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  History,
  MapPin,
  Plane,
  Search,
  Settings2,
  Sparkles,
} from 'lucide-react';

import { AirportCombobox } from '@/components/airport-combobox';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { airportLabel, findAirport, type Airport } from '@/data/airports';
import { DEFAULT_USER_PREFERENCES } from '@/domain/defaults';

type WatchDraft = {
  destination: Airport | null;
  horizon: string;
  tripType: string;
};

const initialWatch: WatchDraft = {
  destination: findAirport('HKG') ?? null,
  horizon: 'Next 6 months',
  tripType: 'Round trip + one way',
};

export default function Home() {
  const [draft, setDraft] = useState(initialWatch);
  const [savedWatch, setSavedWatch] = useState<WatchDraft | null>(null);
  const [homeAirport, setHomeAirport] = useState(
    DEFAULT_USER_PREFERENCES.homeAirportIata,
  );
  const [showPreferences, setShowPreferences] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const origin = homeAirport || DEFAULT_USER_PREFERENCES.homeAirportIata;
  const savedDestination = savedWatch?.destination
    ? airportLabel(savedWatch.destination)
    : null;

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="relative z-20 border-b border-white/7 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
          <a
            className="flex items-center gap-3"
            href="#top"
            aria-label="FareGlide home"
          >
            <span className="grid size-9 place-items-center rounded-full bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-400/15">
              <Plane className="size-4 -rotate-12" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-[-0.03em]">
              FareGlide
            </span>
          </a>

          <nav
            className="hidden items-center gap-7 text-sm text-muted-foreground md:flex"
            aria-label="Primary navigation"
          >
            <a
              className="transition-colors hover:text-foreground"
              href="#explore"
            >
              Explore fares
            </a>
            <a
              className="transition-colors hover:text-foreground"
              href="#how-it-works"
            >
              How it works
            </a>
            <a
              className="transition-colors hover:text-foreground"
              href="#alerts"
            >
              Price alerts
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
              onClick={() => setAccountOpen(true)}
            >
              Sign in
            </Button>
            <Button
              className="rounded-full bg-white px-5 text-slate-950 hover:bg-cyan-100"
              onClick={() => setAccountOpen(true)}
            >
              Create account
            </Button>
          </div>
        </div>
      </header>

      <section id="top" className="relative isolate">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-16rem] h-[42rem] w-[70rem] -translate-x-1/2 rounded-[50%] bg-cyan-400/8 blur-3xl" />
          <div className="absolute left-[9%] top-40 size-64 rounded-full bg-blue-500/5 blur-3xl" />
          <div className="route-grid absolute inset-0 opacity-30" />
        </div>

        <div className="mx-auto max-w-7xl px-5 pb-14 pt-16 text-center lg:px-8 lg:pb-20 lg:pt-24">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/7 px-3.5 py-1.5 text-xs font-medium text-cyan-200">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Your private flight-price memory
          </div>
          <h1 className="mx-auto mt-6 max-w-4xl text-balance text-4xl font-semibold tracking-[-0.055em] sm:text-5xl lg:text-6xl">
            Stop guessing when to book.
            <span className="block text-cyan-300">Watch the fare move.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            Pick a place. FareGlide remembers its prices, checks flexible dates
            daily, and sends one clear 8:00 AM report when something meaningful
            changes.
          </p>

          <div id="explore" className="mx-auto mt-11 max-w-6xl text-left">
            <form
              className="rounded-[1.75rem] border border-white/10 bg-[#0b1a25]/95 p-3 shadow-2xl shadow-black/35 ring-1 ring-cyan-300/5 backdrop-blur-xl"
              onSubmit={(event) => {
                event.preventDefault();
                if (draft.destination) setSavedWatch(draft);
              }}
            >
              <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(10rem,.8fr)_minmax(11rem,.9fr)_auto] lg:items-end">
                <label
                  htmlFor="watch-origin"
                  className="min-w-0 space-y-2 rounded-2xl px-3 py-2"
                >
                  <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Plane className="size-3.5" aria-hidden="true" />
                    From
                  </span>
                  <Input
                    id="watch-origin"
                    value={origin}
                    readOnly
                    aria-label="Origin airport"
                    className="h-11 w-full border-white/10 bg-black/15 font-semibold"
                  />
                </label>

                <div className="min-w-0 space-y-2 rounded-2xl px-3 py-2">
                  <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <MapPin className="size-3.5" aria-hidden="true" />
                    To
                  </span>
                  <AirportCombobox
                    id="watch-destination"
                    value={draft.destination}
                    onValueChange={(destination) =>
                      setDraft({ ...draft, destination })
                    }
                  />
                </div>

                <label
                  htmlFor="watch-window"
                  className="min-w-0 space-y-2 rounded-2xl px-3 py-2"
                >
                  <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <CalendarDays className="size-3.5" aria-hidden="true" />
                    Travel window
                  </span>
                  <NativeSelect
                    id="watch-window"
                    className="w-full"
                    value={draft.horizon}
                    onChange={(event) =>
                      setDraft({ ...draft, horizon: event.target.value })
                    }
                    aria-label="Travel window"
                  >
                    <NativeSelectOption>Next 3 months</NativeSelectOption>
                    <NativeSelectOption>Next 6 months</NativeSelectOption>
                    <NativeSelectOption>Next 12 months</NativeSelectOption>
                  </NativeSelect>
                </label>

                <label
                  htmlFor="watch-trip-type"
                  className="min-w-0 space-y-2 rounded-2xl px-3 py-2"
                >
                  <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                    Trip type
                  </span>
                  <NativeSelect
                    id="watch-trip-type"
                    className="w-full"
                    value={draft.tripType}
                    onChange={(event) =>
                      setDraft({ ...draft, tripType: event.target.value })
                    }
                    aria-label="Trip type"
                  >
                    <NativeSelectOption>
                      Round trip + one way
                    </NativeSelectOption>
                    <NativeSelectOption>Round trip</NativeSelectOption>
                    <NativeSelectOption>One way</NativeSelectOption>
                  </NativeSelect>
                </label>

                <Button
                  type="submit"
                  size="lg"
                  disabled={!draft.destination}
                  className="m-2 h-11 rounded-xl bg-cyan-300 px-5 text-slate-950 shadow-lg shadow-cyan-400/10 hover:bg-cyan-200 lg:ml-0"
                >
                  <Search data-icon="inline-start" />
                  Watch fare
                </Button>
              </div>

              <div className="flex flex-col gap-3 border-t border-white/7 px-3 pb-1 pt-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  <span>Economy</span>
                  <span>1 traveler</span>
                  <span>1 stop or fewer</span>
                  <span>7–14 nights</span>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-left text-cyan-200 transition-colors hover:text-cyan-100"
                  onClick={() => setShowPreferences((visible) => !visible)}
                  aria-expanded={showPreferences}
                  aria-controls="preferences-panel"
                >
                  <Settings2 className="size-3.5" aria-hidden="true" />
                  Home airport: {origin}
                </button>
              </div>
            </form>

            {showPreferences ? (
              <div
                id="preferences-panel"
                className="mx-auto mt-3 flex max-w-xl flex-col gap-3 rounded-2xl border border-white/9 bg-[#0b1a25] p-4 text-left shadow-xl sm:flex-row sm:items-end"
              >
                <label
                  htmlFor="home-airport"
                  className="flex-1 space-y-2 text-sm"
                >
                  <span className="text-muted-foreground">
                    Home airport code
                  </span>
                  <Input
                    id="home-airport"
                    value={homeAirport}
                    maxLength={3}
                    onChange={(event) =>
                      setHomeAirport(
                        event.target.value
                          .replace(/[^a-z]/gi, '')
                          .toUpperCase(),
                      )
                    }
                    className="h-10 border-white/10 bg-black/15 font-mono uppercase"
                  />
                </label>
                <Button
                  className="h-10 bg-white text-slate-950 hover:bg-cyan-100"
                  disabled={homeAirport.length !== 3}
                  onClick={() => setShowPreferences(false)}
                >
                  Save
                </Button>
              </div>
            ) : null}

            {savedDestination ? (
              <div className="mx-auto mt-4 flex max-w-3xl flex-col gap-3 rounded-2xl border border-emerald-300/15 bg-emerald-300/7 px-5 py-4 text-left sm:flex-row sm:items-center">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-300/15 text-emerald-200">
                  <Check className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-emerald-50">
                    Your watch is ready
                  </p>
                  <p className="mt-0.5 truncate text-sm text-emerald-100/65">
                    {origin} → {savedDestination} · {savedWatch?.horizon} ·
                    first report tomorrow at 8:00 AM
                  </p>
                </div>
                <Button
                  variant="ghost"
                  className="justify-start text-emerald-100 hover:bg-emerald-200/10 hover:text-white"
                >
                  View watch <ChevronRight data-icon="inline-end" />
                </Button>
              </div>
            ) : null}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Clock3 className="size-3.5 text-cyan-300" /> Checks once daily
            </span>
            <span className="inline-flex items-center gap-2">
              <History className="size-3.5 text-cyan-300" /> Builds private
              price history
            </span>
            <span className="inline-flex items-center gap-2">
              <BellRing className="size-3.5 text-cyan-300" /> Emails only useful
              changes
            </span>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-t border-white/7 bg-white/[0.015]"
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[.75fr_1.25fr] md:items-center lg:px-8 lg:py-18">
          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
              Made for flexible travelers
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
              One calm report. No tab-refresh habit.
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              FareGlide turns scattered fare checks into a useful history, then
              tells you when the signal is worth your attention.
            </p>
          </div>
          <div id="alerts" className="grid gap-3 sm:grid-cols-3">
            {[
              [
                '01',
                'Choose broadly',
                'Pick a destination and a flexible time horizon.',
              ],
              [
                '02',
                'We remember',
                'Daily observations become your route’s price history.',
              ],
              [
                '03',
                'You decide',
                'Get a concise booking signal in the morning.',
              ],
            ].map(([number, title, body]) => (
              <article
                key={number}
                className="rounded-2xl border border-white/8 bg-[#091722] p-5 text-left"
              >
                <span className="font-mono text-xs text-cyan-300">
                  {number}
                </span>
                <h3 className="mt-5 font-medium">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={accountOpen} onOpenChange={setAccountOpen}>
        <DialogContent className="border border-white/10 bg-[#0b1a25] p-6 sm:max-w-md">
          <DialogHeader>
            <span className="mb-3 grid size-10 place-items-center rounded-full bg-cyan-300 text-slate-950">
              <Plane className="size-4 -rotate-12" aria-hidden="true" />
            </span>
            <DialogTitle className="text-xl">
              Your FareGlide account
            </DialogTitle>
            <DialogDescription className="leading-6">
              Accounts keep watches, report history, and preferences private
              across devices.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 rounded-xl border border-cyan-300/12 bg-cyan-300/6 p-4 text-sm leading-6 text-cyan-50/80">
            Secure sign-in will activate with the hosted version. No passwords
            will be stored by FareGlide.
          </div>
          <Button
            disabled
            className="mt-1 w-full bg-white text-slate-950 opacity-70"
          >
            Continue securely after publishing
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Local preview · account data is not being collected
          </p>
        </DialogContent>
      </Dialog>
    </main>
  );
}
