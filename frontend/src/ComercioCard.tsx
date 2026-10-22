import { Card, CardMedia, CardContent, CardActions, Typography, Chip, Stack } from "@mui/material";
import { useRecordContext, ShowButton, EditButton, ReferenceField, TextField } from "react-admin";

const ComercioCard = () => {
    const record = useRecordContext();   // el producto de ESTA tarjeta
    console.log(record);
    if (!record) return null;

    return (
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <CardMedia
                component="img"
                height="200"
                image={record.imagen || "/logo.png"}
                alt={record.nombre}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5">{record.nombre}</Typography>

                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mt: 1 }}>
                    {record.categoria && <Chip label={record.categoria} size="small" color="primary" variant="outlined" />}
                </Stack>


            </CardContent>
            <CardActions>
                <ShowButton label = "Ver perfil" />
                <EditButton />
            </CardActions>
        </Card>
    );
};

export default ComercioCard;