import pg_conf from "./pg_conf"

function Init(){
	pg_conf.query("CREATE TABLE IF NOT EXISTS chat_room(id TEXT primary key, password TEXT, owner_id TEXT)", (err:any, res:any) => {
		if (!err) console.log(res);
		else console.log(err);
	})
}

function Insert(id:string, password:string, owner_id:string){
	var sql = "INSERT INTO chat_user (id, password, owner_id) VALUES($1, $2, $3) RETURNING *";
	var values = [id, password, owner_id];
	pg_conf.query(sql, values, (err:any, res:any) => {
		if (!err) console.log(res);
		else console.log(err);
	})
}

async function Select()
{
	var sql = "SELECT id, password, owner_id FROM chat_room *";
	const result = await pg_conf.query(sql)
	return (result.rows)
}

export = {init:Init, insert:Insert, select:Select}