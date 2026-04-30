import { execute } from "./agent";
import express, { json } from "express";
import cors from "cors";

const app = express();
// Configurar CORS apenas para https://maisvacinas.netlify.app/
app.use(
  cors({
    origin: "https://maisvacinas.netlify.app",
    methods: ["GET"],
    credentials: true,
  }),
);

app.use(json());

// Rota GET /chat
app.get("/chat", async (req, res) => {
  try {
    const message = req.query.message as string;

    if (!message)
      return res
        .status(400)
        .send({ result: { message: 'Query param "message" obrigatório' } });

    const result = await execute(message);
    res.json({
      result: {
        result,
      },
    });
  } catch (error) {
    res.status(500).json({
      result: {
        message:
          "Ocorreu um erro ao tentar responder, por favor tente mais tarde",
      },
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
