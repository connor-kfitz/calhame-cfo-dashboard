"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { capitalizeFirstLetter } from "@/lib/utils";
import { AccountingProvider } from "@repo/shared";
import { Link2, Link2Off, RefreshCw } from "lucide-react";
import { useState } from "react";

interface AccountingProviderConnectProps {
  provider: AccountingProvider;
}

export default function AccountingProviderConnect({ provider }: AccountingProviderConnectProps) {

  const [connected, setConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>("");

  const providerCapitalized = capitalizeFirstLetter(provider);

  async function handleConnect() {
    // Todo: Implement real connection logic with Microservice and Provider OAuth flow
    setIsConnecting(true);
    setError("");

    try {
      const res = await fetch('/api/microservice/sync-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId: "companyId123", provider })
      });

      if (!res.ok) throw new Error(`Failed to connect to ${providerCapitalized}. Status: ${res.status}`);
     
      setConnected(true);
    } catch (err) {
      console.error(err);
      setError(`Unable to connect to ${providerCapitalized}.`);
      setConnected(false);
    } finally {
      setIsConnecting(false);
    }
  }

  function handleDisconnect() {
    setConnected(false);
    setError("");
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              {providerCapitalized} Integration
            </CardTitle>
            <CardDescription className="mt-1 text-muted-foreground">
              Connect your {providerCapitalized} account to automatically sync invoices, expenses, and financial reports.
            </CardDescription>
          </div>
          <Badge
            variant="secondary"
            className={
              connected
                ? "border-0 bg-accent/10 font-medium text-accent"
                : "border-0 bg-secondary font-medium text-muted-foreground"
            }
          >
            {connected ? "Connected" : "Not Connected"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {!connected ? (
            error ? (
              <div>
                <p className="text-sm text-destructive mb-2">There was an error connecting to {providerCapitalized}.</p>
                <Button variant="outline" size="sm" onClick={handleConnect} disabled={isConnecting}>
                  <RefreshCw className={isConnecting ? "mr-1 h-4 w-4 animate-spin" : "mr-1 h-4 w-4"}/>
                  {isConnecting ? "Retrying..." : "Retry"}
                </Button>
              </div>
            ) : (
              <Button>
                <Link
                  href={`/api/${provider}/auth`}
                  aria-disabled={isConnecting} className="inline-flex items-center gap-1"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="mr-1 h-4 w-4 animate-spin"/>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Link2 className="mr-1 h-4 w-4"/>
                      Connect to {providerCapitalized}
                    </>
                  )}
                </Link>
              </Button>
            )
          ) : (
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-1 h-4 w-4"/>
                Sync Now
              </Button>
              <Button variant="outline" size="sm" onClick={handleDisconnect}>
                <Link2Off className="mr-1 h-4 w-4"/>
                Disconnect
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
