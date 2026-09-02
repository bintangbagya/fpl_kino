import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { MessageSquare, Send, Trash2, User, Clock, AlertCircle } from 'lucide-react';

interface CommentSectionProps {
  articleId: string;
}

export interface ArticleComment {
  id: string;
  article_id: string;
  user_id: string;
  user_email: string;
  user_name?: string;
  user_avatar?: string;
  content: string;
  created_at: string;
}

const LOCAL_STORAGE_COMMENTS_KEY = 'fpl_kino_local_comments';

export const CommentSection: React.FC<CommentSectionProps> = ({ articleId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('article_comments')
        .select('*')
        .eq('article_id', articleId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setComments(data as ArticleComment[]);
      } else {
        // Fallback to localStorage
        const localData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_COMMENTS_KEY) || '{}');
        setComments(localData[articleId] || []);
      }
    } catch (err) {
      console.warn('[Comments] Failed to fetch comments, using local fallback:', err);
      const localData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_COMMENTS_KEY) || '{}');
      setComments(localData[articleId] || []);
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);

    const commentData: Partial<ArticleComment> = {
      article_id: articleId,
      user_id: user.id,
      user_email: user.email,
      user_name: user.name || user.email.split('@')[0],
      user_avatar: user.avatar_url,
      content: newComment.trim(),
      created_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from('article_comments')
        .insert(commentData)
        .select('*')
        .single();

      if (!error && data) {
        setComments((prev) => [...prev, data as ArticleComment]);
        setNewComment('');
      } else {
        throw error || new Error('Gagal menyimpan komentar ke Supabase');
      }
    } catch (err: any) {
      console.warn('[Comments] Saving to Supabase failed, fallback to localStorage:', err);
      
      // Fallback local storage
      const fallbackComment: ArticleComment = {
        id: 'comment-' + Date.now(),
        article_id: articleId,
        user_id: user.id,
        user_email: user.email,
        user_name: user.name || user.email.split('@')[0],
        user_avatar: user.avatar_url,
        content: newComment.trim(),
        created_at: new Date().toISOString(),
      };

      const localData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_COMMENTS_KEY) || '{}');
      const articleComments = localData[articleId] || [];
      articleComments.push(fallbackComment);
      localData[articleId] = articleComments;
      localStorage.setItem(LOCAL_STORAGE_COMMENTS_KEY, JSON.stringify(localData));

      setComments((prev) => [...prev, fallbackComment]);
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;
    if (!window.confirm('Hapus komentar ini?')) return;

    // Optimistic removal
    setComments((prev) => prev.filter((c) => c.id !== commentId));

    try {
      await supabase.from('article_comments').delete().eq('id', commentId);
    } catch (err) {
      console.warn('[Comments] Delete from Supabase failed, updating local storage');
    }

    // Also update local storage fallback
    const localData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_COMMENTS_KEY) || '{}');
    if (localData[articleId]) {
      localData[articleId] = localData[articleId].filter((c: ArticleComment) => c.id !== commentId);
      localStorage.setItem(LOCAL_STORAGE_COMMENTS_KEY, JSON.stringify(localData));
    }
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      const diffHrs = Math.floor(diffMin / 60);
      const diffDays = Math.floor(diffHrs / 24);

      if (diffMin < 1) return 'Baru saja';
      if (diffMin < 60) return `${diffMin}m yang lalu`;
      if (diffHrs < 24) return `${diffHrs}j yang lalu`;
      if (diffDays < 7) return `${diffDays}h yang lalu`;

      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div
      style={{
        marginTop: '28px',
        borderTop: '1px solid #222222',
        paddingTop: '24px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px',
        }}
      >
        <MessageSquare size={18} color="#3B82F6" />
        <h4
          style={{
            margin: 0,
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: 700,
            fontFamily: 'var(--font-headline)',
            letterSpacing: '0.02em',
          }}
        >
          KOMENTAR ({comments.length})
        </h4>
      </div>

      {/* Existing Comments List */}
      {loading ? (
        <div style={{ color: '#9CA3AF', fontSize: '13px', padding: '12px 0' }}>
          Memuat komentar...
        </div>
      ) : comments.length === 0 ? (
        <div
          style={{
            backgroundColor: '#161616',
            border: '1px border-dashed #2A2A2A',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            color: '#9CA3AF',
            fontSize: '13px',
            marginBottom: '20px',
          }}
        >
          Belum ada komentar. Jadilah yang pertama memberikan pendapat!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {comments.map((comment) => {
            const isOwner = user && user.id === comment.user_id;

            return (
              <div
                key={comment.id}
                style={{
                  backgroundColor: '#161616',
                  border: '1px solid #262626',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {/* Comment Author Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: '#2563EB',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '11px',
                        flexShrink: 0,
                      }}
                    >
                      {comment.user_name?.charAt(0).toUpperCase() || comment.user_email.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#F3F4F6', fontSize: '13px', fontWeight: 600 }}>
                          {comment.user_name || comment.user_email.split('@')[0]}
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            color: '#9CA3AF',
                            backgroundColor: '#222222',
                            padding: '1px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          {comment.user_email}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11px',
                        color: '#6B7280',
                      }}
                    >
                      <Clock size={12} />
                      {formatTimestamp(comment.created_at)}
                    </span>

                    {isOwner && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        title="Hapus komentar"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#EF4444',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Comment Content */}
                <div
                  style={{
                    color: '#E5E7EB',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                    paddingLeft: '34px',
                  }}
                >
                  {comment.content}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Comment Input Form */}
      {user ? (
        <form onSubmit={handlePostComment} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div
            style={{
              fontSize: '12px',
              color: '#9CA3AF',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <User size={13} color="#3B82F6" />
            <span>
              Komentar sebagai: <strong style={{ color: '#E5E7EB' }}>{user.email}</strong>
            </span>
          </div>

          <div style={{ position: 'relative' }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Tulis pendapat atau tanggapan Anda mengenai artikel ini..."
              rows={3}
              maxLength={500}
              style={{
                width: '100%',
                backgroundColor: '#161616',
                border: '1px solid #2D2D2D',
                borderRadius: '12px',
                padding: '12px 14px',
                color: '#FFFFFF',
                fontSize: '13px',
                lineHeight: 1.5,
                boxSizing: 'border-box',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#3B82F6')}
              onBlur={(e) => (e.target.style.borderColor = '#2D2D2D')}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '12px',
                fontSize: '10px',
                color: '#6B7280',
              }}
            >
              {newComment.length}/500
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              style={{
                backgroundColor: '#3B82F6',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: isSubmitting || !newComment.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                opacity: isSubmitting || !newComment.trim() ? 0.5 : 1,
                transition: 'all 0.15s ease',
              }}
            >
              <Send size={14} />
              {isSubmitting ? 'Mengirim...' : 'Kirim Komentar'}
            </button>
          </div>
        </form>
      ) : (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            padding: '12px',
            color: '#F87171',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={16} />
          <span>Anda harus login dengan Google untuk meninggalkan komentar.</span>
        </div>
      )}
    </div>
  );
};
