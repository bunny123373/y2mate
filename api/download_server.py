#!/usr/bin/env python3
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import yt_dlp
import os
import tempfile
import uuid

app = Flask(__name__)
CORS(app)

DOWNLOAD_FOLDER = tempfile.mkdtemp()

@app.route('/api/download', methods=['POST'])
def download_video():
    data = request.json
    url = data.get('url')
    format_id = data.get('format_id', 'best')
    download = data.get('download', False)
    
    if not url:
        return jsonify({'error': 'No URL provided'}), 400
    
    try:
        if download:
            # Download video
            output_path = os.path.join(DOWNLOAD_FOLDER, f'{uuid.uuid4()}.%(ext)s')
            
            # Handle MP3 formats
            if format_id.startswith('mp3'):
                quality_map = {'mp3-128': '128K', 'mp3-192': '192K', 'mp3-320': '320K', 'mp3-best': 'best'}
                ydl_opts = {
                    'outtmpl': output_path,
                    'format': 'bestaudio/best',
                    'postprocessors': [{
                        'key': 'FFmpegExtractAudio',
                        'preferredcodec': 'mp3',
                        'preferredquality': quality_map.get(format_id, 'best'),
                    }],
                }
            else:
                ydl_opts = {
                    'outtmpl': output_path,
                    'format': format_id,
                }
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=True)
                filename = ydl.prepare_filename(info)
            
            return send_file(filename, as_attachment=True)
        else:
            # Return video info
            with yt_dlp.YoutubeDL({'quiet': True}) as ydl:
                info = ydl.extract_info(url, download=False)
                
            formats = []
            # Get video formats (with video codec)
            video_formats = [f for f in info.get('formats', []) if f.get('vcodec') != 'none' and f.get('acodec') != 'none']
            # Get audio-only formats
            audio_formats = [f for f in info.get('formats', []) if f.get('vcodec') == 'none' and f.get('acodec') != 'none']
            
            # Add video formats (up to 8, prefer mp4)
            seen_qualities = set()
            for f in video_formats:
                height = f.get('height', 0)
                ext = f.get('ext', '')
                if height not in seen_qualities and ext in ['mp4', 'webm']:
                    filesize = f.get('filesize', 0)
                    size_str = f'{filesize/1024/1024:.1f} MB' if filesize > 1048576 else f'{filesize/1024:.0f} KB' if filesize else 'Unknown'
                    formats.append({
                        'format_id': f['format_id'],
                        'quality': f.get('format_note', f'{height}p'),
                        'ext': ext,
                        'filesize': size_str,
                        'type': 'video'
                    })
                    seen_qualities.add(height)
                if len(seen_qualities) >= 8:
                    break
            
            # Add audio formats (mp4, webm, m4a)
            for f in audio_formats[:4]:
                filesize = f.get('filesize', 0)
                size_str = f'{filesize/1024/1024:.1f} MB' if filesize > 1048576 else f'{filesize/1024:.0f} KB' if filesize else 'Unknown'
                formats.append({
                    'format_id': f['format_id'],
                    'quality': f.get('format_note', 'audio'),
                    'ext': f['ext'],
                    'filesize': size_str,
                    'type': 'audio'
                })
            
            # Add MP3 options
            mp3_formats = [
                {'format_id': 'mp3-128', 'quality': 'MP3 128k', 'ext': 'mp3', 'filesize': '~1 MB/min', 'type': 'audio'},
                {'format_id': 'mp3-192', 'quality': 'MP3 192k', 'ext': 'mp3', 'filesize': '~1.5 MB/min', 'type': 'audio'},
                {'format_id': 'mp3-320', 'quality': 'MP3 320k', 'ext': 'mp3', 'filesize': '~2.5 MB/min', 'type': 'audio'},
                {'format_id': 'mp3-best', 'quality': 'MP3 Best', 'ext': 'mp3', 'filesize': '~2.5 MB/min', 'type': 'audio'},
            ]
            
            return jsonify({
                'title': info.get('title'),
                'thumbnail': info.get('thumbnail'),
                'duration': info.get('duration') or 0,
                'formats': formats + mp3_formats
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
