import {Datagrid, List, TextField, Edit, SimpleForm, TextInput, Create, EditButton, DeleteButton} from "react-admin";

export const listarComercios = ()=>(
    <List>
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
