import {Datagrid, List, TextField, Edit, SimpleForm, TextInput, Create, EditButton, DeleteButton, SelectInput, SearchInput, required} from "react-admin";
import FavoritoButton from "./Favoritobutton";

// Implementación de IA
// Categorias de los productos (las mismas para filtrar y para elegir al crear o editar)
export const CATEGORIAS = ["Tecnología","Electrodomésticos","Línea blanca","Moda y calzado","Muebles","Autoservicio","Artículos para el hogar"].map((c) => ({ id: c, name: c }));

// Implementación de IA
const filtros = [
    <SearchInput key="q" source="q" alwaysOn />,
    <SelectInput key="categoria" source="categoria" choices={CATEGORIAS} alwaysOn />,
];

export const listarProductos = ()=>(
    <List filters={filtros}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="nombre" />
            <TextField source="empresa" />
            <TextField source="categoria" />
            <EditButton />
            <DeleteButton />
            <FavoritoButton />
        </Datagrid>
    </List>
);

export const editarProductos = ()=>(
    <Edit>
        <SimpleForm>
            <TextInput source="id" />
            <TextInput source="nombre" />
            <TextInput source="empresa" />
            <SelectInput source="categoria" choices={CATEGORIAS} validate={required()} />
        </SimpleForm>
    </Edit>
);

export const crearProductos = ()=>(
    <Create>
        <SimpleForm>
            <TextInput source="id" />
            <TextInput source="nombre" />
            <TextInput source="empresa" />
            <SelectInput source="categoria" choices={CATEGORIAS} validate={required()} />
        </SimpleForm>
    </Create>
);