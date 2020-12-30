const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const { resolve } = require("path");

require("dotenv").config({
  path: resolve(process.cwd(), ".env"),
});
console.log(resolve(process.cwd(), ".env"));
// console.log(process.env);
const app = express();

const port = process.env.API_PORT;
const appOrigin = process.env.APP_ORIGIN;
const audience = process.env.AUTH0_AUDIENCE;
const issuer = process.env.AUTH0_ISSUER;

if (!issuer || !audience) {
  throw new Error("Please make sure that .env is in place and populated");
}

const { Pool } = require('pg'); // Enables querying postgresql DB
// Configure DB connection using values from .env
const pool = new Pool({
    host: process.env.PGFC_HOST,
    database: process.env.PGFC_DATABASE,
    user: process.env.PGFC_RW_USERNAME,
    password: process.env.PGFC_RW_PASSWORD,
    port: process.env.PGFC_PORT,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: appOrigin }));
app.use(express.json());

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${issuer}.well-known/jwks.json`,
  }),

  audience: audience,
  issuer: issuer,
  algorithms: ["RS256"],
});

app.get("/api/public-message", (req, res) => {
  res.send({
    msg: "The API doesn't require an access token to share this message.",
  });
});

app.post("/api/list", (req, res) => {

  let { lootBoxTier, adTier, timerTier } = req.body[0];

  pool.query(`
        select * from agg_tier_apps
        where loot_box_tier <= $1::INT
        and ad_tier <= $2::INT
        and timer_tier <= $3::INT
    `,[lootBoxTier, adTier, timerTier]).then(result => {
      res.send(result.rows);
    }).catch(error => {
      res.send(error);
    });
});

app.get("/api/private-message", checkJwt, (req, res) => {
  res.send({
    msg: "The API successfully validated your access token.",
  });
});

app.listen(port, () => console.log(`API Server listening on port ${port}`));
