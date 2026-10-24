import React, {useState, ChangeEvent} from "react";
import { Box, TextField, Button, Alert, Divider  } from "@mui/material";
import BarraSuperiorLR from "./BarraSuperiorLR";
import { useNotify} from 'react-admin';
import { useNavigate } from "react-router-dom";


// Prompt 14: Ayuda de IA para realizar sección de registro (diseño y funcionalidad)
const Registro: React.FC =()=>{

    const [datos, setDatos]=useState({name:"", lastname:"",
    email:"", username:"", password:""});

    const navigate = useNavigate();
    const notify = useNotify(); 

    const handleChange=(event: ChangeEvent<HTMLInputElement>)=>{setDatos({...datos, [event.target.name]:event.target.value })};

    const handleSendData=async ()=>{
        const request=new Request("https://localhost:3000/registrarse", {
            method:"POST",
            body:JSON.stringify(datos),
            headers: new Headers({"Content-type":"application/json"})
        })
        try{    // Implementación de IA para el manejo de errores - prompts 39 y 40
                // Implementación de IA para diseño de alerta - prompt 41
            const res=await fetch(request);
            if(res.status==403){
                notify(
                    <Alert severity="error" variant="filled"> 
                        Ese usuario ya existe
                    </Alert>
                );
                return;
            }
            if(res.status<200 || res.status>=300){
                throw new Error(res.statusText);
            }
            notify(
                <Alert severity="success" variant="outlined">
                    ¡Cuenta creada! Ya puedes iniciar sesión
                </Alert>
            );
            navigate("/Inicio");    // Implementación de IA - prompt 38
        }catch{
            notify(
                <Alert severity="error" variant="filled">
                    No se pudo crear la cuenta. Intenta de nuevo.
                </Alert>
            );
        }
    };
    return( // Diseño humano y explicación de IA - prompts 14, 15 y 36 (líneas de división)

    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <BarraSuperiorLR />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, bgcolor: "background.paper", 
            boxShadow: 4, borderRadius: 3, p: 7, width: 900, mt: 5, mb:7, ml:31, mr:36, py: { xs: 2, sm: 3 }, }}>
            
            <Box sx={{ color: "text.primary", fontSize: 25, fontWeight: "bold", textAlign: "center"}}>
                Regístrate
            </Box>

            <Divider />

            <Box sx={{ color: "text.primary"}}>
                Para registrarte, ingresa tu información en los siguientes campos. Los campos marcados con asterisco * son obligatorios.
            </Box>

            <Box sx={{ color: "text.primary", fontWeight: "bold"}}>
                Nombre(s):
            </Box>

            <TextField variant="outlined" required id="name" label="Ingresa tu nombre" name="name" value={datos.name} onChange={handleChange} />

            <Box sx={{ color: "text.primary", fontWeight: "bold"}}>
                Apellidos:
            </Box>

            <TextField variant="outlined" required id="lastname" label="Ingresa tus apellidos" name="lastname" value={datos.lastname} onChange={handleChange} />

            <Box sx={{ color: "text.primary", fontWeight: "bold"}}>
                Correo electrónico:
            </Box>

            <TextField variant="outlined" required id="email" label="Ingresa tu correo electrónico" name="email" value={datos.email} onChange={handleChange} />

            <Box sx={{ color: "text.primary", fontWeight: "bold"}}>
                Nombre de usuario:
            </Box>

            <TextField variant="outlined" required id="username" label="Ingresa tu nombre de usuario" name="username" value={datos.username} onChange={handleChange} />

            <Box sx={{ color: "text.primary", fontWeight: "bold"}}>
                Contraseña:
            </Box>
            <TextField variant="outlined" required type="password" id="password" label="Ingresa tu contraseña" name="password" value={datos.password} onChange={handleChange} />
            
            <Button variant="contained" onClick={handleSendData} >
                Crear cuenta 
            </Button>


        </Box>

        </Box>


    )
};

export default Registro;