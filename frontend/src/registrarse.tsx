import React, {useState, ChangeEvent} from "react";
import { Box, Card, Typography, TextField, Button, Alert } from "@mui/material";    // Implementación de IA

const Registro: React.FC =()=>{

    const [datos, setDatos]=useState({username:"", password:""});

    const handleChange=(event: ChangeEvent<HTMLInputElement>)=>{setDatos({...datos, [event.target.name]:event.target.value })};

    const handleSendData=async ()=>{
        const request=new Request("http://localhost:3000/registrarse", {
            method:"POST",
            body:JSON.stringify(datos),
            headers: new Headers({"Content-type":"application/json"})
        })
        try{
            const res=await fetch(request);
            if(res.status<200 || res.status>=300){
                throw new Error(res.statusText);
            }
        }catch{
            throw new Error("No se pudo crear el usuario")
        }
    };
    return(
        

    <Box sx={{ bgcolor: "background.paper", boxShadow: 4, borderRadius: 3, p: 20, width: 800, mt: 10, mb:7, ml:10, mr:30 }}>
        <Box sx={{ color: "primary.contrastText", fontSize: 30 }}>Ventas de la semana</Box>
        <Box sx={{ color: "primary.contrastText", fontSize: 34, fontWeight: "bold" }}>98.3 K</Box>
        <Box sx={{ color: "primary.contrastText", fontWeight: "bold", display: "inline" }}>+18.77%</Box>
        <Box sx={{ color: "primary.contrastText", display: "inline", ml: 1 }}>vs. semana pasada</Box>
    </Box>
    
        /*<div> 
            <h2>Registro de usuarios</h2>
            <div>
                <label>Usuario: </label>

                <TextField variant="outlined" id="username" name="username" value={datos.username} onChange={handleChange}/>

            </div>
            <div>
                <label>Password: </label>
                <TextField variant="outlined" type="password" id="password" name="password" value={datos.password}  onChange={handleChange}/>
            </div>
            <div>
                <button type="button" onClick={handleSendData}>
                    Crear usuario
                </button>
            </div>
        </div>*/
    )
};

export default Registro;