import pg_conf from "./pg_conf"

function Init()
{
	var sql = "create or replace function bytea_import(p_path text, p_result out bytea)\
				language plpgsql as $$\
				declare\
				   l_oid oid;\
				   r record;\
				begin\
				   p_result := '';\
				   select lo_import(p_path) into l_oid;\
				   for r in ( select data\
							  from pg_largeobject\
							  where loid = l_oid\
							  order by pageno ) loop\
					 p_result = p_result || r.data;\
				   end loop;\
				   perform lo_unlink(l_oid);\
				end;$$;"
	pg_conf.query(sql, (err:any, res:any) => {
		if (!err) console.log(res);
		else console.log(err);
	})

	pg_conf.query("CREATE TABLE IF NOT EXISTS chat_user(id TEXT primary key, room TEXT, icon bytea)", (err:any, res:any) => {
		if (!err) console.log(res);
		else console.log(err);
	})

/*
	pg_conf.query("SELECT * FROM chat_user", (err:any, res:any) => {
		if (!err) console.log(res);
		else console.log(err);
	})
*/
};

function Insert(roomName: string, userName: string, icon: string)
{
	var sql = "INSERT INTO chat_user (id, room, icon) VALUES($1, $2, bytea_import($3)) RETURNING *";
	var values = [userName, roomName, '/images/' + icon];
	pg_conf.query(sql, values, (err:any, res:any) => {
		if (!err) console.log(res);
		else console.log(err);
		//pg_conf.end();
	})
}

function Delete(userName: string)
{
	var sql = "DELETE FROM chat_user WHERE id IN ($1) RETURNING *";
	var values = [userName];
	pg_conf.query(sql, values, (err:any, res:any) => {
		if (!err) console.log(res);
		else console.log(err);
	})
}

async function Select()
{
	var sql = "SELECT id, room, ENCODE(icon, 'base64') as icon FROM chat_user *";
	const result = await pg_conf.query(sql)
	return (result.rows)
}

export = {init:Init, insert:Insert, delete:Delete, select:Select};
