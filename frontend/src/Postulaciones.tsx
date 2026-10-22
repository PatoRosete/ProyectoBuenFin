import {Datagrid, List, TextField, Edit, SimpleForm, TextInput, SelectInput, EditButton, DeleteButton} from "react-admin";

const ESTADOS = [
    { id: "enviada", name: "Enviada" },
    { id: "aceptada", name: "Aceptada" },
    { id: "rechazada", name: "Rechazada" },
];

export const listarPostulaciones = ()=>(
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="vacante" />
            <TextField source="usuario" />
            <TextField source="estado" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const editarPostulaciones = ()=>(
    <Edit>
        <SimpleForm>
            <TextInput source="vacante" disabled />
            <TextInput source="usuario" disabled />
            <SelectInput source="estado" choices={ESTADOS} />
        </SimpleForm>
    </Edit>
);