import {useState, ChangeEvent} from "react";
import { Link } from "react-router-dom";
import { useLogin, useNotify} from 'react-admin';
import { Box, TextField, Button, Divider } from "@mui/material";
import BarraSuperiorLR from "./BarraSuperiorLR";

// Implementacón de IA para la funcionalidad antes del return de login - prompt 21 y 31
export const MyLoginPage = () => {
    const [datos, setDatos]=useState({username:"", password:""});

    const handleChange=(event: ChangeEvent<HTMLInputElement>)=>{setDatos({...datos, [event.target.name]:event.target.value })};

    const login = useLogin();
    const notify = useNotify();

    const handleSendData = async () => {
        try {
            await login(datos);   // llama a authProvider.login con {username, password}
        } catch {
            notify("Usuario o contraseña incorrectos", { type: "error" });
        }
    };


    return (    // Implementación de IA para diseño de login - prompt 32

        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <BarraSuperiorLR />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, bgcolor: "background.paper", 
            boxShadow: 4, borderRadius: 3, p: 7, width: 900, mt: 5, mb:7, ml:31, mr:36, py: { xs: 2, sm: 3 }, }}>
            
            <Box sx={{ color: "text.primary", fontSize: 30, fontWeight: "bold", textAlign: "center"}}>
                Bienvenido al Buen Fin
            </Box>

            <Divider />

            <Box sx={{ color: "text.primary"}}>
                Encuentra las mejores ofertas del Buen Fin.
            </Box>

            <Box sx={{ color: "text.primary", fontWeight: "bold"}}>
                Usuario:
            </Box>

            <TextField variant="outlined" id="username" label="Usuario" name="username" value={datos.username} onChange={handleChange} />

            <Box sx={{ color: "text.primary", fontWeight: "bold"}}>
                Contraseña:
            </Box>
            <TextField variant="outlined" type="password" label="Contraseña" id="password" name="password" value={datos.password}  onChange={handleChange}/>

            
            <Button variant="contained" onClick={handleSendData}>
                Iniciar Sesión
            </Button>


            <Divider sx={{ color: "text.primary" }}>
                ¿Aún no tienes cuenta?
            </Divider>

            <Button variant="outlined" component={Link} to="/registrarse" >
                Crear una cuenta
            </Button>

            <Box sx={{ color: "text.primary", textAlign: "center"}}>
                ¿Eres empresa? Regístrala aquí
            </Box>

            <Button variant="outlined" component={Link} to="/registrarse-comercio" >
                Registro de comercio
            </Button>


        </Box>

        </Box>
        
    )
};


export default MyLoginPage;
