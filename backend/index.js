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
const ROLES_VALIDOS=["consumidor","comercio","admin"]; // Implementación de IA
const ESTADOS_POSTULACION=["enviada","aceptada","rechazada"];   // Implementación de IA
const RFC_REGEX=/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;   // 3-4 letras + fecha AAMMDD + homoclave, Implementación de IA
app.use(cors());
app.use(bodyParser.json());

async function connectToDB(){
	let client=new MongoClient(process.env.DB);
	await client.connect();	
	db=client.db();
	console.log("conectado a la base de datos");
}


async function crearAdminInicial(){
	const existe=await db.collection("usuarios").findOne({usuario:process.env.ADMIN_USER});
	if(existe==null){
		await db.collection("usuarios").insertOne({
			usuario:process.env.ADMIN_USER,
			password:await hashear(process.env.ADMIN_PASSWORD),
			rol:"admin"
		});
	}
}

async function log(sujeto, accion, objeto){
	const nuevoLog={};	// Implementación de IA
	nuevoLog["timestamp"]=new Date();
	nuevoLog["sujeto"]=sujeto;
	nuevoLog["accion"]=accion;
	nuevoLog["objeto"]=objeto;
	await db.collection("log").insertOne(nuevoLog);
}



// Implementación de IA
function hashear(pass){
	return argon2.hash(pass, {type:argon2.argon2id, memoryCost:64*1024, timeCost:3, parallelism:1, saltLength:128});
}

// Implementación de IA
function esTexto(v){
	return typeof v==="string" && v.trim()!=="";
}

// Implementación de IA
async function siguienteId(coleccion){
	const ultimo=await db.collection(coleccion).find().sort({id:-1}).limit(1).toArray();
	return ultimo.length ? ultimo[0].id+1 : 1;
}


// Implementación de IA
function filtroDesdeQuery(query, permitidos){
	const filtro={};
	for(let i=0; i<permitidos.length; i++){
		const campo=permitidos[i];
		const v=query[campo];
		if(typeof v!=="string" || v==="") continue;
		filtro[campo]=isNaN(v) ? v : Number(v);
	}
	return filtro;
}


// Implementación de IA
function autenticar(rolesPermitidos){
	return (req, res, next)=>{
		try{
			const token=jwt.verify(req.get("Authentication"), process.env.LLAVEJWT);
			if(!rolesPermitidos.includes(token.rol)){
				return res.sendStatus(403);
			}
			req.user=token;   
			next();
		}catch{
			res.sendStatus(401);
		}
	};
}

// Implementación de IA
function filtroPorRol(req){
	return req.user.rol=="comercio" ? {owner:req.user.usuario} : {};
}



async function getList(coleccion, req, res, filtro, permitidos){
	const consulta=Object.assign({}, filtroDesdeQuery(req.query, permitidos), filtro);   
	const sorter={};
	sorter[req.query._sort]=req.query._order=="ASC"?1:-1;
	const inicio=Number(req.query._start);
	const fin=Number(req.query._end);
	let data=await db.collection(coleccion).find(consulta).sort(sorter).project({_id:0}).toArray();	// Implementación de IA
	res.set("Access-Control-Expose-Headers", "X-Total-Count");
	res.set("X-Total-Count", data.length);
	res.json(data.slice(inicio, fin));
}

async function getMany(coleccion, req, res, filtro){	// Implementación de IA
	const ids=[].concat(req.query.id).map(Number);
	const consulta=Object.assign({}, filtro);
	consulta.id={$in:ids};	// Implementación de IA
	const data=await db.collection(coleccion).find(consulta).project({_id:0}).toArray();
	res.json(data);
}

async function getOne(coleccion, filtro, res){
	const data=await db.collection(coleccion).find(filtro).project({_id:0}).toArray();
	if(data.length==0) return res.sendStatus(404);
	res.json(data[0]);
}

async function createData(coleccion, valores, res){
	await db.collection(coleccion).insertOne(valores);
	delete valores._id;
	res.status(201).json(valores);
}

async function updateData(coleccion, req, res, filtro, extra){	// Implementación de IA
	const valores=Object.assign({}, req.body);
	delete valores._id;
	delete valores.owner;            
	const id=Number(req.params.id);
	Object.assign(valores, extra);
	valores.id=id;
	const consulta=Object.assign({}, filtro);
	consulta.id=id;
	const r=await db.collection(coleccion).updateOne(consulta, {$set:valores});
	if(r.matchedCount==0) return res.sendStatus(404);
	const data=await db.collection(coleccion).find({id:id}).project({_id:0}).toArray();
	res.json(data[0]);
}

