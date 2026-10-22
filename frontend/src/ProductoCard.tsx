import { Card, CardMedia, CardContent, CardActions, Typography } from "@mui/material";
import { useRecordContext, ShowButton, EditButton, ReferenceField, TextField } from "react-admin";
import FavoritoButton from "./Favoritobutton";


const ProductoCard = () => {
    const record = useRecordContext();   // el producto de ESTA tarjeta
    console.log(record);
    if (!record) return null;

    return (
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <CardMedia
                component="img"
                height="300"
                image={record.imagen || "/logo.png"}
                alt={record.nombre}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5">{record.nombre}</Typography>

                <ReferenceField source="comercioId" reference="Comercios">
                    <TextField source="nombre" variant="body2" color="text.secondary" />
                </ReferenceField>

                <Typography variant="h6" color="primary" sx={{ mt: 1, fontWeight: "bold", opacity: 0.6, textDecoration: "line-through" }}>
                    ${record.precio}
                </Typography>

                <Typography variant="h5" color="primary" sx={{ mt: 1, fontWeight: "bold"}}>
                    ${record.precioOferta}
                </Typography>

            </CardContent>
            <CardActions>
                <ShowButton label = "Ver más" />
                <EditButton />
                <FavoritoButton />
            </CardActions>
        </Card>
    );
};

export default ProductoCard;