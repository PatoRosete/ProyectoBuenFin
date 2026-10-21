import { Link } from "react-router-dom";
import { Box, Typography, Button, Stack } from "@mui/material";
import BarraSuperior from "./BarraSuperior";

const Inicio = () => (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <BarraSuperior />

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center",
                   textAlign: "center", mt: 10, px: 2, gap: 3 }}>
            <Typography variant="h3">Catálogo de ofertas del Buen Fin</Typography>
            <Typography variant="body1" color="text.secondary">
                Encuentra los descuentos de los comercios participantes
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button variant="contained" component={Link} to="/login">
                    Iniciar sesión
                </Button>
                <Button variant="outlined" component={Link} to="/registrarse">
                    Crear cuenta
                </Button>
            </Stack>
        </Box>
    </Box>
);

export default Inicio;