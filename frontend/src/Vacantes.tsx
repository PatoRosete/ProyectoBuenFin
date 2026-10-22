import {Datagrid, List, TextField, Edit, SimpleForm, TextInput, Create, EditButton, DeleteButton} from "react-admin";
import PostularButton from "./Postularbutton";

export const listarVacantes = ()=>(
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="titulo" />
            <TextField source="empresa" />
            <TextField source="descripcion" />
            <TextField source="ubicacion" />
            <EditButton />
            <DeleteButton />
            <PostularButton />
        </Datagrid>
    </List>
);

export const editarVacantes = ()=>(
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="titulo" />
            <TextInput source="descripcion" multiline />
            <TextInput source="ubicacion" />
        </SimpleForm>
    </Edit>
);

export const crearVacantes = ()=>(
    <Create>
        <SimpleForm>
            <TextInput source="titulo" />
            <TextInput source="descripcion" multiline />
            <TextInput source="ubicacion" />
        </SimpleForm>
    </Create>
);