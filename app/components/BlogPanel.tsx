"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from 'react-dom';
import { useSession } from 'next-auth/react';
// Link not used in this component by design (modal opens instead)

type Post = {
  _id: string;
  title: string;
  content: string;
  authorName?: string;
  imageUrl?: string;
  createdAt?: string;
};

export default function BlogPanel() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blog/posts');
      const data = await res.json();
      setPosts(Array.isArray(data.posts) ? data.posts : data.posts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  // Do NOT disable background scroll; modal contains its own scrollable feed
  useEffect(() => {
    return () => {};
  }, []);

  // when a post is selected, scroll the modal feed to that post
  useEffect(() => {
    if (!selectedPost) return;
    const el = document.getElementById(`post-${selectedPost._id}`);
    if (el) {
      // small timeout to wait for modal render
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
    }
  }, [selectedPost, posts]);

  const fileToBase64 = (f: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(f);
  });

  const handleCreate = async () => {
    if (!title || !content) return alert('Title and content required');
    let imageBase64 = undefined;
    if (file) imageBase64 = await fileToBase64(file);
    try {
      const body: Record<string, unknown> = { title, content, imageBase64 };
      if (session?.user?.name) body.authorName = session.user.name;

      const res = await fetch('/api/blog/posts', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('create failed');
      setTitle(''); setContent(''); setFile(null); setOpen(false);
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert('Failed to create post');
    }
  };

  return (
    <aside className="w-96 hidden lg:block pl-6">
      <div className="sticky top-24">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white">Community Blog</h3>
            <button onClick={() => setOpen(o => !o)} className="text-sm text-slate-300 hover:text-white">{open ? 'Cancel' : 'New'}</button>
          </div>
          <p className="text-xs text-slate-400 mb-3">Share tips, recordings, and questions with the community.</p>
          <button onClick={() => setOpen(true)} className="w-full px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold">Create Post</button>
        </div>

        {open && (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 mb-4">
            <input className="w-full mb-2 rounded-md px-3 py-2 bg-transparent border border-white/10 text-white" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <textarea className="w-full mb-2 rounded-md px-3 py-2 bg-transparent border border-white/10 text-white" rows={4} placeholder="Write something..." value={content} onChange={e => setContent(e.target.value)} />
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} className="mb-3 text-slate-400" />
            <div className="flex gap-2">
              <button onClick={handleCreate} className="px-3 py-1.5 rounded-md bg-accent text-white">Post</button>
              <button onClick={() => { setOpen(false); setFile(null); }} className="px-3 py-1.5 rounded-md border border-white/10 text-slate-300">Cancel</button>
            </div>
          </div>
        )}

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-3">
          <h4 className="text-sm font-semibold text-white mb-3">Recent Posts</h4>
          {loading ? <p className="text-sm text-slate-400">Loading…</p> : (
            <ul className="space-y-3">
              {posts.slice(0, 3).map(p => (
                <li
                  key={p._id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedPost(p)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setSelectedPost(p); }}
                  className="p-2 rounded-lg hover:bg-white/[0.02] transition-all cursor-pointer"
                >
                  {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="w-full h-28 object-cover rounded-md mb-2" />}
                  <div className="text-sm text-white font-medium text-left w-full">{p.title}</div>
                  <p className="text-xs text-slate-400">{p.authorName ?? 'Community'} • {new Date(p.createdAt || '').toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {selectedPost && typeof document !== 'undefined' ? createPortal(
        (
        <div style={{ zIndex: 99999 }} className="fixed inset-0 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedPost(null)} />

          <div className="relative z-10 w-full max-w-3xl max-h-[80vh] bg-gradient-to-b from-[#0f0f0f] to-[#070707] border border-white/6 rounded-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/6">
              <div className="max-w-[80%]">
                <div className="text-xs text-slate-400">{selectedPost.authorName ?? 'Community'} • {new Date(selectedPost.createdAt || '').toLocaleString()}</div>
                <h3 className="text-xl font-bold text-white leading-tight truncate">{selectedPost.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectedPost(null)} aria-label="Close" className="text-slate-400 hover:text-white bg-white/2 rounded-full w-9 h-9 flex items-center justify-center">✕</button>
              </div>
            </div>

            <div className="p-4 flex-1 min-h-0 overflow-y-auto hide-scrollbar overscroll-contain">
              <div className="space-y-6">
                {posts.map(p => (
                  <article key={p._id} id={`post-${p._id}`} className={`py-3 ${p._id === selectedPost._id ? 'bg-white/[0.02] rounded-md px-4' : ''}`}>
                    <div className="mb-3">
                      <h4 className="text-lg font-semibold text-white">{p.title}</h4>
                      <div className="text-xs text-slate-400">{p.authorName ?? 'Community'} • {new Date(p.createdAt || '').toLocaleString()}</div>
                    </div>

                    {p.imageUrl && (
                      <div className="mt-2 rounded-md overflow-hidden shadow-sm">
                        <img src={p.imageUrl} alt={p.title} className="w-full max-h-[50vh] object-cover" />
                      </div>
                    )}

                    <div className="mt-4 text-slate-200 leading-relaxed whitespace-pre-wrap">{p.content}</div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
        ), document.body) : null}
    </aside>
  );
}
