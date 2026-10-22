import {Datagrid, List, TextField, DateField, UpdateButton} from "react-admin";

// Modificación de IA: botón de actualización de estado de empresa.
export const listarSolicitudes = ()=>(
    <List filter={{ estado: "pendiente" }}>
        <Datagrid rowClick={false} bulkActionButtons={false}>
            <TextField source="id" />
            <TextField source="empresa" />
            <TextField source="rfc" label="RFC" />
            <TextField source="responsable" label="Responsable" />
            <TextField source="estado" />
            <DateField source="fecha" />
            <UpdateButton label="Aprobar" data={{ estado: "aprobada" }} mutationMode="pessimistic" />
            <UpdateButton label="Rechazar" data={{ estado: "rechazada" }} mutationMode="pessimistic" />
        </Datagrid>
    </List>
);
