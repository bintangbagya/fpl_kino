import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';

interface ReactionSectionProps {
  articleId: string;
}

interface EmojiConfig {
  symbol: string;
  label: string;
}

const EMOJIS: EmojiConfig[] = [
  { symbol: '🔥', label: 'Fire' },
  { symbol: '👍', label: 'Like' },
  { symbol: '❤️', label: 'Love' },
  { symbol: '👏', label: 'Clap' },
  { symbol: '💡', label: 'Insight' },
];

const LOCAL_STORAGE_REACTIONS_KEY = 'fpl_kino_local_reactions';

export const ReactionSection: React.FC<ReactionSectionProps> = ({ articleId }) => {
  const { user } = useAuth();
  const [counts, setCounts] = useState<{ [emoji: string]: number }>({});
  const [userReactions, setUserReactions] = useState<{ [emoji: string]: boolean }>({});

  useEffect(() => {
    fetchReactions();
  }, [articleId, user?.id]);

  const fetchReactions = async () => {
    let countsMap: { [emoji: string]: number } = {};
    let userMap: { [emoji: string]: boolean } = {};

    try {
      const { data, error } = await supabase
        .from('article_reactions')
        .select('emoji, user_id')
        .eq('article_id', articleId);

      if (!error && data) {
        data.forEach((row) => {
          countsMap[row.emoji] = (countsMap[row.emoji] || 0) + 1;
          if (user && row.user_id === user.id) {
            userMap[row.emoji] = true;
          }
        });
      } else {
        // Fallback to local storage if Supabase table is not yet initialized
        const localData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_REACTIONS_KEY) || '{}');
        const articleData = localData[articleId] || [];
        articleData.forEach((item: { emoji: string; userId: string }) => {
          countsMap[item.emoji] = (countsMap[item.emoji] || 0) + 1;
          if (user && item.userId === user.id) {
            userMap[item.emoji] = true;
          }
        });
      }
    } catch (err) {
      console.warn('[Reactions] Failed to fetch from Supabase, using fallback:', err);
    } finally {
      setCounts(countsMap);
      setUserReactions(userMap);
    }
  };

  const handleToggleReaction = async (emoji: string) => {
    if (!user) return;

    const hasReacted = userReactions[emoji];

    // Optimistic UI Update
    setUserReactions((prev) => ({ ...prev, [emoji]: !hasReacted }));
    setCounts((prev) => ({
      ...prev,
      [emoji]: Math.max(0, (prev[emoji] || 0) + (hasReacted ? -1 : 1)),
    }));

    try {
      if (hasReacted) {
        // Remove reaction
        const { error } = await supabase
          .from('article_reactions')
          .delete()
          .match({ article_id: articleId, user_id: user.id, emoji });

        if (error) throw error;
      } else {
        // Add reaction
        const { error } = await supabase.from('article_reactions').insert({
          article_id: articleId,
          user_id: user.id,
          user_email: user.email,
          emoji,
        });

        if (error) throw error;
      }
    } catch (err) {
      // Fallback update in LocalStorage if Supabase table is not present
      const localData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_REACTIONS_KEY) || '{}');
      let articleData: { emoji: string; userId: string; userEmail: string }[] = localData[articleId] || [];

      if (hasReacted) {
        articleData = articleData.filter((i) => !(i.userId === user.id && i.emoji === emoji));
      } else {
        articleData.push({ emoji, userId: user.id, userEmail: user.email });
      }

      localData[articleId] = articleData;
      localStorage.setItem(LOCAL_STORAGE_REACTIONS_KEY, JSON.stringify(localData));
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        margin: '16px 0',
      }}
    >
      <span
        style={{
          fontSize: '12px',
          fontWeight: 700,
          color: '#9CA3AF',
          fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase',
          marginRight: '4px',
        }}
      >
        REAKSI:
      </span>

      {EMOJIS.map(({ symbol, label }) => {
        const active = !!userReactions[symbol];
        const count = counts[symbol] || 0;

        return (
          <button
            key={symbol}
            onClick={() => handleToggleReaction(symbol)}
            title={`${label} (${count})`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: active ? 'rgba(59, 130, 246, 0.15)' : '#1E1E1E',
              border: `1px solid ${active ? '#3B82F6' : '#2D2D2D'}`,
              borderRadius: '9999px',
              padding: '6px 12px',
              fontSize: '13px',
              color: active ? '#60A5FA' : '#D1D5DB',
              cursor: 'pointer',
              transition: 'all 0.15s ease-in-out',
              userSelect: 'none',
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.borderColor = '#4B5563';
                e.currentTarget.style.backgroundColor = '#262626';
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.borderColor = '#2D2D2D';
                e.currentTarget.style.backgroundColor = '#1E1E1E';
              }
            }}
          >
            <span>{symbol}</span>
            {count > 0 && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: active ? '#93C5FD' : '#9CA3AF',
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
