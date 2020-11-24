from flask import Flask, request, jsonify
from model import check_profanity_vocab

app = Flask(__name__)


# A welcome message to test our server
@app.route('/')
def index():
    return "<h1>Welcome to our server !!</h1>"


@app.route('/filter', methods=['POST'])
def filter():
    req = request.json
    accept = check_profanity_vocab(req['message'])
    data = {
        'status': 200,
        'accept': accept
    }

    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=False)
