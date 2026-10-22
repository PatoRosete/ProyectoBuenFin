import {Datagrid, List, Show, TextField, DateField, UpdateButton, SimpleShowLayout} from "react-admin";

// Modificación de IA: botón de actualización de estado de empresa.
export const listarSolicitudes = ()=>(
    <List filter={{ estado: "pendiente" }}>
        <Datagrid rowClick="show" bulkActionButtons={false}>
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

export const mostrarSolicitudes = ()=>(
    <Show filter={{ estado: "pendiente" }}>
        <SimpleShowLayout >
            <TextField source="id" />
            <TextField source="empresa" />
            <TextField source="rfc" label="RFC" />
            <TextField source="responsable" label="Responsable" />
            <TextField source="descripcion" />
            <TextField source="ubicacion" />
            <TextField source="estado" />
            <DateField source="fecha" />
            <UpdateButton label="Aprobar" data={{ estado: "aprobada" }} mutationMode="pessimistic" />
            <UpdateButton label="Rechazar" data={{ estado: "rechazada" }} mutationMode="pessimistic" />
        </SimpleShowLayout>
    </Show>
);