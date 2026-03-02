import { getUserByClerkId } from "../queries/users/get-user-by-clerk-id";
import { getCompaniesByUser } from "../queries/companies/get-companies-by-user";
import { getRevenueByCompanyId } from "../queries/dashboard/get-revenue-by-company-id";
import { getCogsByCompanyId } from "../queries/dashboard/get-cogs-by-company-id";
import { DashboardData } from "@repo/shared";
import { getTotalOpexByCompanyId } from "../queries/dashboard/get-total-opex-by-company-id";
import { getBurn } from "../queries/dashboard/get-burn-by-company-id";
import { getTopExpense } from "../queries/dashboard/get-top-expense-by-company-id";
import { getAverageMonthlyBurn, getBurnEfficency, getCogsPercentageOfRevenue, getExpensePercentageOfOpex, getGrossMarginPercentage, getNetProfitLoss, getOpexRevenueRatio, getProfit } from "../accounting-formulas";
import { getRevenueExpenseChartData } from "../queries/dashboard/get-revenue-expense-chart-data";
import { getOpexCompChartData } from "../queries/dashboard/get-opex-comp-chart-data";

export async function getDashboardData(clerkId: string, year: number): Promise<DashboardData> {

  const userResult = await getUserByClerkId(clerkId);
  const userId = userResult[0].id as string;

  const companyMembershipResults = await getCompaniesByUser(userId);
  const companyIds = companyMembershipResults.map((membership) => membership.companyId);
  
  const totalRevenueResult = await getRevenueByCompanyId(companyIds[0], year);
  const totalCogsResult = await getCogsByCompanyId(companyIds[0], year);
  const totalOpexResult = await getTotalOpexByCompanyId(companyIds[0], year);
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
