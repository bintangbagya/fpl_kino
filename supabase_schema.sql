-- Supabase SQL Migration Script for FPL Kino Hub Comments & Reactions

-- 1. Create Article Comments Table
CREATE TABLE IF NOT EXISTS public.article_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id TEXT NOT NULL,
    user_id UUID NOT NULL,
    user_email TEXT NOT NULL,
    user_name TEXT,
    user_avatar TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast query by article
CREATE INDEX IF NOT EXISTS idx_article_comments_article_id ON public.article_comments(article_id);

-- Enable RLS
ALTER TABLE public.article_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for article_comments
CREATE POLICY "Allow public read access to comments" ON public.article_comments
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert comments" ON public.article_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NOT NULL);

CREATE POLICY "Allow comment owners to delete comments" ON public.article_comments
    FOR DELETE USING (auth.uid() = user_id);

-- 2. Create Article Reactions Table
CREATE TABLE IF NOT EXISTS public.article_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id TEXT NOT NULL,
    user_id UUID NOT NULL,
    user_email TEXT NOT NULL,
    emoji TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_article_emoji UNIQUE (article_id, user_id, emoji)
);

-- Index for fast query by article
CREATE INDEX IF NOT EXISTS idx_article_reactions_article_id ON public.article_reactions(article_id);

-- Enable RLS
ALTER TABLE public.article_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for article_reactions
CREATE POLICY "Allow public read access to reactions" ON public.article_reactions
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert reactions" ON public.article_reactions
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NOT NULL);

CREATE POLICY "Allow users to delete their own reactions" ON public.article_reactions
    FOR DELETE USING (auth.uid() = user_id);
