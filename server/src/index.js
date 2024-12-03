import { server } from "./app.js";
import connectDB from "./db/index.js";

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 3000, () => {
      console.log("server running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Error, mongodb connection failed", err);
  });