async function deleteOne(coleccion, filtro, res){
	const data=await db.collection(coleccion).find(filtro).project({_id:0}).toArray();
	if(data.length==0) return res.sendStatus(404);
	await db.collection(coleccion).deleteOne(filtro);	// Implementación de IA
	res.json(data[0]);
}


// Implementación de IA
function listar(coleccion, recurso, permitidos, soloPropios){
	return async (req, res)=>{
		await log(req.user.usuario, "consultar datos", "/"+recurso);
		const filtro=soloPropios ? filtroPorRol(req) : {};
		if("id" in req.query){
			await getMany(coleccion, req, res, filtro);
		}else{
			await getList(coleccion, req, res, filtro, permitidos);
		}
	};
}



app.get("/Productos", autenticar(["admin","comercio","consumidor"]), listar("productos", "Productos", ["comercioId"], true));

app.get("/Productos/:id", autenticar(["admin","comercio","consumidor"]), async (req, res)=>{
	const filtro=filtroPorRol(req);
	filtro.id=Number(req.params.id);
	await getOne("productos", filtro, res);
});

app.post("/Productos", autenticar(["admin","comercio"]), async (req, res)=>{
	const valores=Object.assign({}, req.body);
	delete valores._id;
	valores.id=await siguienteId("productos");
	let comercio;
	if(req.user.rol=="admin"){
		comercio=await db.collection("comercios").findOne({id:Number(valores.comercioId)});   
	}else{
		comercio=await db.collection("comercios").findOne({owner:req.user.usuario});          
	}
	if(!comercio) return res.sendStatus(400);
	valores.comercioId=comercio.id;
	valores.owner=comercio.owner;    
	await createData("productos", valores, res);
});

app.put("/Productos/:id", autenticar(["admin","comercio"]), async (req, res)=>{
	let extra={};
	if(req.user.rol=="admin" && req.body.comercioId!==undefined){
		const comercio=await db.collection("comercios").findOne({id:Number(req.body.comercioId)});
		if(!comercio) return res.sendStatus(400);
		extra={comercioId:comercio.id, owner:comercio.owner};
	}else{
		delete req.body.comercioId;  
	}
	await updateData("productos", req, res, filtroPorRol(req), extra);
});

app.delete("/Productos/:id", autenticar(["admin","comercio"]), async (req, res)=>{
	const filtro=filtroPorRol(req);
	filtro.id=Number(req.params.id);
	await deleteOne("productos", filtro, res);
});



app.get("/Comercios", autenticar(["admin","comercio","consumidor"]), listar("comercios", "Comercios", ["categoria","owner"], false));

app.get("/Comercios/:id", autenticar(["admin","comercio","consumidor"]), async (req, res)=>{
	await getOne("comercios", {id:Number(req.params.id)}, res);
});

app.put("/Comercios/:id", autenticar(["admin","comercio"]), async (req, res)=>{
	await updateData("comercios", req, res, filtroPorRol(req), {});
});

app.delete("/Comercios/:id", autenticar(["admin"]), async (req, res)=>{
	const id=Number(req.params.id);
	const comercio=await db.collection("comercios").findOne({id:id});
	if(!comercio) return res.sendStatus(404);
	await db.collection("productos").deleteMany({comercioId:id});
	const vacantes=await db.collection("vacantes").find({comercioId:id}).toArray();   // Implementación de IA
	await db.collection("postulaciones").deleteMany({vacanteId:{$in:vacantes.map(v=>v.id)}});
	await db.collection("vacantes").deleteMany({comercioId:id});   
	await deleteOne("comercios", {id:id}, res);
});



// Implementación de IA
// Vacantes: todos las leen, el comercio solo ve y toca las suyas, el admin solo las ve y las borra
app.get("/Vacantes", autenticar(["admin","comercio","consumidor"]), listar("vacantes", "Vacantes", ["comercioId"], true));

app.get("/Vacantes/:id", autenticar(["admin","comercio","consumidor"]), async (req, res)=>{
	const filtro=filtroPorRol(req);
	filtro.id=Number(req.params.id);
	await getOne("vacantes", filtro, res);
});

// Solo los comercios publican vacantes
app.post("/Vacantes", autenticar(["comercio"]), async (req, res)=>{
	const valores=Object.assign({}, req.body);
	delete valores._id;
	valores.id=await siguienteId("vacantes");
	const comercio=await db.collection("comercios").findOne({owner:req.user.usuario});
	if(!comercio) return res.sendStatus(400);
	valores.comercioId=comercio.id;
	valores.owner=comercio.owner;
	valores.empresa=comercio.nombre;   // la empresa sale del comercio, no se escribe a mano
	valores.fecha=new Date();
	await createData("vacantes", valores, res);
});

