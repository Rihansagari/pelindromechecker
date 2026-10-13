
from flask import Flask, render_template, request, jsonify

try:
    from .palindrome import check_palindrome
except ImportError:
    from palindrome import check_palindrome

app = Flask(__name__, template_folder="templets", static_folder="static")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/check", methods=["POST"])
def check():
    data = request.get_json(silent=True) or {}
    text = data.get("text", "")

    if not isinstance(text, str) or len(text) > 500:
        return jsonify({"error": "Enter text up to 500 characters."}), 400

    result, _ = check_palindrome(text)

    return jsonify({
        "input": text,
        "is_palindrome": result,
        "message": (
            "It is a palindrome!"
            if result else "It is not a palindrome."
        )
    })


if __name__ == "__main__":
    app.run(debug=True)
