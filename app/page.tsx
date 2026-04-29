'use client';

import { useState } from 'react';
import { Link, Download, Loader2, AlertCircle, Clock, Globe, Video, Zap, Search, Music } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState('');
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [error, setError] = useState('');

  const fetchVideoInfo = async () => {
    if (!url) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setVideoInfo(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadFormat = async (formatId: string, quality: string, ext: string) => {
    setDownloading(formatId);
    setError('');
    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url, 
          format_id: formatId === 'best' ? 'best' : formatId,
          download: true 
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Download failed');
      }
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${videoInfo.title}.${ext === 'webm' ? 'webm' : 'mp4'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDownloading('');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">yt-dlp</span>
              <span className="text-sm text-slate-500">Web</span>
            </div>
            <a href="/docs" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Documentation
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 md:mb-3">Video Downloader</h1>
          <p className="text-base md:text-lg text-slate-600">
            Download videos from YouTube and 1000+ sites in any quality.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Link className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchVideoInfo()}
                placeholder="Paste video URL here..."
                className="w-full pl-12 pr-4 py-3 md:py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 transition-all text-base"
              />
            </div>
            <button
              onClick={fetchVideoInfo}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 md:py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="hidden sm:inline">Loading</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span className="hidden sm:inline">Fetch Info</span>
                  <span className="sm:hidden">Go</span>
                </>
              )}
            </button>
          </div>
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm md:text-base">{error}</span>
            </div>
          )}
        </div>

        {videoInfo && (
          <div className="space-y-4 md:space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                  {videoInfo.thumbnail && (
                    <img src={videoInfo.thumbnail} alt="" className="w-full sm:w-48 md:w-64 h-auto sm:h-28 md:h-36 object-cover rounded-xl flex-shrink-0 mx-auto sm:mx-0" />
                  )}
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 leading-tight">{videoInfo.title}</h2>
                    <div className="flex items-center justify-center sm:justify-start gap-4 md:gap-6 text-slate-600">
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {videoInfo.duration ? `${Math.floor(videoInfo.duration / 60)}:${(videoInfo.duration % 60).toString().padStart(2, '0')}` : '0:00'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-4 md:mb-6 flex items-center gap-2">
                <Download className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                Download Formats
              </h3>
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h4 className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 md:mb-3">Video Formats</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
                    <button
                      onClick={() => downloadFormat('best', 'Best Quality', 'mp4')}
                      disabled={downloading === 'best'}
                      className="relative bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 p-3 md:p-4 rounded-xl text-left transition-all duration-200 disabled:opacity-50 hover:shadow-md active:scale-95"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-slate-900 text-sm md:text-base">Best Quality</span>
                      </div>
                      <div className="text-xs md:text-sm text-slate-600">Highest available</div>
                      {downloading === 'best' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                          <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin text-blue-600" />
                        </div>
                      )}
                    </button>
                    {videoInfo.formats?.filter((f: any) => f.type !== 'audio').map((f: any) => (
                      <button
                        key={f.format_id}
                        onClick={() => downloadFormat(f.format_id, f.quality, f.ext)}
                        disabled={downloading === f.format_id}
                        className="relative bg-white hover:bg-slate-50 border border-slate-200 p-3 md:p-4 rounded-xl text-left transition-all duration-200 disabled:opacity-50 hover:shadow-md active:scale-95"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-slate-900 text-sm md:text-base">{f.quality}</span>
                          {f.filesize && (
                            <span className="text-xs bg-slate-100 text-slate-600 px-1.5 md:px-2 py-0.5 rounded">{f.filesize}</span>
                          )}
                        </div>
                        <div className="text-xs md:text-sm text-slate-600 uppercase">{f.ext}</div>
                        {downloading === f.format_id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                            <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin text-blue-600" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 md:mb-3 flex items-center gap-2">
                    <Music className="w-3 h-3 md:w-4 md:h-4" />
                    MP3 Audio Formats
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
                    {videoInfo.formats?.filter((f: any) => f.type === 'audio').map((f: any) => (
                      <button
                        key={f.format_id}
                        onClick={() => downloadFormat(f.format_id, f.quality, f.ext)}
                        disabled={downloading === f.format_id}
                        className="relative bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-200 p-3 md:p-4 rounded-xl text-left transition-all duration-200 disabled:opacity-50 hover:shadow-md active:scale-95"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-slate-900 text-sm md:text-base">{f.quality}</span>
                          {f.filesize && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-1.5 md:px-2 py-0.5 rounded">{f.filesize}</span>
                          )}
                        </div>
                        <div className="text-xs md:text-sm text-slate-600 uppercase">{f.ext}</div>
                        {downloading === f.format_id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                            <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin text-purple-600" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!videoInfo && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12">
            {[
              { 
                icon: <Globe className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />,
                title: '1000+ Sites',
                desc: 'YouTube, Twitter, Instagram, TikTok, and more'
              },
              { 
                icon: <Video className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />,
                title: 'Multiple Formats',
                desc: 'Choose from various quality options'
              },
              { 
                icon: <Zap className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />,
                title: 'Fast & Free',
                desc: 'No registration required, always free'
              },
            ].map((feature, i) => (
              <div key={i} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="mb-2 md:mb-4">{feature.icon}</div>
                <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1 md:mb-2">{feature.title}</h3>
                <p className="text-sm md:text-base text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}