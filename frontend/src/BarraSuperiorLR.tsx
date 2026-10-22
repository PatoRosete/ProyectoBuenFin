import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet"></link>

const BarraSuperior = () => (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="secondary">
        <Toolbar sx={{ minHeight: { xs: 72, sm: 96 } }}>

        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 2 }}>

        <Box component={Link} to="/inicio" sx={{ display: "flex" }}>
            <Box component="img" src="/logo.png" alt="Buen Fin, ir al inicio"
                 sx={{ height: { xs: 56, sm: 80 } }} />
        </Box>


        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            13 al 17 de noviembre
        </Typography>

        </Box>

        </Toolbar>
      </AppBar>
    </Box>
);



export default BarraSuperior;