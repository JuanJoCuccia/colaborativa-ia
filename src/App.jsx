import React, { useState } from "react";

function App() {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        setLoading(true);
        setResponse(""); // Limpiar antes de la nueva respuesta

        try {
            const res = await fetch("https://us-central1-collabai-ldxh6.cloudfunctions.net/chatWithGPT", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [{ role: "user", content: input }],
                }),
            });

            const data = await res.json();
            setResponse(data.reply || "La IA no respondió 😕");
        } catch (err) {
            console.error("Error:", err);
            setResponse("Error al conectar con la IA 😓");
        }

        setLoading(false);
    };

    return (
        <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "600px", margin: "auto" }}>
            <h1>Colaborativa IA 🔥</h1>
            <p>Escribí algo y conversá con la IA en tu propia plataforma 🧠</p>

            <input
                type="text"
                placeholder="¿En qué estás pensando?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{
                    padding: "0.5rem",
                    width: "100%",
                    marginBottom: "1rem",
                    fontSize: "1rem",
                }}
            />

            <button
                onClick={handleSend}
                disabled={loading}
                style={{
                    padding: "0.5rem 1rem",
                    fontSize: "1rem",
                    cursor: loading ? "not-allowed" : "pointer",
                }}
            >
                {loading ? "Consultando..." : "Enviar"}
            </button>

            {response && (
                <div style={{ marginTop: "2rem", background: "#f4f4f4", padding: "1rem", borderRadius: "8px" }}>
                    <strong>Respuesta IA:</strong>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
}

export default App;