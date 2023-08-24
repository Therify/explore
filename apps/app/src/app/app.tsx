import { useEffect } from 'react';
import { usePostHog } from 'posthog-js/react';
import { useFeatureFlagEnabled } from 'posthog-js/react';

import NxWelcome from './nx-welcome';

export function App() {
  const posthog = usePostHog();
  const flagEnabled = useFeatureFlagEnabled('explode');
  console.log(flagEnabled);

  useEffect(() => {
    if (window.location.hash && window.location.hash.includes('id')) {
      const [, id] = window.location.hash.split('=');
      posthog.identify(id);
    }
  }, [posthog]);

  return (
    <div>
      <NxWelcome title="app" />
      {flagEnabled && (
        <button
          onClick={() => {
            throw new Error('Ouch!');
          }}
        >
          I throw an error!
        </button>
      )}
    </div>
  );
}

export default App;
