import {
  Outlet,
  RouterProvider,
  Link,
  Router,
  Route,
  RootRoute,
} from '@tanstack/react-router';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import * as Sentry from '@sentry/react';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

import App from './app/app';

const rootRoute = new RootRoute({
  component: Root,
});

function Root() {
  return (
    <>
      <div>
        <Link to="/">Home</Link> <Link to="/about">About</Link>
      </div>
      <hr />
      <Outlet />
    </>
  );
}

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
});

const aboutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: About,
});

function About() {
  return <div>Hello from About!</div>;
}

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([indexRoute, aboutRoute]);

// Create the router using your route tree
const router = new Router({ routeTree });

// Register your router for maximum type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

posthog.init(import.meta.env.VITE_REACT_APP_PUBLIC_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_REACT_APP_PUBLIC_POSTHOG_HOST,
});

Sentry.init({
  dsn: 'https://432d48e455fc6e9b67f1318e4a51dc8d@o4505760600883200.ingest.sentry.io/4505760604291072',
  integrations: [
    new posthog.SentryIntegration(
      posthog,
      'therify-c5766a569',
      4505760604291072
    ),
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ['localhost', 'https:yourserver.io/api/'],
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <RouterProvider router={router} />
    </PostHogProvider>
  </StrictMode>
);