// Solo el comercio dueño edita su vacante (el admin solo puede verla y borrarla)
app.put("/Vacantes/:id", autenticar(["comercio"]), async (req, res)=>{
	delete req.body.empresa;
	delete req.body.fecha;
	delete req.body.comercioId;   // una vacante no cambia de comercio
	await updateData("vacantes", req, res, filtroPorRol(req), {});
});

app.delete("/Vacantes/:id", autenticar(["admin","comercio"]), async (req, res)=>{
	const filtro=filtroPorRol(req);
	filtro.id=Number(req.params.id);
	const vacante=await db.collection("vacantes").findOne(filtro);
	if(!vacante) return res.sendStatus(404);
	await db.collection("postulaciones").deleteMany({vacanteId:vacante.id});   // se van sus postulaciones
	await deleteOne("vacantes", filtro, res);
});

// Implementación de IA
// Postulaciones: consumidor solo las suyas / comercio solo las de sus vacantes / admin todas
function filtroPostulaciones(req){
	if(req.user.rol=="comercio") return {owner:req.user.usuario};
	if(req.user.rol=="consumidor") return {usuario:req.user.usuario};
	return {};
}

app.get("/Postulaciones", autenticar(["admin","comercio","consumidor"]), async (req, res)=>{
	await log(req.user.usuario, "consultar datos", "/Postulaciones");
	const filtro=filtroPostulaciones(req);
	if("id" in req.query){
		await getMany("postulaciones", req, res, filtro);
	}else{
		await getList("postulaciones", req, res, filtro, ["vacanteId","estado"]);
	}
});

app.get("/Postulaciones/:id", autenticar(["admin","comercio","consumidor"]), async (req, res)=>{
	const filtro=filtroPostulaciones(req);
	filtro.id=Number(req.params.id);
	await getOne("postulaciones", filtro, res);
});

// El boton "Postularme" solo manda vacanteId; todo lo demas lo pone el servidor
app.post("/Postulaciones", autenticar(["consumidor"]), async (req, res)=>{
	const vacante=await db.collection("vacantes").findOne({id:Number(req.body.vacanteId)});
	if(!vacante) return res.sendStatus(404);
	const repetida=await db.collection("postulaciones").findOne({vacanteId:vacante.id, usuario:req.user.usuario});
	if(repetida!=null) return res.sendStatus(409);   // una sola postulacion por vacante
	const valores={
		id:await siguienteId("postulaciones"),
		vacanteId:vacante.id,
		vacante:vacante.titulo,       // para que el comercio vea a que vacante se postularon
		usuario:req.user.usuario,     // sale del token, no del body
		owner:vacante.owner,          // sale de la vacante, no del body
		estado:"enviada"
	};
	await log(req.user.usuario, "postularse", "/Vacantes/"+vacante.id);
	await createData("postulaciones", valores, res);
});

// El comercio (o el admin) solo puede cambiar el estado
app.put("/Postulaciones/:id", autenticar(["admin","comercio"]), async (req, res)=>{
	const estado=req.body.estado;
	if(!ESTADOS_POSTULACION.includes(estado)) return res.sendStatus(400);
	const filtro=filtroPostulaciones(req);
	filtro.id=Number(req.params.id);
	const r=await db.collection("postulaciones").updateOne(filtro, {$set:{estado:estado}});
	if(r.matchedCount==0) return res.sendStatus(404);
	await log(req.user.usuario, "postulacion "+estado, "/Postulaciones/"+filtro.id);
	await getOne("postulaciones", {id:filtro.id}, res);
});

app.delete("/Postulaciones/:id", autenticar(["admin"]), async (req, res)=>{
	await deleteOne("postulaciones", {id:Number(req.params.id)}, res);
});



app.post("/registrarse", async (req, res)=>{
	const user=req.body.username;
	const pass=req.body.password;
	const name=req.body.name;
	const email=req.body.email;
	if(!esTexto(user) || !esTexto(pass) || !esTexto(name) || !esTexto(email)) return res.sendStatus(400);
	const existente=await db.collection("usuarios").findOne({usuario:user});
	if(existente!=null) return res.sendStatus(403);
	await db.collection("usuarios").insertOne({usuario:user, nombre: name, correo: email, password:await hashear(pass), rol:"consumidor"});
	res.sendStatus(201);
});

