'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TMDBService from '../services/tmdb';

const AuthCallback = () => {
  const [status, setStatus] = useState('Processing Authentication...');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get URL parameters using React Router
        const requestToken = searchParams.get('request_token');
        const approved = searchParams.get('approved');

        console.log('Auth callback URL params:', { requestToken, approved });

        if (requestToken && approved === 'true') {
          setStatus('Creating session...');
          console.log('Processing TMDB auth callback with token:', requestToken);

          const sessionResponse = await TMDBService.createSession(requestToken);
          const sessionId = sessionResponse.session_id;

          setStatus('Getting account details...');
          const accountDetails = await TMDBService.getAccountDetails(sessionId);

          console.log('Session created:', sessionId, 'Account:', accountDetails);

          // Store session and user data
          localStorage.setItem('tmdb_session_id', sessionId);
          localStorage.setItem('tmdb_user', JSON.stringify(accountDetails));
          localStorage.setItem('tmdb_session', JSON.stringify({
            sessionId,
            account: accountDetails
          }));

          setStatus('Authentication successful!');

          // Notify parent window if this is in a popup
          if (window.opener) {
            window.opener.postMessage(
              { type: 'tmdb_auth_success', user: accountDetails, sessionId },
              window.location.origin
            );
            setTimeout(() => window.close(), 1000);
          } else {
            // If not in popup, redirect to main app
            setTimeout(() => {
              navigate('/');
            }, 1000);
          }
        } else {
          console.error('Auth callback failed: Invalid token or not approved');
          setStatus('Authentication failed. Please try again.');
          setTimeout(() => {
            if (window.opener) {
              window.close();
            } else {
              navigate('/');
            }
          }, 2000);
        }
      } catch (err) {
        console.error('Auth callback error:', err.message);
        setStatus('Authentication failed. Please try again.');
        setTimeout(() => {
          if (window.opener) {
            window.close();
          } else {
            navigate('/');
          }
        }, 2000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="auth-callback" style={{
      backgroundColor: '#141414',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textAlign: 'center'
    }}>
      <div>
        <h2 style={{ marginBottom: '20px', fontSize: '24px' }}>{status}</h2>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', color: '#e50914' }}></i>
      </div>
    </div>
  );
};

export default AuthCallback;