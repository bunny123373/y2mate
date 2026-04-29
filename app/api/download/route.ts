import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { join } from 'path';
import { tmpdir } from 'os';
import { existsSync, unlinkSync, readFileSync } from 'fs';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { url, format_id, download } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    // If download flag is true, download the video
    if (download) {
      const timestamp = Date.now();
      const outputPath = join(tmpdir(), `yt-dlp-${timestamp}.%(ext)s`);
      
      // Check if MP3 is requested
      const isMP3 = format_id?.includes('mp3');
      
      let args;
      if (isMP3) {
        const audioQuality = format_id.includes('128') ? '128K' : 
                          format_id.includes('192') ? '192K' :
                          format_id.includes('320') ? '320K' : 'best';
        args = ['--js-runtimes', 'node', '-x', '--audio-format', 'mp3', '--audio-quality', audioQuality, '-o', outputPath, url];
      } else {
        args = ['--js-runtimes', 'node', '-f', format_id || 'best', '-o', outputPath, url];
      }
      
      // Run yt-dlp to download
      const proc = spawn('yt-dlp', args);

      let output = '';
      proc.stdout.on('data', (data) => { output += data.toString(); });
      proc.stderr.on('data', (data) => { output += data.toString(); });

      await new Promise((resolve, reject) => {
        proc.on('close', (code) => {
          if (code === 0) resolve(code);
          else reject(new Error(output || 'Download failed'));
        });
      });

      // Find the actual downloaded file
      const files = require('fs').readdirSync(tmpdir()) as string[];
      const downloadedFile = files.find((f: string) => f.startsWith(`yt-dlp-${timestamp}`));
      
      if (!downloadedFile) {
        return NextResponse.json({ error: 'File not found after download' }, { status: 500 });
      }

      const filePath = join(tmpdir(), downloadedFile);
      const fileBuffer = readFileSync(filePath);
      unlinkSync(filePath); // Clean up

      const ext = downloadedFile.split('.').pop();
      const contentType = ext === 'mp4' ? 'video/mp4' : ext === 'webm' ? 'video/webm' : 'application/octet-stream';

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${downloadedFile}"`,
        },
      });
    }

    // Otherwise, return video info
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execPromise = promisify(exec);
    
    const { stdout } = await execPromise(`yt-dlp --js-runtimes node -J "${url}"`);
    const info = JSON.parse(stdout);
    
    // Get video formats
    const videoFormats = (info.formats || [])
      .filter((f: any) => f.ext !== 'mhtml' && !f.format_note?.includes('storyboard') && f.vcodec !== 'none')
      .slice(0, 10)
      .map((f: any) => {
        const filesize = f.filesize || f.filesize_approx || 0;
        const sizeMB = filesize ? (filesize / 1024 / 1024).toFixed(1) : null;
        const sizeKB = filesize ? (filesize / 1024).toFixed(0) : null;
        const sizeStr = filesize ? (filesize > 1048576 ? `${sizeMB} MB` : `${sizeKB} KB`) : 'Unknown';
        
        return {
          format_id: f.format_id,
          quality: f.format_note || (f.height ? `${f.height}p` : f.ext),
          ext: f.ext,
          filesize: sizeStr,
          type: 'video'
        };
      });

    // Get audio formats for MP3 conversion
    const audioFormats = [
      { format_id: 'mp3-128', quality: 'MP3 128k', ext: 'mp3', filesize: '~1 MB/min', type: 'audio' },
      { format_id: 'mp3-192', quality: 'MP3 192k', ext: 'mp3', filesize: '~1.5 MB/min', type: 'audio' },
      { format_id: 'mp3-320', quality: 'MP3 320k', ext: 'mp3', filesize: '~2.5 MB/min', type: 'audio' },
      { format_id: 'mp3-best', quality: 'MP3 Best', ext: 'mp3', filesize: '~2.5 MB/min', type: 'audio' },
    ];

    const formats = [...videoFormats, ...audioFormats];

    return NextResponse.json({
      title: info.title,
      thumbnail: info.thumbnail,
      duration: info.duration,
      formats,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
