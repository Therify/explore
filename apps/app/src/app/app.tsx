import { useEffect } from 'react';
import { usePostHog } from 'posthog-js/react';

import NxWelcome from './nx-welcome';

export function App() {
  return (
    <div>
      <NxWelcome title="app" />
    </div>
  );
}

export default App;
