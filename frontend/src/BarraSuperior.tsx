import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Registro = () => {
    // ...tu estado y handleSendData igual que antes...

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "grey.100" }}>
            {/* Barra superior */}
            <AppBar position="static" color="secondary">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Mi App de Productos
                    </Typography>
                    <Button color="inherit" component={Link} to="/login">
                        Iniciar sesión
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Formulario */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                {/* ...tu Card con los TextField y el botón... */}
            </Box>
        </Box>
    );
};