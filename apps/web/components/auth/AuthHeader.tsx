import { BookOpen } from "lucide-react";

export default function AuthHeader() {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
        <BookOpen className="h-5 w-5 text-primary-foreground"/>
      </div>
      <span className="text-xl font-semibold tracking-tight text-foreground">Calhame CFO</span>
    </div>
  );
}
