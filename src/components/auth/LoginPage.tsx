import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, MessageSquare, Heart, Lock, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsSigningIn(true);
    setErrorMessage(null);
    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMessage(error.message || 'Gagal melakukan login dengan Google. Silakan coba lagi.');
      setIsSigningIn(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#0A0A0A',
        backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(59, 130, 246, 0.12) 0%, rgba(10, 10, 10, 0.95) 70%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#121212',
          border: '1px solid #282828',
          borderRadius: '20px',
          padding: '40px 32px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(59, 130, 246, 0.08)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative top bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899)',
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '9999px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#60A5FA',
            marginBottom: '20px',
            letterSpacing: '0.5px',
          }}
        >
          <Lock size={13} /> GOOGLE SSO LOGIN REQUIRED
        </div>

        {/* Hub Logo Header */}
        <div style={{ marginBottom: '16px' }}>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.5px',
              margin: '0 0 8px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <span style={{ color: '#3B82F6' }}>FPL</span> KINO HUB
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>
            Portal Seputar Fantasy Premier League & Komunitas Kino Indonesia
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            margin: '28px 0',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              backgroundColor: '#1A1A1A',
              border: '1px solid #2A2A2A',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <MessageSquare size={18} color="#3B82F6" />
            <div>
              <div style={{ color: '#E5E7EB', fontSize: '12px', fontWeight: 600 }}>Fitur Komentar</div>
              <div style={{ color: '#9CA3AF', fontSize: '11px' }}>Tercatat via Email</div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#1A1A1A',
              border: '1px solid #2A2A2A',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Heart size={18} color="#EC4899" />
            <div>
              <div style={{ color: '#E5E7EB', fontSize: '12px', fontWeight: 600 }}>Emoji Reaction</div>
              <div style={{ color: '#9CA3AF', fontSize: '11px' }}>Dukungan Artikel</div>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              padding: '10px 14px',
              color: '#F87171',
              fontSize: '13px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textAlign: 'left',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Google SSO Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isSigningIn}
          style={{
            width: '100%',
            backgroundColor: '#FFFFFF',
            color: '#1F2937',
            border: 'none',
            borderRadius: '12px',
            padding: '14px 20px',
            fontSize: '15px',
            fontWeight: 700,
            cursor: isSigningIn ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '0 4px 14px rgba(255, 255, 255, 0.15)',
            transition: 'all 0.2s ease',
            opacity: isSigningIn ? 0.7 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isSigningIn) e.currentTarget.style.backgroundColor = '#F3F4F6';
          }}
          onMouseLeave={(e) => {
            if (!isSigningIn) e.currentTarget.style.backgroundColor = '#FFFFFF';
          }}
        >
          {/* Official Google Icon SVG */}
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          {isSigningIn ? 'Menghubungkan ke Google...' : 'Masuk dengan Akun Google'}
        </button>

        {/* Security / Privacy Footer */}
        <div
          style={{
            marginTop: '24px',
            fontSize: '12px',
            color: '#6B7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <ShieldCheck size={14} color="#10B981" />
          <span>Autentikasi Aman via Google SSO (Akses Email Publik)</span>
        </div>
      </div>
    </div>
  );
};
