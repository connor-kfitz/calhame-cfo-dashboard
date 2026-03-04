import Link from "next/link";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface NoDataAvailableProps {
  year: number;
  quarter: string;
  availableYears: number[];
  message?: string;
}

export default function NoDataAvailable({ year, quarter, availableYears, message }: NoDataAvailableProps) {
  const defaultMessage = `No data available for ${quarter === "year" ? "full year" : quarter.toUpperCase()} ${year}`;
  
  return (
    <Card className="border-border shadow-sm gap-8">
      <CardHeader className="gap-1">
        <CardTitle className="text-base font-semibold text-foreground inline-flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500"/>
          {message || defaultMessage}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {availableYears.length > 0 
            ? `Data is available for years: ${availableYears.join(", ")}`
            : "No financial data available for this company yet."
          }
        </CardDescription>
      </CardHeader>

      {availableYears.length > 0 && (
        <CardContent>
          <Button asChild variant="outline">
            <Link href={`/dashboard?quarter=year&year=${availableYears[0]}`}>
              View {availableYears[0]} Data
            </Link>
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
