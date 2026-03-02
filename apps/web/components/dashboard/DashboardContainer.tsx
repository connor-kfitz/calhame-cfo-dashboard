"use client";

import InfoCard from "./InfoCard";
import QuarterSelection from "./QuarterSelection";
import RevenueChart from "./RevenueChart";
import OpexPieChart from "./OpexPieChart";

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
      <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <RevenueChart data={data.revenueExpenseChartData}/>
        <OpexPieChart data={data.opexCompChartData}/>
      </div>
    </div>
  );
}
