import os
from flask import Flask, request, jsonify, render_template, send_file
import requests
from PIL import Image, ImageDraw, ImageFont
import io
import base64
import re

app = Flask(__name__)

# Set your OpenAI API key
OPENAI_API_KEY = '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'

@app.route('/')
def home():
    return render_template('upload.html')

@app.route('/analyze', methods=['POST'])
def analyze_image():
    """Handle image input, send it to GPT-4 Vision for analysis, and return the image with errors circled."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Read the image file
    image_data = file.read()
    
    # Encode the image to base64
    encoded_image = base64.b64encode(image_data).decode('utf-8')

    # Prepare the request to the OpenAI API
    headers = {
        'Authorization': f'Bearer {OPENAI_API_KEY}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        "model": "gpt-4o",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Identify any English errors in this image. For each error, provide the error text, the correct text, and the approximate pixel coordinates (x, y) of the error in the image. Format each error as: 'Error: [error text] - Correction: [correct text] - Coordinates: (x: X, y: Y)'"
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{encoded_image}"
                        }
                    }
                ]
            }
        ],
        "max_tokens": 500
    }

    response = requests.post(
        'https://api.openai.com/v1/chat/completions',
        headers=headers,
        json=payload
    )

    print(f"Response status code: {response.status_code}")
    print(f"Response content: {response.text}")

    if response.status_code == 200:
        # Process the API response
        api_response = response.json()
        print(f"API Response: {api_response}")
        
        if 'choices' in api_response and len(api_response['choices']) > 0:
            content = api_response['choices'][0]['message']['content']
            print(f"Content: {content}")
            errors = parse_errors(content)
            
            # Open the image and draw circles around errors
            img = Image.open(io.BytesIO(image_data))
            draw = ImageDraw.Draw(img)
            
            for error in errors:
                x, y = error['coordinates']
                # Draw a red circle around the error
                draw.ellipse((x-20, y-20, x+20, y+20), outline='red', width=2)
                # Add a label near the circle
                draw.text((x+25, y-10), f"{error['error_text']} -> {error['correct_text']}", fill='red')

            # Save the modified image to a byte stream
            img_byte_arr = io.BytesIO()
            img.save(img_byte_arr, format='JPEG')
            img_byte_arr.seek(0)

            # Return the image file
            return send_file(img_byte_arr, mimetype='image/jpeg')
        else:
            return jsonify({'error': 'Unexpected API response format'}), 500
    else:
        return jsonify({'error': response.text}), response.status_code

def parse_errors(content):
    print(f"Parsing errors from content: {content}")
    errors = []
    # Use regex to find all instances of the error format
    error_pattern = r"Error: \"(.*?)\" - Correction: \"(.*?)\" - Coordinates: \(x: (\d+), y: (\d+)\)"
    matches = re.findall(error_pattern, content)
    
    for match in matches:
        error_text, correct_text, x, y = match
        errors.append({
            'error_text': error_text.strip(),
            'correct_text': correct_text.strip(),
            'coordinates': (int(x), int(y))
        })
    
    print(f"Parsed errors: {errors}")
    return errors

if __name__ == '__main__':
    app.run(debug=True)
