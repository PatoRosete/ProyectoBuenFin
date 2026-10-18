import {Datagrid, List, TextField, Edit, SimpleForm, TextInput, Create, EditButton, DeleteButton} from "react-admin";

export const listarProductos = ()=>(
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="nombre" />
            <TextField source="empresa" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const editarProductos = ()=>(
    <Edit>
        <SimpleForm>
            <TextInput source="id" />
            <TextInput source="nombre" />
            <TextInput source="empresa" />
        </SimpleForm>
    </Edit>
);

export const crearProductos = ()=>(
    <Create>
        <SimpleForm>
            <TextInput source="id" />
            <TextInput source="nombre" />
            <TextInput source="empresa" />
        </SimpleForm>
    </Create>
);
