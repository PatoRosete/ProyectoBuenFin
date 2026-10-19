// Uso (desde la carpeta del backend, donde está tu .env):
//   node seed.js          -> inserta/actualiza los datos de prueba
//   node seed.js --reset  -> borra TODO en usuarios y productos y los vuelve a crear
const MongoClient = require("mongodb").MongoClient;
const argon2 = require("argon2");

process.loadEnvFile(".env");

// Mismos parámetros que usa /registrarse en index.js
const hashear = (pass) =>
	argon2.hash(pass, {
		type: argon2.argon2id,
		memoryCost: 64 * 1024,
		timeCost: 3,
		parallelism: 1,
		saltLength: 128,
	});

const USUARIOS = [
	{ usuario: "admin1",      password: "Admin123!",      rol: "admin" },
	{ usuario: "comercio1",   password: "Comercio123!",   rol: "comercio" },
	{ usuario: "comercio2",   password: "Comercio123!",   rol: "comercio" },
	{ usuario: "consumidor1", password: "Consumidor123!", rol: "consumidor" },
	{ usuario: "consumidor2", password: "Consumidor123!", rol: "consumidor" },
	{ usuario: "admin2",      password: "Admin123!",      rol: "admin" },
	{ usuario: "comercio3",   password: "Comercio123!",   rol: "comercio" },
	{ usuario: "comercio4",   password: "Comercio123!",   rol: "comercio" },
	{ usuario: "comercio5",   password: "Comercio123!",   rol: "comercio" },
	{ usuario: "consumidor3", password: "Consumidor123!", rol: "consumidor" },
	{ usuario: "consumidor4", password: "Consumidor123!", rol: "consumidor" },
];

// "owner" debe coincidir con el campo "usuario" del comercio dueño del producto
const PRODUCTOS = [
	// Productos de comercio1
	{ id: 1, nombre: "Laptop Gamer",      empresa: "TechStore",  owner: "comercio1" },
	{ id: 2, nombre: "Mouse Inalámbrico", empresa: "TechStore",  owner: "comercio1" },
	{ id: 3, nombre: "Teclado Mecánico",  empresa: "TechStore",  owner: "comercio1" },
	// Productos de comercio2
	{ id: 4, nombre: "Camisa de Algodón", empresa: "ModaMX",     owner: "comercio2" },
	{ id: 5, nombre: "Pantalón de Mezclilla", empresa: "ModaMX", owner: "comercio2" },
	{ id: 6, nombre: "Tenis Deportivos",  empresa: "ModaMX",     owner: "comercio2" },
	// Producto creado por el admin
	{ id: 7, nombre: "Producto del Admin", empresa: "Admin Corp", owner: "admin1" },

	// Más productos de comercio1 (TechStore)
	{ id: 8,  nombre: "Monitor 27 pulgadas",   empresa: "TechStore", owner: "comercio1" },
	{ id: 9,  nombre: "Audífonos Bluetooth",   empresa: "TechStore", owner: "comercio1" },
	{ id: 10, nombre: "Webcam HD",             empresa: "TechStore", owner: "comercio1" },
	{ id: 11, nombre: "Disco Duro Externo 1TB", empresa: "TechStore", owner: "comercio1" },

	// Más productos de comercio2 (ModaMX)
	{ id: 12, nombre: "Chamarra de Cuero",     empresa: "ModaMX", owner: "comercio2" },
	{ id: 13, nombre: "Gorra Deportiva",       empresa: "ModaMX", owner: "comercio2" },
	{ id: 14, nombre: "Vestido de Verano",     empresa: "ModaMX", owner: "comercio2" },

	// comercio3 (Abarrotes Don Pepe)
	{ id: 15, nombre: "Arroz 1kg",             empresa: "Abarrotes Don Pepe", owner: "comercio3" },
	{ id: 16, nombre: "Frijol Negro 1kg",      empresa: "Abarrotes Don Pepe", owner: "comercio3" },
	{ id: 17, nombre: "Aceite de Cocina 1L",   empresa: "Abarrotes Don Pepe", owner: "comercio3" },
	{ id: 18, nombre: "Azúcar 2kg",            empresa: "Abarrotes Don Pepe", owner: "comercio3" },
	{ id: 19, nombre: "Tortillas de Maíz 1kg", empresa: "Abarrotes Don Pepe", owner: "comercio3" },

	// comercio4 (Librería El Saber)
	{ id: 20, nombre: "Cien años de soledad",  empresa: "Librería El Saber", owner: "comercio4" },
	{ id: 21, nombre: "Cuaderno Profesional",  empresa: "Librería El Saber", owner: "comercio4" },
	{ id: 22, nombre: "Set de Plumas",         empresa: "Librería El Saber", owner: "comercio4" },
	{ id: 23, nombre: "Mochila Escolar",       empresa: "Librería El Saber", owner: "comercio4" },

	// comercio5 (Ferretería La Tuerca)
	{ id: 24, nombre: "Martillo",              empresa: "Ferretería La Tuerca", owner: "comercio5" },
	{ id: 25, nombre: "Taladro Eléctrico",     empresa: "Ferretería La Tuerca", owner: "comercio5" },
	{ id: 26, nombre: "Caja de Tornillos",     empresa: "Ferretería La Tuerca", owner: "comercio5" },
	{ id: 27, nombre: "Cinta Métrica 5m",      empresa: "Ferretería La Tuerca", owner: "comercio5" },

	// Más productos creados por admins
	{ id: 28, nombre: "Producto Promocional",  empresa: "Admin Corp", owner: "admin1" },
	{ id: 29, nombre: "Producto de Prueba",    empresa: "Admin Corp", owner: "admin2" },
	{ id: 30, nombre: "Producto Descontinuado", empresa: "Admin Corp", owner: "admin2" },
];

async function main() {
	const client = new MongoClient(process.env.DB);
	await client.connect();
	const db = client.db();

	if (process.argv.includes("--reset")) {
		await db.collection("usuarios").deleteMany({});
		await db.collection("productos").deleteMany({});
		console.log("Colecciones usuarios y productos vaciadas");
	}

	for (const u of USUARIOS) {
		await db.collection("usuarios").updateOne(
			{ usuario: u.usuario },
			{ $set: { usuario: u.usuario, password: await hashear(u.password), rol: u.rol } },
			{ upsert: true }
		);
		console.log(`usuario: ${u.usuario.padEnd(12)} rol: ${u.rol.padEnd(10)} password: ${u.password}`);
	}

	for (const p of PRODUCTOS) {
		await db.collection("productos").updateOne({ id: p.id }, { $set: p }, { upsert: true });
	}
	console.log(`${PRODUCTOS.length} productos listos`);

	await client.close();
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});