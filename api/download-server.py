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
            ydl_opts = {
                'outtmpl': output_path,
                'format': format_id if not format_id.startswith('mp3') else f'-x --audio-format mp3',
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
            for f in info.get('formats', [])[:10]:
                filesize = f.get('filesize', 0)
                size_str = f'{filesize/1024/1024:.1f} MB' if filesize > 1048576 else f'{filesize/1024:.0f} KB' if filesize else 'Unknown'
                formats.append({
                    'format_id': f['format_id'],
                    'quality': f.get('format_note', f.get('height', 'audio')),
                    'ext': f['ext'],
                    'filesize': size_str,
                    'type': 'audio' if f.get('vcodec') == 'none' else 'video'
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
                'duration': info.get('duration'),
                'formats': formats + mp3_formats
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
