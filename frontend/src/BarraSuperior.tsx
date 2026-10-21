import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const BarraSuperior = () => (
    <AppBar position="static" color="secondary">
        <Toolbar>
            <Typography
                variant="h6"
                component={Link}
                to="/inicio"
                sx={{ flexGrow: 1, color: "inherit", textDecoration: "none" }}
            >
                Buen Fin
            </Typography>
            <Button color="inherit" component={Link} to="/login">
                Iniciar sesión
            </Button>
            <Button color="inherit" component={Link} to="/registrarse">
                Registrarse
            </Button>
        </Toolbar>
    </AppBar>
);

export default BarraSuperior;