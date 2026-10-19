"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const measurementId = "G-9K4F1KGEP9";

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  parafaGa4Configured?: boolean;
};

export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  useEffect(() => {
    const analyticsWindow = window as AnalyticsWindow;
    analyticsWindow.dataLayer ||= [];
    analyticsWindow.gtag ||= (...args: unknown[]) => analyticsWindow.dataLayer!.push(args);

    if (!analyticsWindow.parafaGa4Configured) {
      analyticsWindow.gtag("js", new Date());
      analyticsWindow.gtag("config", measurementId, { send_page_view: false });
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
      analyticsWindow.parafaGa4Configured = true;
    }

    analyticsWindow.gtag("event", "page_view", {
      page_location: window.location.href,
      page_path: `${pathname}${query ? `?${query}` : ""}`,
      page_title: document.title,
    });
  }, [pathname, query]);

  return null;
}
