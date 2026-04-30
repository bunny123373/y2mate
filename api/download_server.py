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
        proxy = os.environ.get('PROXY_URL', '')
        
        base_opts = {'quiet': True}
        if proxy:
            base_opts['proxy'] = proxy
        
        if download:
            output_path = os.path.join(DOWNLOAD_FOLDER, f'{uuid.uuid4()}.%(ext)s')
            
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
            ydl_opts.update(base_opts)
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=True)
                filename = ydl.prepare_filename(info)
            
            return send_file(filename, as_attachment=True)
        else:
            with yt_dlp.YoutubeDL(base_opts) as ydl:
                info = ydl.extract_info(url, download=False)
            
            formats = []
            video_formats = [f for f in info.get('formats', []) if f.get('vcodec') != 'none']
            audio_formats = [f for f in info.get('formats', []) if f.get('vcodec') == 'none' and f.get('acodec') != 'none']
            
            seen_qualities = set()
            for f in video_formats:
                height = f.get('height') or 0
                ext = f.get('ext', '')
                if height and height not in seen_qualities and ext in ['mp4', 'webm']:
                    filesize = f.get('filesize') or 0
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
            
            for f in audio_formats[:4]:
                filesize = f.get('filesize') or 0
                size_str = f'{filesize/1024/1024:.1f} MB' if filesize > 1048576 else f'{filesize/1024:.0f} KB' if filesize else 'Unknown'
                formats.append({
                    'format_id': f['format_id'],
                    'quality': f.get('format_note', 'audio'),
                    'ext': f['ext'],
                    'filesize': size_str,
                    'type': 'audio'
                })
            
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
        error_msg = str(e)
        return jsonify({'error': error_msg}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
