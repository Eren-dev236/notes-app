from flask import Flask, request, jsonify, render_template
import sqlite3
from datetime import datetime

app = Flask(__name__)


def get_db():
    conn = sqlite3.connect("notes.db")
    conn.row_factory = sqlite3.Row
    return conn


# Create database
with get_db() as conn:
    conn.execute("""
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)


# Home page
@app.route("/")
def home():
    return render_template("index.html")


# Get all notes
@app.route("/notes", methods=["GET"])
def get_notes():

    with get_db() as conn:
        notes = conn.execute(
            "SELECT * FROM notes ORDER BY id DESC"
        ).fetchall()

    return jsonify([dict(note) for note in notes])


# Save note
@app.route("/notes", methods=["POST"])
def add_note():

    data = request.get_json()

    content = data.get("content", "").strip()

    if not content:
        return jsonify({"error": "Note cannot be empty"}), 400

    created_at = datetime.now().strftime("%d %B %Y • %I:%M %p")

    with get_db() as conn:

        cursor = conn.execute(
            """
            INSERT INTO notes (content, created_at)
            VALUES (?, ?)
            """,
            (content, created_at)
        )

        note_id = cursor.lastrowid

    return jsonify({
        "id": note_id,
        "content": content,
        "created_at": created_at
    })


# Delete note
@app.route("/notes/<int:note_id>", methods=["DELETE"])
def delete_note(note_id):

    with get_db() as conn:

        conn.execute(
            "DELETE FROM notes WHERE id = ?",
            (note_id,)
        )

    return jsonify({"message": "Note deleted"})


if __name__ == "__main__":
    app.run(debug=True)