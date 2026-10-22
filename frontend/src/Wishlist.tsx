import { List, useListContext, RecordContextProvider, ReferenceField } from "react-admin";
import { Grid, Typography } from "@mui/material";
import ProductoCard from "./ProductoCard";

// Implementación de IA: wishlist en tarjetas, reutilizando la tarjeta del catálogo
const TarjetasWishlist = () => {
    const { data, isPending } = useListContext();
    if (isPending) return null;
    if (!data?.length) {
        return (
            <Typography sx={{ p: 3 }}>
                Aún no tienes productos guardados. Da clic en ♡ Guardar en el catálogo.
            </Typography>
        );
    }

    return (
        <Grid container spacing={3} sx={{ p: 2 }}>
            {data.map((w) => (
                <Grid key={w.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <RecordContextProvider value={w}>
                        <ReferenceField source="productoId" reference="Productos" link={false}>
                            <ProductoCard />
                        </ReferenceField>
                    </RecordContextProvider>
                </Grid>
            ))}
        </Grid>
    );
};

export const listarWishlist = () => (
    <List title="Mi wishlist" actions={false}>
        <TarjetasWishlist />
    </List>
);