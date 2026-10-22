import {Datagrid, List, Show, SimpleShowLayout, NumberInput, ImageField,TextField, ReferenceInput, Edit, SimpleForm, TextInput, Create, EditButton, DeleteButton, SelectInput, SearchInput, required} from "react-admin";
import { useListContext, useRecordContext, RecordContextProvider, usePermissions } from "react-admin";
import { Box } from "@mui/material";
import ProductoCard from "./ProductoCard";
import FavoritoButton from "./Favoritobutton";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Grid, Typography, Chip, Stack } from "@mui/material";
import { Button as MuiButton } from "@mui/material";

// Implementación de IA: redirige a la página de la oferta en la tienda (RF-12)
const BotonVerOferta = (_props: { label?: string | false }) => {
    const record = useRecordContext();
    if (!record?.urlOferta) return null;            // si el producto no tiene link, no se muestra

    return (
        <MuiButton
            variant="contained"
            href={record.urlOferta}
            target="_blank"                         // se abre en otra pestaña
            endIcon={<OpenInNewIcon />}
            aria-label={`Ver oferta en ${record.empresa} (se abre en una nueva pestaña)`}
        >
            Ver oferta en {record.empresa}
        </MuiButton>
    );
};

// Implementación de IA
// Categorias de los productos (las mismas para filtrar y para elegir al crear o editar)
export const CATEGORIAS = ["Tecnología","Electrodomésticos","Línea blanca","Moda y calzado","Muebles","Autoservicio","Artículos para el hogar"].map((c) => ({ id: c, name: c }));

// Implementación de IA
const filtros = [
    <SearchInput key="q" source="q" alwaysOn />,
    <SelectInput key="categoria" source="categoria" choices={CATEGORIAS} alwaysOn />,
];

const CuadriculaProductos = () => {
    const { data } = useListContext();   // los productos de la página actual
    if (!data) return null;

    return (
        <Box sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: 2,
            p: 2,
        }}>
            {data.map(producto => (
                <RecordContextProvider key={producto.id} value={producto}>
                    <ProductoCard />
                </RecordContextProvider>
            ))}
        </Box>
    );
};

export const listarProductos = () => (
    <List filters={filtros}>
        <CuadriculaProductos />
    </List>
);

export const editarProductos = ()=>{
        const { permissions } = usePermissions();
    return (
            <Edit>
        <SimpleForm>
            <TextInput source="nombre" />
            {permissions === "admin" && (
                <ReferenceInput source="comercioId" reference="Comercios">
                    <SelectInput optionText="nombre" label="Comercio" validate={required()} />
                </ReferenceInput>
            )}
            <SelectInput source="categoria" choices={CATEGORIAS} validate={required()} />
            <TextInput source="descripcion" multiline/>
            <NumberInput source="precio" options={{ style: "currency", currency: "MXN" }} />
            <NumberInput source="precioOferta" label="Precio de oferta" options={{ style: "currency", currency: "MXN" }} />
            <TextInput source="imagen" />
        </SimpleForm>
    </Edit>
    )
};

export const crearProductos = ()=>{
    const { permissions } = usePermissions();
    return (
    <Create>
        <SimpleForm>
            <TextInput disabled source = "id" label = 'ID'/>
            <TextInput source="nombre" />
            {permissions === "admin" && (
                <ReferenceInput source="comercioId" reference="Comercios">
                    <SelectInput optionText="nombre" label="Comercio" validate={required()} />
                </ReferenceInput>
            )}
            <SelectInput source="categoria" choices={CATEGORIAS} validate={required()} />
            <TextInput source="descripcion" multiline/>
            <NumberInput source="precio" options={{ style: "currency", currency: "MXN" }} />
            <NumberInput source="precioOferta" label="Precio de oferta" options={{ style: "currency", currency: "MXN" }} />
            <TextInput source="imagen" />
        </SimpleForm>
    </Create>
    )
};

const DetalleProducto = () => {
    const p = useRecordContext();
    if (!p) return null;

    const precio = Number(p.precio);
    const oferta = Number(p.precioOferta);
    const ahorro = precio - oferta;
    const porcentaje = precio ? Math.round((ahorro * 100) / precio) : 0;

    return (
        <Grid container spacing={4} sx={{ p: { xs: 2, md: 4 } }}>
            <Grid size={{ xs: 12, md: 6 }}>
                <Box
                    component="img"
                    src={p.imagen}
                    alt={p.nombre}
                    sx={{
                        width: "100%",
                        maxHeight: 450,
                        objectFit: p.imagen ? "cover" : "contain",
                        borderRadius: 3,
                        bgcolor: "background.default",
                    }}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={2}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
                        {p.nombre}
                    </Typography>
                    <Typography color="text.secondary">{p.empresa}</Typography>
                    <Chip label={p.categoria} color="primary" variant="outlined" sx={{ alignSelf: "flex-start" }} />

                    {p.descripcion && <Typography>{p.descripcion}</Typography>}

                    <Box>
                        {oferta ? (
                            <>
                                <Typography sx={{ textDecoration: "line-through", color: "text.secondary" }}>
                                    <span style={{ position: "absolute", left: "-9999px" }}>Precio anterior: </span>
                                    ${precio.toLocaleString("es-MX")}
                                </Typography>
                                <Typography variant="h3" color="primary" sx={{ fontWeight: "bold" }}>
                                    ${oferta.toLocaleString("es-MX")}
                                </Typography>
                                <Typography color="success.main" sx={{ fontWeight: "bold" }}>
                                    Ahorras ${ahorro.toLocaleString("es-MX")} ({porcentaje}%)
                                </Typography>
                            </>
                        ) : (
                            <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                                ${precio.toLocaleString("es-MX")}
                            </Typography>
                        )}
                    </Box>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <BotonVerOferta />
                        <FavoritoButton />
                    </Stack>
                </Stack>
            </Grid>
        </Grid>
    );
};

export const mostrarProductos = () => (
    <Show title="Detalle del producto">
        <DetalleProducto />
    </Show>
);