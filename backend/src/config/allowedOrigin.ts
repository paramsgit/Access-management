const allowedOrigins = () => {
  console.log(process.env.ALLOWED_ORIGINS);
  return JSON.parse(process.env.ALLOWED_ORIGINS || "[]");
};
export default allowedOrigins;
