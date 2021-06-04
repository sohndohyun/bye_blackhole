var {Client} = require('pg');

const pg_conf = new Client({
  user: "postgres",
  host: "db_postgres",
  database: "transcendence",
  password: "password",
  port: 5432
});

function GetUserList()
{
	pg_conf.connect();
/*
	pg_conf.query("CREATE TABLE userList(id char(16) primary key, name integer, nickname integer)", (err: any, res: any) => {
		if (!err) console.log(res);
		else console.log(err);
	});
	var sql = "SELECT * FROM userList";
	pg_conf.query(sql, (err: any, res: any) => {
		if (!err) console.log(res);
		else console.log(err);
	});


	sql = "CREATE TABLE userList2 (id , name, nickname, email, password, favorit_type, favorite_country)";
	pg_conf.query(sql, (err: any, res: any) => {
		if (!err) console.log(res);
		else console.log(err);
	});*/
/*
	var sql = "INSERT INTO userList (id, name, nickname) VALUES($1, $2, $3) RETURNING *";
	const values = ['id', 123, 456];

	pg_conf.query(sql, values, (err: any, res: any) => {
		if (!err) console.log(res);
		else console.log(err);
	});
*/
	pg_conf.query("SELECT * FROM userList", (err: any, res: any) => {
		if (!err) console.log(res);
		else console.log(err);
		pg_conf.end();
	});

};

export = {getUserList:GetUserList};