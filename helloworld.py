from flask import Flask
app = Flask(__name__)
@app.route('/')
def start():
    return  "<ul><li>Joe</li><li>Rio</li><li>Stack</li></ul>"