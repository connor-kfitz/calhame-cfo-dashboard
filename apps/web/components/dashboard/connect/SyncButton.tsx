"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getSyncAvailability } from "@/lib/helpers";
import { CloudSync } from "lucide-react";
import { useEffect, useState } from "react";

interface SyncButtonProps {
  companyId: string;
  provider: string;
  companyName: string;
  lastSyncRequestedAt: Date | null;
  disabled?: boolean;
  isLoading?: boolean;
  onSync: (companyId: string, provider: string, companyName: string) => Promise<void>;
}

export default function SyncButton({
  companyId, provider, companyName, lastSyncRequestedAt,
  disabled = false, isLoading = false, onSync
}: SyncButtonProps) {

  const [, updateCounter] = useState(0);

  useEffect(() => {
    const availability = getSyncAvailability(lastSyncRequestedAt);
    
    if (availability.canSync) return;

    const interval = setInterval(() => {
      updateCounter(n => n + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastSyncRequestedAt]);

  const syncAvailability = getSyncAvailability(lastSyncRequestedAt);
  const isSyncDisabled = !syncAvailability.canSync || disabled || isLoading;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={0}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSync(companyId, provider, companyName)}
              disabled={isSyncDisabled}
            >
              <CloudSync className="mr-1 h-4 w-4"/>
              {isLoading
                ? <>
                    <Spinner className="ml-1"/>
                    <span className="sr-only">Syncing</span>
                  </>
                : "Sync"
              }
            </Button>
          </span>
        </TooltipTrigger>
        {!syncAvailability.canSync && (
          <TooltipContent>
            <p>Next Sync Available in {syncAvailability.timeRemaining}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
