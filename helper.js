export default function addHeaders(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Accept-Version, Content-Length, Content-MD5, content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, DELETE, HEAD, PUT, PTIONS, POST"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Max-Age", "1800");
  if (req.method == "OPTIONS") {
    res.status(200).end();
  } else next();
}

export function getProfilePath(filename) {
  return path.join(__dirname + "/uploads/" + filename);
}
