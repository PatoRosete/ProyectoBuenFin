import React, {useState, ChangeEvent} from "react";
import { Box, Card, Typography, TextField, Button, Alert, Divider  } from "@mui/material";
import { Link } from "react-router-dom";
import BarraSuperiorLR from "./BarraSuperiorLR";
import { useNotify} from 'react-admin';
import { useNavigate } from "react-router-dom";

const Registro: React.FC =()=>{

    const [datos, setDatos]=useState({name:"", lastname:"",
    telefono:"", puesto:"", email:"", username:"", password:"", confirmacion:""});

    const navigate = useNavigate();
    const notify = useNotify(); 

    const handleChange=(event: ChangeEvent<HTMLInputElement>)=>{setDatos({...datos, [event.target.name]:event.target.value })};

    const handleSendData=async ()=>{
        const request=new Request("http://localhost:3000/registrarse", {
            method:"POST",
            body:JSON.stringify(datos),
            headers: new Headers({"Content-type":"application/json"})
        })
        try{
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
            navigate("/Inicio");
        }catch{
            notify(
                <Alert severity="error" variant="filled">
                    No se pudo crear la cuenta. Intenta de nuevo.
                </Alert>
            );
        }
    };
    return(

    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <BarraSuperiorLR />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, bgcolor: "background.paper", 
            boxShadow: 4, borderRadius: 3, p: 7, width: 900, mt: 5, mb:7, ml:31, mr:36, py: { xs: 2, sm: 3 }, }}>
            
            <Box sx={{ color: "primary.contrastText", fontSize: 25, fontWeight: "bold", textAlign: "center"}}>
                Regístrate
            </Box>

            <Divider />

            <Box sx={{ color: "primary.contrastText"}}>
                Para registrarte, ingresa tu información en los siguientes campos. Los campos marcados con asterisco * son obligatorios.
            </Box>

            <Box sx={{ color: "primary.contrastText", fontWeight: "bold"}}>
                Nombre(s):
            </Box>

            <TextField variant="outlined" id="name" label="Ingresa tu nombre" name="name" value={datos.name} onChange={handleChange} />

            <Box sx={{ color: "primary.contrastText", fontWeight: "bold"}}>
                Apellidos:
            </Box>

            <TextField variant="outlined" id="lastname" label="Ingresa tus apellidos" name="lastname" value={datos.lastname} onChange={handleChange} />

            <Box sx={{ color: "primary.contrastText", fontWeight: "bold"}}>
                Teléfono:
            </Box>

            <TextField variant="outlined" id="telefono" label="Ingresa tu número de teléfono" name="telefono" value={datos.telefono} onChange={handleChange} />

            <Box sx={{ color: "primary.contrastText", fontWeight: "bold"}}>
                Puesto:
            </Box>

            <TextField variant="outlined" id="puesto" label="Ingresa tu puesto" name="puesto" value={datos.puesto} onChange={handleChange} />

            <Box sx={{ color: "primary.contrastText", fontWeight: "bold"}}>
                Correo electrónico:
            </Box>

            <TextField variant="outlined" id="email" label="Ingresa tu correo electrónico" name="email" value={datos.email} onChange={handleChange} />

            <Box sx={{ color: "primary.contrastText", fontWeight: "bold"}}>
                Nombre de usuario:
            </Box>

            <TextField variant="outlined" id="username" label="Ingresa tu nombre de usuario" name="username" value={datos.username} onChange={handleChange} />

            <Box sx={{ color: "primary.contrastText", fontWeight: "bold"}}>
                Contraseña:
            </Box>
            <TextField variant="outlined" type="password" id="password" label="Ingresa tu contraseña" name="password" value={datos.password} onChange={handleChange} />
            
            <Button variant="contained" onClick={handleSendData} >
                Crear cuenta 
            </Button>


            <Box sx={{ color: "primary.contrastText", fontSize: 13}}>
                Al momento de registrarte para el uso de marca de “El Buen Fin”, 
                también se procesará tu inscripción al Sorteo SAT en el marco de “El Buen Fin” 
                para que las compras realizadas en tu negocio participen en el sorteo.
            </Box>


        </Box>

        </Box>


    )
};

export default Registro;