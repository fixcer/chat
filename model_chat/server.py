from flask import Flask, request, jsonify
from model import check_profanity_vocab

app = Flask(__name__)


@app.route('/', methods=['POST'])
def index():
    data = {
        'status': 200,
        'msg': 'Ok'
    }

    return jsonify(data)


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
