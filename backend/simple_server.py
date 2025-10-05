from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    return jsonify({
        'message': 'Registration successful (test)',
        'received_data': data
    }), 201

if __name__ == '__main__':
    app.run(debug=True, port=8000, host='0.0.0.0')