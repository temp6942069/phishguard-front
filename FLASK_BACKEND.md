# Flask Backend Setup

Create a file called `app.py` with the following code and run it on your machine:

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from mock_model import load_model
import numpy as np
import io
import time

try:
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.chrome.service import Service
    from webdriver_manager.chrome import ChromeDriverManager
    from PIL import Image
    HAS_SELENIUM = True
except ImportError:
    HAS_SELENIUM = False
    print("⚠️  Warning: Selenium/Pillow not installed. Using dummy noise images.")

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Load model once at startup
model = load_model("phishing_detection_model_v2.h5")

def get_screenshot_tensor(url):
    target_size = (224, 224)
    
    if not HAS_SELENIUM:
        return np.random.rand(224, 224, 3)

    print(f"    📷 Capturing screenshot for {url}...")
    
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    
    try:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        
        driver.set_page_load_timeout(10)
        try:
            driver.get(url)
            time.sleep(1)
        except:
            print(f"    ⚠️  Timeout/Error loading {url}")
            
        png_data = driver.get_screenshot_as_png()
        driver.quit()
        
        image = Image.open(io.BytesIO(png_data))
        image = image.convert("RGB")
        image = image.resize(target_size)
        
        image_array = np.array(image)
        return image_array

    except Exception as e:
        print(f"    ❌ Screenshot failed: {e}")
        return np.zeros((224, 224, 3))

@app.route('/scan', methods=['POST'])
def scan_url():
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        print(f"Scanning: {url}")
        
        # Get screenshot and analyze
        image_input = get_screenshot_tensor(url)
        result = model.predict(url, image_input)
        
        print(f"Result: {'❌ DANGEROUS' if result == 'PHISHING' else '✅ SAFE'} ({result})")
        
        return jsonify({
            'url': url,
            'result': result,
            'status': 'success'
        })
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    print("\n--- PhishGuard Backend Server ---\n")
    print("Starting server on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
```

## Requirements

Install the required packages:

```bash
pip install flask flask-cors numpy pillow selenium webdriver-manager
```

## Running the Backend

1. Make sure you have your `mock_model.py` and model file in the same directory
2. Run the Flask server:

```bash
python app.py
```

3. The frontend will automatically connect to `http://localhost:5000/scan`

## API Endpoints

- `POST /scan` - Scan a URL for phishing
  - Request body: `{ "url": "https://example.com" }`
  - Response: `{ "url": "...", "result": "SAFE" | "PHISHING", "status": "success" }`

- `GET /health` - Health check endpoint
