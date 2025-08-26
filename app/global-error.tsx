"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { I18nProvider, useI18n } from "@/providers/i18n-provider";

function GlobalErrorContent({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="space-y-2">
          <div className="flex justify-center">
            <AlertTriangle className="h-16 w-16 text-destructive" />
          </div>
          <h1 className="text-2xl font-semibold">{t("common.error")}</h1>
          <p className="text-muted-foreground">
            {t("common.unexpectedError")}
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground font-mono">
              {t("common.errorId")}: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => reset()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            {t("common.retry")}
          </Button>
          <Button
            onClick={() => window.location.href = "/"}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            {t("common.goHome")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <I18nProvider>
          <GlobalErrorContent error={error} reset={reset} />
        </I18nProvider>
      </body>
    </html>
  );
}
