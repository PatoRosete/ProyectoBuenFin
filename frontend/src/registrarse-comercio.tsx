import React, {useState, ChangeEvent} from "react";
import { Box, Card, Typography, TextField, Button, Alert, Divider, MenuItem  } from "@mui/material";
import { Link } from "react-router-dom";
import BarraSuperiorLR from "./BarraSuperiorLR";
import { useNotify} from 'react-admin';
import { useNavigate } from "react-router-dom";
const SECTORES = ["Tecnología","Electrodomésticos","Línea blanca","Moda y calzado","Muebles","Autoservicio","Artículos para el hogar", "Otro"];
const RegistroComercio: React.FC =()=>{

    const [datos, setDatos]=useState({name:"", telephone:"", puesto: "",
    email:"", empresa: "", rfc: "", ubicacion: "", categoria: "", sitioweb: "", username:"", password:"", descripcion:""});

    const navigate = useNavigate();
    const notify = useNotify(); 

    const handleChange=(event: ChangeEvent<HTMLInputElement>)=>{setDatos({...datos, [event.target.name]:event.target.value })};

    const handleSendData=async ()=>{
        const request=new Request("https://localhost:3000/registrarse-comercio", {
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
                    Tu solicitud ha sido enviada.
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
            
            <Box sx={{ color: "text.primary", fontSize: 25, fontWeight: "bold", textAlign: "center"}}>
                Registra tu empresa
            </Box>

            <Divider />

            <Box sx={{ color: "text.primary"}}>
                Para registrar tu empresa, ingresa la información en los siguientes campos. Los campos marcados con asterisco * son obligatorios.
            </Box>

            <Box sx={{ color: "text.primary", fontWeight: "bold"}}>
                Nombre completo del responsable:
            </Box>

            
            <TextField variant="outlined" required id="name" label="Ingresa nombre del responsable" name="name" value={datos.name} onChange={handleChange} />

            <Box sx={{ color: "text.primary", fontWeight: "bold"}}>
                Teléfono:
            </Box>


            <TextField variant="outlined" required id="telephone" label="Ingresa tu número de teléfono" name="telephone" value={datos.telephone} onChange={handleChange} />

            <Box sx={{ color: "text.primary", fontWeight: "bold"}}>
                Correo electrónico:
            </Box>

            <TextField variant="outlined" required id="email" label="Ingresa tu correo electrónico" name="email" value={datos.email} onChange={handleChange} />

            <Box sx={{ color: "text.primary", fontWeight: "bold"}}>
                Puesto:
            </Box>

            <TextField variant="outlined" id="puesto" label="Ingresa tu puesto" name="puesto" value={datos.puesto} onChange={handleChange} />

            <Box sx={{ color: "text.primary", fontWeight: "bold"}}>
                Empresa:
            </Box>

            <TextField variant="outlined" required id="empresa" label="Ingresa el nombre de la empresa" name="empresa" value={datos.empresa} onChange={handleChange} />

            <Box sx={{ color: "text.primary", fontWeight: "bold"}}>
                RFC:
            </Box>

            <TextField variant="outlined" required id="rfc" label="Ingresa el RFC de la empresa" name="rfc" value={datos.rfc} onChange={handleChange} />

            <Box sx={{ color: "text.primary", fontWeight: "bold"}}>
                Ubicación:
            </Box>

            <TextField variant="outlined" required id="ubicacion" label="Ingresa la ubicación de la empresa" name="ubicacion" value={datos.ubicacion} onChange={handleChange} />

            <Box sx={{ color: "text.primary", fontWeight: "bold"}}>
                Sector:
            </Box>

            <TextField select variant="outlined" required id="categoria" label="Ingresa a qué sector pertenece la empresa" name="categoria" value={datos.categoria} onChange={handleChange}>
                {SECTORES.map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
            </TextField>

            <Box sx={{ color: "text.primary", fontWeight: "bold"}}>
                Descripción:
            </Box>

            <TextField multiline variant="outlined" required id="descripcion" label="Ingresa una breve descripción de tu empresa" name="descripcion" value={datos.descripcion} onChange={handleChange} />


            <Box sx={{ color: "text.primary", fontWeight: "bold"}}>
                Sitio Web:
            </Box>

            <TextField variant="outlined" required id="sitioweb" label="Ingresa el enlace al sitio web de la empresa" name="sitioweb" value={datos.sitioweb} onChange={handleChange} />

            <Box sx={{ color: "text.primary", fontWeight: "bold"}}>
                Nombre de usuario:
            </Box>

            <TextField variant="outlined" required id="username" label="Ingresa tu nombre de usuario" name="username" value={datos.username} onChange={handleChange} />

            <Box sx={{ color: "text.primary", fontWeight: "bold"}}>
                Contraseña:
            </Box>
            <TextField variant="outlined" required type="password" id="password" label="Ingresa tu contraseña" name="password" value={datos.password} onChange={handleChange} />
            
            <Button variant="contained" onClick={handleSendData} >
                Mandar solicitud 
            </Button>


            <Box sx={{ color: "text.primary", fontSize: 13}}>
                Tu solicitud será revisada por la Secretaría de Economía antes de activar tu cuenta de comercio.
            </Box>


        </Box>

        </Box>


    )
};

export default RegistroComercio;