import {Datagrid, List, TextField, Edit, SimpleForm, TextInput, Create, EditButton, DeleteButton, SearchInput} from "react-admin";

// Implementación de IA
const filtros = [<SearchInput key="q" source="q" alwaysOn />];

export const listarComercios = ()=>(
    <List filters={filtros}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="nombre" />
            <TextField source="categoria" />
            <TextField source="sitioweb" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const editarComercios = ()=>(
    <Edit>
        <SimpleForm>
            <TextInput source="id" />
            <TextInput source="nombre" />
            <TextInput source="categoria" />
            <TextInput source="sitioweb" />
        </SimpleForm>
    </Edit>
);

export const crearComercios = ()=>(
    <Create>
        <SimpleForm>
            <TextInput source="id" />
            <TextInput source="nombre" />
            <TextInput source="categoria" />
            <TextInput source="sitioweb" />
        </SimpleForm>
    </Create>
);