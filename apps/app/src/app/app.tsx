import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { usePostHog } from 'posthog-js/react';
import { useFeatureFlagEnabled } from 'posthog-js/react';

import NxWelcome from './nx-welcome';

export const socket = io(import.meta.env.VITE_API_ENDPOINT);

export function App() {
  const posthog = usePostHog();
  const flagEnabled = useFeatureFlagEnabled('explode');
  const [isConnected, setIsConnected] = useState(socket.connected);
  useEffect(() => {
    function onConnect() {
      console.log('Nice...');
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_ENDPOINT}/api`)
      .then((res) => res.json())
      .then(console.log);
  }, []);

  useEffect(() => {
    if (window.location.hash && window.location.hash.includes('id')) {
      const [, id] = window.location.hash.split('=');
      posthog.identify(id);
    }
  }, [posthog]);

  return (
    <div>
      <NxWelcome title="app" />
      {isConnected && <p>It's happening!</p>}
      {!isConnected && (
        <p>
          <span role="img" aria-label="Sad day">
            😭
          </span>
        </p>
      )}
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
