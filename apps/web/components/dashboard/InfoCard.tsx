import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cx } from "class-variance-authority";

interface InfoCardProps {
  title: string;
  value: string;
  info?: string;
  className?: string;
}

export default function InfoCard({ title, value, info, className }: InfoCardProps) {
  return (
    <Card className={cx(className, "border-border shadow-sm gap-2")}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </div>
        {info && (
          <p className="mt-1 text-xs text-muted-foreground">
            {info}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
