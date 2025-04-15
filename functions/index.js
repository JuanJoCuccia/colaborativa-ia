const { onRequest } = require("firebase-functions/v2/https");
const cors = require("cors")({ origin: true });
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY || "clave-fake-si-no-seteaste",
});

const openai = new OpenAIApi(configuration);

exports.chatWithGPT = onRequest(
  { memory: "1GiB", timeoutSeconds: 60 },
  async (req, res) => {
    cors(req, res, async () => {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.set("Access-Control-Allow-Origin", "*").status(400).json({ error: "Formato incorrecto" });
      }

      try {
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages,
        });

        const reply = response.data.choices[0].message.content;
        res.set("Access-Control-Allow-Origin", "*").status(200).json({ reply });
      } catch (error) {
        console.error("OpenAI error:", error);
        res.set("Access-Control-Allow-Origin", "*").status(500).json({ error: "Error al generar respuesta" });
      }
    });
  }
);