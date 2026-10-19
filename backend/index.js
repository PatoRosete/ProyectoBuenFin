const express=require("express");
const MongoClient=require("mongodb").MongoClient;
var cors=require("cors")
const bodyParser=require("body-parser")
const argon2=require("argon2")
const jwt=require("jsonwebtoken")
const fs=require("fs");
const https = require('https');

const app=express();
let db;
const PORT=3000;
const ROLES_VALIDOS=["consumidor","comercio","admin"];
app.use(cors());
app.use(bodyParser.json());

async function connectToDB(){
	let client=new MongoClient(await process.env.DB);
	await client.connect();
	db=client.db();
	console.log("conectado a la base de datos");
} 


async function log(sujeto, accion, objeto){
	nuevoLog={}
	nuevoLog["timestamp"]=new Date();
	nuevoLog["sujeto"]=sujeto;
	nuevoLog["accion"]=accion;
	nuevoLog["objeto"]=objeto;
	await db.collection("log").insertOne(nuevoLog);
	
}


function autenticar(...rolesPermitidos){
	return (req, res, next)=>{
		try{
			const token=jwt.verify(req.get("Authentication"), process.env.LLAVEJWT);
			if(!rolesPermitidos.includes(token.rol)){
				return res.sendStatus(403);
			}
			req.user=token;   // aqui queda {usuario, rol}
			next();
		}catch{
			res.sendStatus(401);
		}
	};
}

function filtroPorRol(req){
	return req.user.rol=="comercio" ? {owner:req.user.usuario} : {};
}

async function getList(coleccion, req, res, filtro){
	let sortBy=req.query._sort;
	let sortOrder=req.query._order=="ASC"?1:-1;
	let inicio=Number(req.query._start);
	let fin=Number(req.query._end);
	let sorter={}
	sorter[sortBy]=sortOrder;
	let data=await db.collection(coleccion).find(filtro).sort(sorter).project({_id:0}).toArray();
	res.set("Access-Control-Expose-Headers", "X-Total-Count");
	res.set("X-Total-Count", data.length);
	data=data.slice(inicio,fin);
	res.json(data);
}

async function getMany(coleccion, req, res, filtro){
	let ids=[].concat(req.query.id).map(Number);
	let data=await db.collection(coleccion).find({...filtro, id:{$in:ids}}).project({_id:0}).toArray();
	res.json(data);
}

async function getManyReference(coleccion, req, res, filtro){
	let data=await db.collection(coleccion).find({...req.query, ...filtro}).project({_id:0}).toArray();
	res.set("Access-Control-Expose-Headers", "X-Total-Count");
	res.set("X-Total-Count", data.length);
	res.json(data);
}

app.get("/Productos", autenticar("admin","comercio","consumidor"), async (req, res)=>{
	try{
		await log(req.user.usuario, "consultar datos", "/Productos");
		let filtro=filtroPorRol(req);
		if("_sort" in req.query){//getList
			await getList("productos", req, res, filtro);
		}else if("id" in req.query){
			await getMany("productos", req, res, filtro);
		}else{	
			await getManyReference("productos", req, res, filtro);
		}
	}catch{
		res.sendStatus(500);
	}
});

async function deleteOne(coleccion, filtro, req, res){
	let data=await db.collection(coleccion).deleteOne(filtro);
	res.json(data);
}

app.delete("/Productos/:id", autenticar("admin","comercio"), async (req, res)=>{
	await deleteOne("productos", {...filtroPorRol(req), id:Number(req.params.id)}, req, res);
});

async function getOne(coleccion, filtro, req, res){
	let data=await db.collection(coleccion).find(filtro).project({_id:0}).toArray();
	res.json(data[0]);
}

app.get("/Productos/:id", autenticar("admin","comercio","consumidor"), async (req, res)=>{
	await getOne("productos", {...filtroPorRol(req), id:Number(req.params.id)}, req, res);
});


async function updateData(coleccion,  req, res){
	valores=req.body;
	valores["id"]=Number(valores["id"]);
	let data=await db.collection(coleccion).updateOne({"id":valores["id"]},{"$set":valores});
	data=await db.collection(coleccion).find({"id": valores["id"]}).project({_id:0}).toArray();
	res.json(data[0]);

}


app.put("/Productos/:id", autenticar("admin"), async (req, res)=>{
	await updateData("productos", req, res)
})

async function createData(coleccion, valores, req, res){
	let data=await db.collection(coleccion).insertOne(valores);
	res.json(data);
}

app.post("/Productos", autenticar("admin","comercio"), async (req, res)=>{
	let valores=req.body;
	valores["id"]=Number(valores["id"]);
	valores["owner"]=req.user.usuario;   // sale del token, no del formulario
	await createData("productos", valores, req, res);
})


app.post("/registrarse", async (req, res)=>{
	let user=req.body.username;
	let pass=req.body.password;
	let data=await db.collection("usuarios").findOne({"usuario":user});
	if(data==null){
		const hash=await argon2.hash(pass, {type:argon2.argon2id, memoryCost: 64*1024, timeCost:3, parallelism:1, saltLength:128});
		// El rol lo pone el servidor: todos entran como consumidor, sin leer nada del formulario
		let usuarioAgregar={"usuario":user, "password":hash, "rol":"consumidor"};
		data=await db.collection("usuarios").insertOne(usuarioAgregar);
		res.sendStatus(201);
	}else{
		res.sendStatus(403);
	}
})

app.post("/login", async(req, res)=>{
	let user=req.body.username;
	let pass=req.body.password;
	let data=await db.collection("usuarios").findOne({"usuario":user});
	if(data==null){
		res.sendStatus(401);
	}else if(await argon2.verify(data.password, pass)){
		let rol=data.rol || "consumidor";
		let token=jwt.sign({"usuario":data.usuario, "rol":rol}, await process.env.LLAVEJWT, {expiresIn:1000})
		res.json({"token":token, "id":data.usuario, "rol":rol});
	}else{
		res.sendStatus(401);
	}
})

// Solo un admin puede cambiar el rol de alguien
app.put("/usuarios/:usuario/rol", autenticar("admin"), async (req, res)=>{
	let nuevoRol=req.body.rol;
	if(!ROLES_VALIDOS.includes(nuevoRol)){
		return res.sendStatus(400);
	}
	if(req.params.usuario==req.user.usuario){
		return res.sendStatus(400);   // un admin no se cambia su propio rol
	}
	let data=await db.collection("usuarios").updateOne({usuario:req.params.usuario}, {$set:{rol:nuevoRol}});
	if(data.matchedCount==0){
		return res.sendStatus(404);
	}
	await log(req.user.usuario, "cambiar rol a "+nuevoRol, "/usuarios/"+req.params.usuario);
	res.sendStatus(200);
})

/*const options = {
      key: fs.readFileSync('server.key'),
      cert: fs.readFileSync('server.crt')
};

https.createServer(options, app).listen(3000, async () => {
		await process.loadEnvFile(".env");
		await connectToDB();
      	console.log('HTTPS Server running on port 3000');
});*/


app.listen(PORT,async ()=>{
	await process.loadEnvFile(".env")
	await connectToDB();
	console.log("aplicacion iniciada en puerto 3000")
});