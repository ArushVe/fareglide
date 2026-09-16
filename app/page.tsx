'use client';

import { useState } from 'react';
import {
  ArrowRight,
  Bell,
  CalendarDays,
  MapPin,
  Plane,
  Plus,
  Settings2,
  Sparkles,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AirportCombobox } from '@/components/airport-combobox';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { DEFAULT_USER_PREFERENCES } from '@/domain/defaults';
import { airportLabel, findAirport, type Airport } from '@/data/airports';

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
  const homeAirportName =
    homeAirport === 'SEA' ? 'Seattle-Tacoma' : 'Selected airport';

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-white/8 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl border border-cyan-300/25 bg-cyan-300/10 text-cyan-300">
              <Plane className="size-4 rotate-[-18deg]" aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold tracking-tight">FareGlide</p>
              <p className="text-xs text-muted-foreground">
                Local fare intelligence
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="border-white/10 bg-white/3"
            aria-expanded={showPreferences}
            aria-controls="preferences-panel"
            onClick={() => setShowPreferences((visible) => !visible)}
          >
            <Settings2 data-icon="inline-start" />
            Preferences
          </Button>
        </div>
      </header>

      {showPreferences ? (
        <section
          id="preferences-panel"
          className="border-b border-white/8 bg-[#091722]"
          aria-label="Travel preferences"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-end lg:px-8">
            <label
              htmlFor="home-airport"
              className="w-full max-w-xs space-y-2 text-sm"
            >
              <span className="text-muted-foreground">Home airport</span>
              <Input
                id="home-airport"
                value={homeAirport}
                maxLength={3}
                onChange={(event) =>
                  setHomeAirport(
                    event.target.value.replace(/[^a-z]/gi, '').toUpperCase(),
                  )
                }
                className="h-10 border-white/10 bg-black/15 font-mono uppercase"
                aria-describedby="home-airport-help"
              />
            </label>
            <p
              id="home-airport-help"
              className="max-w-md pb-2 text-xs leading-5 text-muted-foreground"
            >
              New watches start here. Enter the three-letter airport code; each
              watch can override it later.
            </p>
            <Button
              className="h-10 bg-cyan-300 text-slate-950 hover:bg-cyan-200 sm:ml-auto"
              disabled={homeAirport.length !== 3}
              onClick={() => setShowPreferences(false)}
            >
              Save preference
            </Button>
          </div>
        </section>
      ) : null}

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 lg:grid-cols-[230px_minmax(0,1fr)] lg:px-8">
        <aside className="rounded-2xl border border-white/8 bg-card/65 p-4 lg:min-h-[calc(100vh-8.75rem)]">
          <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Workspace
          </p>
          <nav className="mt-3 space-y-1" aria-label="Main navigation">
            <a
              className="flex items-center gap-3 rounded-xl bg-cyan-300/10 px-3 py-2.5 text-sm font-medium text-cyan-200"
              href="#watch"
            >
              <MapPin className="size-4" aria-hidden="true" />
              Explore
            </a>
            <a
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/4 hover:text-foreground"
              href="#watches"
            >
              <CalendarDays className="size-4" aria-hidden="true" />
              My watches
            </a>
            <a
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/4 hover:text-foreground"
              href="#reports"
            >
              <Bell className="size-4" aria-hidden="true" />
              Daily reports
            </a>
          </nav>

          <section className="mt-8 rounded-xl border border-white/8 bg-[#071521] p-4">
            <p className="text-xs text-muted-foreground">Home airport</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-cyan-300/10 font-mono text-sm font-semibold text-cyan-200">
                {homeAirport || DEFAULT_USER_PREFERENCES.homeAirportIata}
              </span>
              <div>
                <p className="text-sm font-medium">{homeAirportName}</p>
                <p className="text-xs text-muted-foreground">
                  Pacific time · USD
                </p>
              </div>
            </div>
          </section>
        </aside>

        <div className="min-w-0 space-y-6">
          <section
            id="watch"
            className="overflow-hidden rounded-3xl border border-white/8 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_34%),linear-gradient(145deg,rgba(15,35,49,0.96),rgba(7,18,29,0.98))] p-6 shadow-2xl shadow-black/20 md:p-8"
          >
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
              <div className="max-w-2xl">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  New flexible watch
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] md:text-4xl">
                  Where do you want to go?
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
                  Start with a destination. FareGlide will check flexible dates
                  from {homeAirport || 'your home airport'} once a day and build
                  your private price history.
                </p>
              </div>
              <span className="w-fit rounded-full border border-emerald-300/20 bg-emerald-300/8 px-3 py-1.5 text-xs font-medium text-emerald-200">
                Daily collection
              </span>
            </div>

            <form
              className="mt-8 grid gap-4 md:grid-cols-[0.8fr_1.4fr_1fr_1fr_auto] md:items-end"
              onSubmit={(event) => {
                event.preventDefault();
                setSavedWatch(draft);
              }}
            >
              <label htmlFor="watch-origin" className="space-y-2 text-sm">
                <span className="text-muted-foreground">From</span>
                <Input
                  id="watch-origin"
                  value={
                    homeAirport || DEFAULT_USER_PREFERENCES.homeAirportIata
                  }
                  readOnly
                  aria-label="Origin airport"
                  className="h-11 border-white/10 bg-black/15 font-medium"
                />
              </label>
              <div className="space-y-2 text-sm">
                <span className="text-muted-foreground">Destination</span>
                <AirportCombobox
                  id="watch-destination"
                  value={draft.destination}
                  onValueChange={(destination) =>
                    setDraft({ ...draft, destination })
                  }
                />
              </div>
              <label htmlFor="watch-window" className="space-y-2 text-sm">
                <span className="text-muted-foreground">When</span>
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
              <label htmlFor="watch-trip-type" className="space-y-2 text-sm">
                <span className="text-muted-foreground">Track</span>
                <NativeSelect
                  id="watch-trip-type"
                  className="w-full"
                  value={draft.tripType}
                  onChange={(event) =>
                    setDraft({ ...draft, tripType: event.target.value })
                  }
                  aria-label="Trip type"
                >
                  <NativeSelectOption>Round trip + one way</NativeSelectOption>
                  <NativeSelectOption>Round trip</NativeSelectOption>
                  <NativeSelectOption>One way</NativeSelectOption>
                </NativeSelect>
              </label>
              <Button
                type="submit"
                size="lg"
                className="h-11 bg-cyan-300 px-4 text-slate-950 hover:bg-cyan-200"
              >
                <Plus data-icon="inline-start" />
                Add watch
              </Button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full border border-white/8 bg-white/3 px-3 py-1.5">
                Economy
              </span>
              <span className="rounded-full border border-white/8 bg-white/3 px-3 py-1.5">
                1 traveler
              </span>
              <span className="rounded-full border border-white/8 bg-white/3 px-3 py-1.5">
                {DEFAULT_USER_PREFERENCES.defaultMaximumStops} stop or fewer
              </span>
              <span className="rounded-full border border-white/8 bg-white/3 px-3 py-1.5">
                7–14 nights
              </span>
            </div>
          </section>

          <section
            id="watches"
            className="grid gap-4 md:grid-cols-[1.35fr_0.65fr]"
          >
            <article className="rounded-2xl border border-white/8 bg-card/60 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Preview watch
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-lg font-semibold">
                    <span>
                      {homeAirport || DEFAULT_USER_PREFERENCES.homeAirportIata}
                    </span>
                    <ArrowRight
                      className="size-4 text-cyan-300"
                      aria-hidden="true"
                    />
                    <span>
                      {savedWatch?.destination
                        ? airportLabel(savedWatch.destination)
                        : 'Hong Kong (HKG)'}
                    </span>
                  </div>
                </div>
                <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-muted-foreground">
                  {savedWatch ? 'Watch staged' : 'Draft'}
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ['Window', savedWatch?.horizon || 'Next 6 months'],
                  ['Trip length', '7–14 nights'],
                  ['Trips', savedWatch?.tripType || 'Both types'],
                  ['Refresh', 'Once daily'],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/7 bg-black/10 p-3"
                  >
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="mt-1 text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </article>

            <article
              id="reports"
              className="rounded-2xl border border-white/8 bg-card/60 p-5"
            >
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Next report
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-tight">
                Tomorrow · 8:00 AM
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Cheapest dates, day-over-day movement, and an evidence-based
                booking signal.
              </p>
            </article>
          </section>
        </div>
      </div>
    </main>
  );
}
