import { useState } from "react";
import { Title } from "react-admin";
import { Card, CardContent, Typography, Button, Stack } from "@mui/material";
// Implementación de IA para menú de accesibilidad - prompt 51

// Implementación de IA: valores iniciales (fuera del componente para que no se pierdan al cambiar de página)
const inicial = { tamano: 100, contraste: false, grises: false };
let actuales = { ...inicial };

// Implementación de IA: menú de accesibilidad (Aumentar tamaño de letra)
export const Configuracion = () => {
    const [ajustes] = useState(actuales);

    const cambiar = (nuevo: Partial<typeof ajustes>) => {
        const a = { ...ajustes, ...nuevo };
        document.documentElement.style.fontSize = a.tamano + "%";
        setAjustes(a);
    };

    return (
        <Card sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
            <Title title="Accesibilidad" />
            <CardContent>
                <Stack spacing={3}>
                    <Typography variant="h5" component="h1" sx={{ fontWeight: "bold" }}>
                        Configuración de accesibilidad
                    </Typography>

                    <div>
                        <Typography sx={{ fontWeight: "bold", mb: 1 }}>Tamaño de letra: </Typography>
                        <Stack direction="row" spacing={1}>
                            <Button variant="outlined" onClick={() => cambiar({ tamano: Math.max(50, ajustes.tamano - 20) })} aria-label="Hacer la letra más pequeña">A-</Button>
                            <Button variant="outlined" onClick={() => cambiar({ tamano: 100 })} aria-label="Tamaño de letra normal">A</Button>
                            <Button variant="outlined" onClick={() => cambiar({ tamano: Math.min(3000, ajustes.tamano + 30) })} aria-label="Hacer la letra más grande">A+</Button>
                        </Stack>
                    </div>

                    <Button variant="contained" onClick={() => { cambiar(inicial);  }}>
                        Restablecer
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
};