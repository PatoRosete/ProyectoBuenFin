import {Datagrid, List, TextField, DeleteButton} from "react-admin";

export const listarWishlist = ()=>(
    <List>
        <Datagrid>
            <TextField source="producto" label="Producto" />
            <TextField source="empresa" label="Empresa" />
            <TextField source="categoria" label="Categoría" />
            <DeleteButton label="Quitar" />
        </Datagrid>
    </List>
);