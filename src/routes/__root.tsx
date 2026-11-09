import { createRootRoute, HeadContent, Link, Outlet, Scripts, useRouterState } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { Footer, Header } from "@/components/site";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "QORVEX — Born to Lead" },
      {
        name: "description",
        content:
          "QORVEX automobiles: V9 electric grand tourer, V09 electric grand SUV, X-T 6×6 diesel, and AWK Soul hypercar.",
      },
      { name: "theme-color", content: "#0c0b0a" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Outfit:wght@300;400;500;600&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-ivory focus:px-3 focus:py-2 focus:text-obsidian">
            Skip to content
          </a>
          <Header />
          <main id="content" className="page-enter min-h-svh" key={pathname}>
            <Outlet />
          </main>
          <Footer />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-32 pb-24">
      <p className="text-xs tracking-widest uppercase text-champagne">404</p>
      <h1 className="mt-3 font-display text-5xl">This page is not in the collection.</h1>
      <p className="mt-4 text-muted">The address does not match a QORVEX page.</p>
      <Link to="/" className="mt-8 inline-flex min-h-11 items-center text-xs tracking-widest uppercase text-champagne-2">
        Return home
      </Link>
    </div>
  );
}
