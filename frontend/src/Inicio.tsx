import { Link } from "react-router-dom";
import { Box, Typography, Button, Stack, Container, Grid } from "@mui/material";
import { alpha } from "@mui/material/styles";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BarraSuperior from "./BarraSuperior";

const beneficios = [
    {
        icono: <TouchAppIcon sx={{ fontSize: 56 }} />,
        titulo: "Forma parte de El Buen Fin",
        texto: (
            <>
                Impulsa las ventas de tu comercio durante el fin de semana más dinámico para el
                mercado doméstico mexicano. Regístrate a partir del 8 de septiembre de 2026,{" "}
                <strong>es totalmente gratuito</strong>.
            </>
        ),
    },
    {
        icono: <ConfirmationNumberIcon sx={{ fontSize: 56 }} />,
        titulo: "Gana con el Sorteo El Buen Fin",
        texto: (
            <>
                Aprovecha los premios que el Servicio de Administración Tributaria ofrece a los
                comercios participantes. <strong>Hay $100,000,000 pesos en premios</strong>.
            </>
        ),
    },
    {
        icono: <TrendingUpIcon sx={{ fontSize: 56 }} />,
        titulo: "Haz crecer tu comercio",
        texto: (
            <>
                Utiliza las herramientas gratuitas y de dominio público que el programa MIPYMES MX
                de la Secretaría de Economía ha preparado para ti.
            </>
        ),
    },
];

const Inicio = () => (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <BarraSuperior />

        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
            <Grid container spacing={{ xs: 4, md: 6 }} sx={{ alignItems: "center" }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={3}>
                        <Typography variant="h3" component="h1" sx={{ fontWeight: "bold" }}>
                            Catálogo de ofertas del Buen Fin
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: "normal" }}>
                            Encuentra los descuentos de los comercios participantes
                        </Typography>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <Button variant="contained" size="large" component={Link} to="/login">
                                Iniciar sesión
                            </Button>
                            <Button variant="outlined" size="large" component={Link} to="/registrarse">
                                Crear cuenta
                            </Button>
                        </Stack>
                    </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Box
                        component="img" src="/BuenFin.png"
                        aria-label="Imagen de El Buen Fin"
                        sx={{
                            width: "100%",
                            minHeight: { xs: 240, md: 380 },
                            borderRadius: 3,
                            boxShadow: 4,
                            bgcolor: "primary.light",
                            backgroundImage: "url(/BuenFin.png)",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    />
                </Grid>
            </Grid>
        </Container>

        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: "bold", mb: 2 }}>
                Acerca de El Buen Fin
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 820 }}>
                El Programa “El Buen Fin” surge de una{" "}
                <strong>iniciativa de colaboración público-privada</strong>, con el{" "}
                <strong>
                    objetivo de apoyar la economía familiar, incentivar la actividad del mercado
                    interno y acrecentar el comercio formal
                </strong>
                , así como garantizar el respeto a los derechos del consumidor.
            </Typography>
        </Container>

        <Box sx={{ bgcolor: (tema) => alpha(tema.palette.primary.main, 0.06), py: { xs: 5, md: 8 } }}>
            <Container maxWidth="lg">
                <Typography variant="h4" component="h2" sx={{ fontWeight: "bold", mb: 4 }}>
                    Comercios
                </Typography>

                <Grid container spacing={4}>
                    {beneficios.map((b) => (
                        <Grid key={b.titulo} size={{ xs: 12, md: 4 }}>
                            <Stack spacing={2}>
                                <Box sx={{ color: "primary.main", display: "flex" }}>{b.icono}</Box>
                                <Typography variant="h6" component="h3" sx={{ fontWeight: "bold" }}>
                                    {b.titulo}
                                </Typography>
                                <Typography variant="body1">{b.texto}</Typography>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ mt: 5 }}>
                    <Button variant="contained" size="large" component={Link} to="/registrarse-comercio">
                        Registra tu comercio
                    </Button>
                </Box>
            </Container>
        </Box>
    </Box>
);

export default Inicio;