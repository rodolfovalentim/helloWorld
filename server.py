from flask import Flask, render_template
from flask_socketio import SocketIO
import json
import time
from threading import Lock
import requests

async_mode = None

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode=async_mode)
thread = None
thread_lock = Lock()

def background_thread():
    """Example of how to send server generated events to clients."""
    count = 0
    while True:
        socketio.sleep(1)
        count += 1
        socketio.emit("message", '{"author": "player1", "message": "' + str(count) + '" }')

@socketio.on('connect')
def test_connect():
    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(background_thread)
    print("Client connected")
    socketio.emit("message", '{"author": "connect", "message": "0"}')

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')

@socketio.on('message')
def handle_message(message):
    print('received message: ', message)
#     socketio.emit("message", '{"author": "player1", "message": "10"}')

@socketio.on('json')
def handle_json(json):
    print('received json: ' + str(json))

if __name__ == '__main__':
    socketio.run(app, debug=True)

