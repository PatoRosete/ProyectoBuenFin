import { List, Edit, SimpleForm, TextInput, SearchInput, SelectInput} from "react-admin";
import { Show } from "react-admin";
import { useListContext, useRecordContext, RecordContextProvider } from "react-admin";
import { Box } from "@mui/material";
import ComercioCard from "./ComercioCard";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Grid, Typography, Chip, Stack } from "@mui/material";
import { Button as MuiButton } from "@mui/material";

// Implementación de IA para show de comercios - prompt 58
const filtros = [
    <SearchInput key="q" source="q" alwaysOn />,
];

// Implementación de IA: redirige a la página de la tienda - prompt 59
const BotonVisitarTienda= (_props: { label?: string | false }) => {
    const record = useRecordContext();
    if (!record?.sitioweb) return null;            // si el producto no tiene link, no se muestra

    return (
        <MuiButton
            variant="contained"
            href={record.sitioweb} 
            target="_blank"                         // se abre en otra pestaña
            endIcon={<OpenInNewIcon />}
            aria-label={`Ver oferta en ${record.empresa} (se abre en una nueva pestaña)`}
        >
            Visitar tienda de {record.nombre}
        </MuiButton>
    );
};

const CuadriculaComercios = () => {
    const { data } = useListContext();   // los productos de la página actual
    if (!data) return null;

    return (
        <Box sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: 2,
            p: 2,
        }}>
            {data.map(comercio => (
                <RecordContextProvider key={comercio.id} value={comercio}>
                    <ComercioCard />
                </RecordContextProvider>
            ))}
        </Box>
    );
};

export const listarComercios = () => (
    <List filters={filtros}>
        <CuadriculaComercios />
    </List>
);

export const editarComercios = ()=>(
    <Edit>
        <SimpleForm>
            <TextInput disabled source = "id" label = 'ID'/>
            <TextInput source="nombre" />
            <TextInput source="categoria" />
            <TextInput source="sitioweb" />
            <TextInput source="imagen" />
            <TextInput source="ubicacion" />
            <TextInput source="descripcion" multiline />
        </SimpleForm>
    </Edit>
);

const DetalleComercio = () => {
    const c = useRecordContext();
    if (!c) return null;

    return (
        <Grid container spacing={4} sx={{ p: { xs: 2, md: 4 } }}>
            <Grid size={{ xs: 12, md: 6 }}>
                <Box
                    component="img"
                    src={c.imagen}
                    alt={c.nombre}
                    sx={{
                        width: "100%",
                        maxHeight: 450,
                        objectFit: c.imagen ? "cover" : "contain",
                        borderRadius: 3,
                        bgcolor: "background.default",
                    }}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={2}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
                        {c.nombre}
                    </Typography>

                    <Chip label={c.categoria} color="primary" variant="outlined" sx={{ alignSelf: "flex-start" }} />

                    {c.descripcion && <Typography>{c.descripcion}</Typography>}

                    {c.ubicacion && <Typography>📍{c.ubicacion}</Typography>}




                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <BotonVisitarTienda />
                    </Stack>
                </Stack>
            </Grid>
        </Grid>
    );
};

export const mostrarComercios = () => (
    <Show title="Detalle del comercio">
        <DetalleComercio />
    </Show>
);