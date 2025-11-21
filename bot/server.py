from flask import Flask, request, jsonify, render_template_string
import threading
from bot import visit, SERVICE_HOST
import os   

app = Flask(__name__)

REPORT_HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Report to Admin - Menfess</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #0a0a0a;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      color: #e5e5e5;
      position: relative;
      overflow: hidden;
    }

    /* Ambient background */
    body::before, body::after {
      content: "";
      position: absolute;
      border-radius: 50%;
      filter: blur(120px);
      opacity: 0.15;
      animation: pulse 6s infinite alternate;
    }
    body::before {
      width: 400px;
      height: 400px;
      background: #10b981; /* emerald */
      top: -100px;
      left: -100px;
    }
    body::after {
      width: 400px;
      height: 400px;
      background: #06b6d4; /* cyan */
      bottom: -100px;
      right: -100px;
      animation-delay: 3s;
    }

    @keyframes pulse {
      from { transform: scale(1); opacity: 0.15; }
      to { transform: scale(1.2); opacity: 0.25; }
    }

    .container {
      position: relative;
      background: rgba(24, 24, 27, 0.7);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(63, 63, 70, 0.5);
      padding: 32px;
      border-radius: 20px;
      width: 100%;
      max-width: 500px;
      text-align: center;
      box-shadow: 0 10px 40px rgba(0,0,0,0.4);
    }

    .header h1 {
      font-size: 26px;
      font-weight: 400;
      color: #fff;
      margin-bottom: 8px;
    }

    .header p {
      font-size: 14px;
      color: #9ca3af;
      font-weight: 300;
    }

    .form-group {
      margin: 24px 0;
      text-align: left;
    }

    label {
      display: block;
      margin-bottom: 8px;
      color: #d4d4d8;
      font-size: 14px;
      font-weight: 300;
    }

    input[type="url"] {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #3f3f46;
      border-radius: 12px;
      font-size: 15px;
      background: rgba(39, 39, 42, 0.6);
      color: #fff;
      transition: all 0.3s ease;
    }

    input[type="url"]:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 0 2px rgba(16,185,129,0.3);
    }

    .btn {
      background: linear-gradient(135deg, #10b981, #06b6d4);
      color: white;
      padding: 14px 28px;
      border: none;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 400;
      cursor: pointer;
      transition: all 0.3s ease;
      width: 100%;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(16,185,129,0.3);
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .message {
      margin-top: 20px;
      padding: 12px;
      border-radius: 10px;
      font-size: 14px;
    }

    .success {
      background-color: rgba(16,185,129,0.15);
      border: 1px solid rgba(16,185,129,0.4);
      color: #34d399;
    }

    .error {
      background-color: rgba(239,68,68,0.15);
      border: 1px solid rgba(239,68,68,0.4);
      color: #f87171;
    }

    .example {
      margin-top: 24px;
      padding: 16px;
      background: rgba(39,39,42,0.6);
      border: 1px solid rgba(63,63,70,0.5);
      border-radius: 12px;
      text-align: left;
    }

    .example p {
      margin-bottom: 8px;
      font-size: 14px;
      color: #a1a1aa;
    }

    .example code {
      background: rgba(63,63,70,0.6);
      padding: 3px 6px;
      border-radius: 6px;
      font-family: monospace;
      font-size: 13px;
      color: #34d399;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Report to Admin</h1>
      <p>Found something suspicious? Send it to our admin for review.</p>
    </div>

    <form id="reportForm" onsubmit="submitReport(event)">
      <div class="form-group">
        <label for="url">Post URL</label>
        <input type="url" id="url" name="url" required placeholder="https://{host}/posts/123">
      </div>

      <button type="submit" class="btn" id="submitBtn">
        Send to Admin
      </button>
    </form>

    <div id="message" class="message" style="display: none;"></div>

    <div class="example">
      <p><strong>How to use:</strong></p>
      <p>1. Copy the URL of the post you want to report</p>
      <p>2. Paste it in the field above</p>
      <p>3. Click "Send to Admin" and wait for review</p>
    </div>
  </div>

  <script>
    async function submitReport(event) {
      event.preventDefault();
      const form = event.target;
      const url = form.url.value;
      const submitBtn = document.getElementById('submitBtn');
      const messageDiv = document.getElementById('message');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '⏳ Sending...';
      messageDiv.style.display = 'none';

      try {
        const response = await fetch('/report/visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        });
        const result = await response.json();
        messageDiv.style.display = 'block';
        if (response.ok) {
          messageDiv.className = 'message success';
          messageDiv.innerHTML = '✅ ' + result.message;
          form.reset();
        } else {
          messageDiv.className = 'message error';
          messageDiv.innerHTML = '❌ ' + (result.error || 'Failed to submit report');
        }
      } catch (error) {
        messageDiv.style.display = 'block';
        messageDiv.className = 'message error';
        messageDiv.innerHTML = '❌ Network error occurred';
      }
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send to Admin';
    }
  </script>
</body>
</html>
"""

@app.route('/')
def report_page():
    return render_template_string(REPORT_HTML)

@app.route('/visit', methods=['POST'])
def handle_visit():
    data = request.get_json()
    
    if not data or 'url' not in data:
        return jsonify({'error': 'URL is required'}), 400
    
    url = data['url'].strip()

    if not url.startswith(f"{SERVICE_HOST}/posts/"):
        return jsonify({'error': 'Invalid URL - only local posts allowed'}), 400

    def async_visit():
        try:
            success, message = visit(url)
            print(f"Visit result: {success}, {message}")
        except Exception as e:
            print(f"Async visit error: {str(e)}")
    
    thread = threading.Thread(target=async_visit)
    thread.daemon = True
    thread.start()
    
    return jsonify({
        'message': 'Report submitted successfully! Admin will review it shortly.',
        'url': url
    }), 200

@app.route('/health')
def health():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    print("Initializing bot...")
    try:
        from bot import init
        init()
        print("Bot initialized successfully")
    except Exception as e:
        print(f"Bot initialization failed: {str(e)}")
    
    app.run(host='0.0.0.0', port=5000, debug=False)