"use client";

import InfoCard from "./InfoCard";
import QuarterSelection from "./QuarterSelection";

import { DashboardData, Quarter } from "@repo/shared";
import { useState } from "react";

interface DashboardContainerProps {
  data: DashboardData;
}

export default function DashboardContainer({ data }: DashboardContainerProps) {

  const [quarter, setQuarter] = useState<Quarter>("year");

  return (
    <div className="flex flex-col gap-4">
      <QuarterSelection value={quarter} onChange={setQuarter}/>
      <ul className="grid grid-cols-2 gap-4">
        {data.infoCards.map((card, index) => (
          <li key={index} className="min-w-0">
            <InfoCard
              title={card.title}
              value={card.value}
              info={card.info}
              className="w-full"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
