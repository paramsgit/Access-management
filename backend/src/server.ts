import app from "./app";

import dotenv from "dotenv";
dotenv.config();
console.log("efoknekfnekn", process.env.PORT);
const PORT = process.env.PORT || 5000;

app.listen(Number(PORT), () => {
  console.log(`[boot] server listening on http://localhost:${PORT}`);
});
