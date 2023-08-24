import { useEffect } from 'react';
import { usePostHog } from 'posthog-js/react';

import NxWelcome from './nx-welcome';

export function App() {
  const posthog = usePostHog();
  useEffect(() => {
    if (window.location.hash && window.location.hash.includes('id')) {
      const [, id] = window.location.hash.split('=');
      posthog.identify(id);
    }
  }, [posthog]);

  return (
    <div>
      <NxWelcome title="app" />
    </div>
  );
}

export default App;
