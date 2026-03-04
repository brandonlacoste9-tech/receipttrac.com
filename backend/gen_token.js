import jwt from "jsonwebtoken";
import "dotenv/config";

const user = {
  id: "4fbd6f99-d38b-4216-a612-2d8f867aaef1",
  email: "brandonlacoste9@gmail.com",
};

const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
console.log(token);
