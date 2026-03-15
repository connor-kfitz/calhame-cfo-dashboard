import getBurn from "./get-burn";
import getCogs from "./get-cogs";
import getOpexCompChartData from "./get-opex-comp-chart-data";
import getRevenueExpenseChartData from "./get-rev-exp-chart-data";
import getRevenue from "./get-revenue";
import getTopExpense from "./get-top-expense";
import getTotalOpex from "./get-total-opex";
import getYears from "./get-years";
import getQuarters from "./get-quarters";
import getCompanyById from "../companies/id/get";

import { DashboardData, Quarter } from "@repo/shared";
import { getDateRangeFromQuarter, buildInfoCards } from "@/lib/helpers";

export default async function getDashboardData(companyId: string, quarter: Quarter, year: number): Promise<DashboardData> {

  const { startDate, endDate, monthsInPeriod } = getDateRangeFromQuarter(quarter, year);

  const [
    totalRevenueResult, totalCogsResult,totalOpexResult, burnResult, topExpenseResult,
    revenueExpenseChartData, opexCompChartData, yearsResult, quarters, company
  ] = await Promise.all([
    getRevenue(companyId, startDate, endDate), getCogs(companyId, startDate, endDate),
    getTotalOpex(companyId, startDate, endDate), getBurn(companyId, startDate, endDate),
    getTopExpense(companyId, startDate, endDate), getRevenueExpenseChartData(companyId, startDate, endDate),
    getOpexCompChartData(companyId, startDate, endDate), getYears(companyId), getQuarters(companyId, year),
    getCompanyById(companyId)
  ]);

  return {
    companyName: company?.companyName || "Company",
    years: yearsResult,
    quarters: quarters,
    infoCards: buildInfoCards(
      totalRevenueResult, totalCogsResult, totalOpexResult,
      burnResult, topExpenseResult, monthsInPeriod, year
    ),
    revenueExpenseChartData: revenueExpenseChartData,
    opexCompChartData: opexCompChartData
  }
}
