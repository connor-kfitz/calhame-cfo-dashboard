import getCompaniesByUser from "../companies/user-id/get";
import getUserByClerkId from "../users/clerk-id/get";
import getBurn from "./get-burn";
import getCogs from "./get-cogs";
import getOpexCompChartData from "./get-opex-comp-chart-data";
import getRevenueExpenseChartData from "./get-rev-exp-chart-data";
import getRevenue from "./get-revenue";
import getTopExpense from "./get-top-expense";
import getTotalOpex from "./get-total-opex";

import { DashboardData } from "@repo/shared";
import { getAverageMonthlyBurn, getBurnEfficency, getCogsPercentageOfRevenue, getExpensePercentageOfOpex, getGrossMarginPercentage, getNetProfitLoss, getOpexRevenueRatio, getProfit } from "@/lib/accounting-formulas";

export default async function getDashboardData(clerkId: string, year: number): Promise<DashboardData> {

  const userResult = await getUserByClerkId(clerkId);
  const userId = userResult.id as string;

  const companyMembershipResults = await getCompaniesByUser(userId);
  const companyIds = companyMembershipResults.map((membership) => membership.companyId);

  const totalRevenueResult = await getRevenue(companyIds[0], year);
  const totalCogsResult = await getCogs(companyIds[0], year);
  const totalOpexResult = await getTotalOpex(companyIds[0], year);
  const burnResult = await getBurn(companyIds[0], year);
  const topExpenseResult = await getTopExpense(companyIds[0], year);

  const revenueExpenseChartData = await getRevenueExpenseChartData(companyIds[0], year);
  const opexCompChartData = await getOpexCompChartData(companyIds[0], year);

  return {
    year,
    infoCards: [
      {
        title: "Total Revenue",
        value: `$${totalRevenueResult}`,
        info: `Revenue for ${year}`
      },
      {
        title: "Cost of Goods Sold",
        value: `$${totalCogsResult}`,
        info: `${getCogsPercentageOfRevenue(totalCogsResult, totalRevenueResult)}% of Rev`
      },
      {
        title: "Gross Margin",
        value: `${getGrossMarginPercentage(totalCogsResult, totalRevenueResult)}%`,
        info: `$${getProfit(totalRevenueResult, totalCogsResult)} Profit`
      },
      {
        title: "Net Profit/Loss",
        value: (() => {
          const net = getNetProfitLoss(totalRevenueResult, totalCogsResult, totalOpexResult);
          return net < 0 ? `-$${Math.abs(net).toFixed(2)}` : `$${net.toFixed(2)}`;
        })(),
        info: "Includes all expenses"
      },
      {
        title: "Total Opex",
        value: `$${totalOpexResult}`,
        info: `${getBurnEfficency(totalOpexResult, totalRevenueResult)} Burn`
      },
      {
        title: "Opex/Revenue Ratio",
        value: `${getOpexRevenueRatio(totalOpexResult, totalRevenueResult)}%`,
        info: `Opex as a percentage of revenue for ${year}`
      },
      {
        title: "Avg Monthly Burn",
        value: `$${getAverageMonthlyBurn(burnResult, 12)}`,
        info: `Net Loss / Month`
      },
      {
        title: "Top Expense",
        value: `${topExpenseResult.category}`,
        info: `${getExpensePercentageOfOpex(topExpenseResult.total, totalOpexResult)}% of OpEx`
      }
    ],
    revenueExpenseChartData: revenueExpenseChartData,
    opexCompChartData: opexCompChartData,
    companies: companyMembershipResults
  }
}