// Implementación de IA
app.post("/registrarse-comercio", async (req, res)=>{
	const b=req.body;
	if(!esTexto(b.username) || !esTexto(b.password) || !esTexto(b.empresa) || !esTexto(b.rfc) || !esTexto(b.ubicacion)){
		return res.sendStatus(400);
	}
	const rfc=b.rfc.toUpperCase().trim();
	if(!RFC_REGEX.test(rfc)) return res.sendStatus(400);
	const existente=await db.collection("usuarios").findOne({usuario:b.username});
	if(existente!=null) return res.sendStatus(403);
	const repetida=await db.collection("solicitudes").findOne({rfc:rfc, estado:{$in:["pendiente","aprobada"]}});
	if(repetida!=null) return res.sendStatus(409);
	
	await db.collection("usuarios").insertOne({usuario:b.username, password:await hashear(b.password), rol:"consumidor"});

	await db.collection("solicitudes").insertOne({
		id:await siguienteId("solicitudes"),
		usuario:b.username,
		empresa:b.empresa.trim(),
		rfc:rfc,                         
		ubicacion:b.ubicacion.trim(),
		categoria:typeof b.categoria==="string" ? b.categoria : "",
		sitioweb:typeof b.sitioweb==="string" ? b.sitioweb : "",
		estado:"pendiente",
		fecha:new Date()
	});
	res.sendStatus(201);
});

app.post("/login", async (req, res)=>{
	const user=req.body.username;
	const pass=req.body.password;
	if(!esTexto(user) || !esTexto(pass)) return res.sendStatus(400);
	const data=await db.collection("usuarios").findOne({usuario:user});
	if(data==null){
		res.sendStatus(401);
	}else if(await argon2.verify(data.password, pass)){
		const rol=data.rol || "consumidor";
		const token=jwt.sign({usuario:data.usuario, rol:rol}, process.env.LLAVEJWT, {expiresIn:1000});
		res.json({token:token, id:data.usuario, rol:rol});
	}else{
		res.sendStatus(401);
	}
});

// Implementación de IA
app.get("/Solicitudes", autenticar(["admin"]), listar("solicitudes", "Solicitudes", ["estado","usuario"], false));


// Implementación de IA
app.put("/Solicitudes/:id", autenticar(["admin"]), async (req, res)=>{
	const decision=req.body.estado;
	if(decision!=="aprobada" && decision!=="rechazada") return res.sendStatus(400);
	const sol=await db.collection("solicitudes").findOne({id:Number(req.params.id), estado:"pendiente"});
	if(!sol) return res.sendStatus(404);
	if(decision=="aprobada"){
		await db.collection("usuarios").updateOne({usuario:sol.usuario}, {$set:{rol:"comercio"}});
		await db.collection("comercios").insertOne({
			id:await siguienteId("comercios"),
			nombre:sol.empresa,
			categoria:sol.categoria,
			sitioweb:sol.sitioweb,
			ubicacion:sol.ubicacion,
			owner:sol.usuario            
		});
	}
	await db.collection("solicitudes").updateOne({id:sol.id}, {$set:{estado:decision}});
	await log(req.user.usuario, decision+" solicitud", "/Solicitudes/"+sol.id);
	const respuesta=Object.assign({}, sol, {estado:decision});
	delete respuesta._id;
	res.json(respuesta);
});


// Implementación de IA
app.put("/usuarios/:usuario/rol", autenticar(["admin"]), async (req, res)=>{
	const nuevoRol=req.body.rol;
	if(!ROLES_VALIDOS.includes(nuevoRol)){
		return res.sendStatus(400);
	}
	if(req.params.usuario==req.user.usuario){
		return res.sendStatus(400);   
	}
	const data=await db.collection("usuarios").updateOne({usuario:req.params.usuario}, {$set:{rol:nuevoRol}});
	if(data.matchedCount==0){
		return res.sendStatus(404);
	}
	await log(req.user.usuario, "cambiar rol a "+nuevoRol, "/usuarios/"+req.params.usuario);
	res.sendStatus(200);
});

/*const options = {
      key: fs.readFileSync('server.key'),
      cert: fs.readFileSync('server.crt')
};

https.createServer(options, app).listen(PORT, async () => {
		await process.loadEnvFile(".env");
		await connectToDB();
      	console.log('HTTPS Server running on port 3000');
});*/


app.listen(PORT,async ()=>{
	await process.loadEnvFile(".env")
	await connectToDB();
	await crearAdminInicial();
	console.log("aplicacion iniciada en puerto 3000")
});