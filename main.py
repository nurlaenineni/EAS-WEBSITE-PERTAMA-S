from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/checkout", methods=["POST"])
def checkout():
    data = request.json  # Ambil data dari frontend
    total = data.get("total", 0)
    return jsonify({"message": f"Pembayaran sebesar Rp {total} berhasil diproses!"})

if __name__ == "__main__":
    app.run(debug=True)
