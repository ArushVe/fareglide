'use client';

import { MapPin } from 'lucide-react';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import {
  airportLabel,
  airportMatches,
  POPULAR_AIRPORTS,
  type Airport,
} from '@/data/airports';

type AirportComboboxProps = {
  id: string;
  value: Airport | null;
  onValueChange: (airport: Airport | null) => void;
};

export function AirportCombobox({
  id,
  value,
  onValueChange,
}: AirportComboboxProps) {
  return (
    <Combobox
      items={POPULAR_AIRPORTS}
      value={value}
      onValueChange={onValueChange}
      itemToStringLabel={airportLabel}
      itemToStringValue={(airport) => airport.iata}
      isItemEqualToValue={(airport, selected) => airport.iata === selected.iata}
      filter={airportMatches}
      autoHighlight
      required
    >
      <ComboboxInput
        id={id}
        placeholder="City or airport code"
        aria-label="Destination airport"
        className="h-11 w-full border-white/10 bg-black/15"
        showClear
      />
      <ComboboxContent className="border border-white/10 bg-[#0b1b27] shadow-2xl shadow-black/40">
        <ComboboxEmpty>No matching airport yet.</ComboboxEmpty>
        <ComboboxList>
          {(airport: Airport) => (
            <ComboboxItem
              key={airport.iata}
              value={airport}
              className="gap-3 px-2 py-2"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-cyan-300/10 text-cyan-200">
                <MapPin className="size-3.5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-medium">
                  {airport.city}{' '}
                  <span className="font-mono text-cyan-200">
                    {airport.iata}
                  </span>
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {airport.name} · {airport.country}
                </span>
              </span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
