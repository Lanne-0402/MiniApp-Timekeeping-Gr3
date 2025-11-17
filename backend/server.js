import app from "./app.js";

console.log("server.js loaded");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Timekeeping running on port ${PORT}`);
});
