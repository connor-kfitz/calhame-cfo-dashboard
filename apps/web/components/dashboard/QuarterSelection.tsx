"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Quarter, QUARTER_OPTIONS } from "@repo/shared";

interface QuarterSelectionProps {
  value: Quarter;
  year: number;
  quarters: Quarter[];
}

export default function QuarterSelection({ value = "year", year, quarters }: QuarterSelectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleQuarterChange = (newQuarter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('quarter', newQuarter);
    params.set('year', year.toString());
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={value} onValueChange={handleQuarterChange}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Period" />
        </SelectTrigger>
        <SelectContent>
          {QUARTER_OPTIONS.map((opt) => {
            const isAvailable = opt.key === "year" || quarters.includes(opt.key);
            return (
              <SelectItem key={opt.key} value={opt.key} disabled={!isAvailable}>
                {opt.title} {opt.desc}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
