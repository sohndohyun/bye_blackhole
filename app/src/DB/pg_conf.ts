var {Client} = require('pg');

const pg_conf = new Client({
  user: "postgres",
  host: "db_postgres",
  database: "transcendence",
  password: "password",
  port: 5432
});

pg_conf.connect();

export default pg_conf;