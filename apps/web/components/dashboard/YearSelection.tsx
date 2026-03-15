"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface YearSelectionProps {
  value: number;
  years: number[];
}

export default function YearSelection({ value, years }: YearSelectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleYearChange = (newYear: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('year', newYear);
    params.set('quarter', 'year');
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={value.toString()} onValueChange={handleYearChange}>
        <SelectTrigger className="w-28">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
