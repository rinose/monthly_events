# Importing flask module in the project is mandatory
# An object of Flask class is our WSGI application.
from flask import Flask
import os
from flask import request
from flask_cors import CORS
from openai import OpenAI





# Flask constructor takes the name of 
# current module (__name__) as argument.
app = Flask(__name__)
cors = CORS(app)
# The route() function of the Flask class is a decorator, 
# which tells the application which URL should call 
# the associated function.
@app.route('/')
# ‘/’ URL is bound with hello_world() function.
def hello():
    return 'Hello from didaskai api v1'

@app.route('/upload', methods=['POST'])
def upload():
  # Get params
  audio_file = request.files.get('file')
  file_type = request.form.get("type", "jpeg")
  
  # You may want to create a uuid for your filenames
  filename = "temp_file." + file_type
  
  # Save it on your local disk
  target_path = ("./"+ filename)
  audio_file.save(target_path)
  
  # return json response
  return {"status": "success", "filename": filename, "target_path": target_path}


# main driver function
if __name__ == '__main__':

    # run() method of Flask class runs the application 
    # on the local development server.
    app.run(host="0.0.0.0")
