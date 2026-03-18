const allowedOrigins = () => {
  return JSON.parse(process.env.ALLOWED_ORIGINS || "[]");
};
export default allowedOrigins;
