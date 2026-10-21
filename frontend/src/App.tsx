import { Admin, Resource, CustomRoutes, radiantLightTheme, radiantDarkTheme } from "react-admin";
import { Layout } from "./Layout";
import {Route} from  "react-router-dom";
import {listarProductos, editarProductos, crearProductos} from "./Productos";
import {listarComercios, editarComercios, crearComercios} from "./Comercios";
import {dataProvider} from "./dataProvider";
import Registro from "./registrarse";
import Inicio from "./Inicio";
import RegistroComercio from "./registrarse-comercio";
import authProvider from "./Authprovider";
import { deepmerge } from '@mui/utils';

const myTheme = deepmerge(radiantLightTheme, {
   palette: {
        primary:    { main: "#e20612" },
        background: { default: "#FFFFFF", paper: "#FFFFFF" },
    },
   typography: {
        fontFamily: "'Poppins', sans-serif"
    },
    sidebar: {
        width: 270,
        closedWidth: 50,
    },
   components: {
        MuiAppBar: {                   
            styleOverrides: {
                colorSecondary: {
                    backgroundColor: "#e20612",
                    color: "#FFFFFF", 
                },
            },
        },
        RaMenuItemLink: {                          
            styleOverrides: {
                root: {
                  "&.RaMenuItemLink-active": {
                    background: "#e20612",
                    color: "#FFFFFF",
                    borderLeft: "#e20612",
                  },
                },
            },
        },

        RaDatagrid: {                          
            styleOverrides: {
                root: {
                  "& .RaDatagrid-headerCell": {
                    color: "#000000b6",
                    fontSize: 20,
                  },
                },
            },
        },

        

        MuiPaper: {
            styleOverrides: {
            elevation1: {
            boxShadow: "rgba(0,0,0,0.12) -2px 2px, " +
                        "rgba(0,0,0,0.12) -4px 4px, " +
                        "rgba(0,0,0,0.12) -6px 6px",
            },
         },
      },
    },
   
});

const myDarkTheme = deepmerge(radiantDarkTheme, {
   palette: {
        primary:    { main: "#f9626a" },
    },
   typography: {
        fontFamily: "'Poppins', sans-serif"
    },
    sidebar: {
        width: 270,
        closedWidth: 50,
    },
   components: {
        MuiAppBar: {                   
            styleOverrides: {
                colorSecondary: {
                    backgroundColor: "#f9626a",
                    color: "#FFFFFF", 
                },
            },
        },
        RaMenuItemLink: {                          
            styleOverrides: {
                root: {
                  "&.RaMenuItemLink-active": {
                    background: "#f9626a",
                    color: "#FFFFFF",
                    borderLeft: "#f9626a",
                  },
                },
            },
        },

         RaDatagrid: {                          
            styleOverrides: {
                root: {
                  "& .RaDatagrid-headerCell": {
                    color: "#ffffff",
                    fontSize: 20,
                  },
                },
            },
        },

        MuiPaper: {
            styleOverrides: {
            elevation1: {
            boxShadow: "rgba(0,0,0,0.12) -2px 2px, " +
                        "rgba(0,0,0,0.12) -4px 4px, " +
                        "rgba(0,0,0,0.12) -6px 6px",
            },
         },
      },
    },
   
});

export const App = () => (
<Admin layout={Layout} dataProvider={dataProvider} authProvider={authProvider}  theme={myTheme} darkTheme={ myDarkTheme }>
<Resource
    name="Productos"
    list={listarProductos}
    edit={editarProductos}
    create={crearProductos}
 />

 <Resource
    name="Comercios"
    list={listarComercios}
    edit={editarComercios}
    create={crearComercios}
/>
 <CustomRoutes noLayout>
    <Route path="/Inicio" element={<Inicio />}/>
    <Route path="/registrarse" element={<Registro />}/>
    <Route path="/registrarse-comercio" element={<RegistroComercio />}/>
 </CustomRoutes>
</Admin>

);
