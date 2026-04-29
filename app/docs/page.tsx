export default function Docs() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">yt-dlp Documentation</h1>

        <section className="bg-white dark:bg-gray-800 rounded-lg p-8 mb-8 shadow">
          <h2 className="text-2xl font-semibold mb-4">What is yt-dlp?</h2>
          <p className="mb-4">
            yt-dlp is a feature-rich command-line audio/video downloader that supports thousands of websites. 
            It's a fork of youtube-dl with additional features and fixes.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg p-8 mb-8 shadow">
          <h2 className="text-2xl font-semibold mb-4">Installation</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">Using pip</h3>
          <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-x-auto">
            <code>pip install yt-dlp</code>
          </pre>

          <h3 className="text-xl font-semibold mt-6 mb-2">Using package managers</h3>
          <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-x-auto">
            <code>{`# macOS (Homebrew)
brew install yt-dlp

# Ubuntu/Debian
sudo apt install yt-dlp

# Windows (Chocolatey)
choco install yt-dlp`}</code>
          </pre>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg p-8 mb-8 shadow">
          <h2 className="text-2xl font-semibold mb-4">Basic Usage</h2>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">Download a video</h3>
          <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-x-auto">
            <code>yt-dlp "https://www.youtube.com/watch?v=VIDEO_ID"</code>
          </pre>

          <h3 className="text-xl font-semibold mt-4 mb-2">Download audio only</h3>
          <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-x-auto">
            <code>yt-dlp -x --audio-format mp3 "URL"</code>
          </pre>

          <h3 className="text-xl font-semibold mt-4 mb-2">Choose format</h3>
          <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-x-auto">
            <code>{'yt-dlp -f "bestvideo[height<=1080]+bestaudio/best[height<=1080]" "URL"'}</code>
          </pre>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg p-8 mb-8 shadow">
          <h2 className="text-2xl font-semibold mb-4">Using This Web Interface</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Paste a video URL in the input field on the home page</li>
            <li>Click "Fetch Info" to see available formats</li>
            <li>View the video title, thumbnail, and available formats</li>
            <li>Use the command line for actual downloads (server-side downloads coming soon)</li>
          </ol>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg p-8 mb-8 shadow">
          <h2 className="text-2xl font-semibold mb-4">Links</h2>
          <ul className="space-y-2">
            <li><a href="https://github.com/yt-dlp/yt-dlp" className="text-blue-600 hover:underline">GitHub Repository</a></li>
            <li><a href="https://github.com/yt-dlp/yt-dlp#readme" className="text-blue-600 hover:underline">Official README</a></li>
          </ul>
        </section>
      </div>
    </main>
  );
}
