'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TMDBService from '../services/tmdb';

const AuthCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestToken = searchParams.get('request_token');

  useEffect(() => {
    const handleCallback = async () => {
      if (!requestToken) {
        console.error('No request token found in callback URL');
        router.push('/?error=No request token provided');
        return;
      }
      try {
        const sessionId = await TMDBService.createSession(requestToken);
        const accountDetails = await TMDBService.getAccountDetails(sessionId);
        localStorage.setItem('tmdb_session', JSON.stringify({ sessionId, account: accountDetails }));
        router.push('/?auth=success');
      } catch (error) {
        console.error('Auth callback error:', error.message);
        router.push('/?error=Failed to create session: ' + encodeURIComponent(error.message));
      }
    };
    handleCallback();
  }, [requestToken, router]);

  return <div>Loading...</div>;
};

export default AuthCallback;