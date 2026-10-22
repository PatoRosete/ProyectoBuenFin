import { Admin, Resource, CustomRoutes, radiantLightTheme, radiantDarkTheme } from "react-admin";
import { Layout } from "./Layout";
import {Route} from  "react-router-dom";
import {listarProductos, editarProductos, crearProductos, mostrarProductos} from "./Productos";
import {listarComercios, editarComercios, mostrarComercios } from "./Comercios";
import {listarVacantes, editarVacantes, crearVacantes} from "./Vacantes";
import {listarPostulaciones, editarPostulaciones} from "./Postulaciones";
import {listarWishlist} from "./Wishlist";
import {dataProvider} from "./dataProvider";
import Registro from "./registrarse";
import Inicio from "./Inicio";
import RegistroComercio from "./registrarse-comercio";
import { listarSolicitudes, mostrarSolicitudes } from "./Solicitudes";
import authProvider from "./Authprovider";
import { deepmerge } from '@mui/utils';
import { MyLoginPage } from './MyLoginPage';

const fuente = "'Poppins', sans-serif";
const variantes = ["h1","h2","h3","h4","h5","h6","subtitle1","subtitle2", "body1","body2","button","caption","overline"];

const typography = {
    fontFamily: fuente,
    ...Object.fromEntries(variantes.map(v => [v, { fontFamily: fuente }])),
};

const myTheme = deepmerge(radiantLightTheme, {
   palette: {
        primary:    { main: "#e20612",
        dark: "#b0040e",
        light: "#f9626a",
        contrastText: "#FFFFFF", },
        background: { default: "#FFFFFF", paper: "#FFFFFF" },
        
    },
   typography: typography,
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
                    borderLeft: "none"
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
        primary:    { main: "#f9626a",
         dark: "#e7343d",
         light: "#ff8f95",
        contrastText: "#FFFFFF",
         },
    },
   typography: typography,
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
                    borderLeft: "none"
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
<Admin layout={Layout} dataProvider={dataProvider} authProvider={authProvider}  theme={myTheme} darkTheme={ myDarkTheme }
loginPage={MyLoginPage} >
<Resource
    name="Productos"
    list={listarProductos}
    edit={editarProductos}
    create={crearProductos}
    show={mostrarProductos}
 />

 <Resource
    name="Comercios"
    list={listarComercios}
    edit={editarComercios}
    show={mostrarComercios}
/>

 <Resource
    name="Vacantes"
    list={listarVacantes}
    edit={editarVacantes}
    create={crearVacantes}
/>

 <Resource
    name="Postulaciones"
    list={listarPostulaciones}
    edit={editarPostulaciones}
/>

  <Resource 
     name="Solicitudes"
     list={listarSolicitudes}
     show={mostrarSolicitudes}
     />

 <Resource
    name="Wishlist"
    list={listarWishlist}
    options={{ label: "Mi wishlist" }}
 />

 <CustomRoutes noLayout>
    <Route path="/Inicio" element={<Inicio />}/>
    <Route path="/registrarse" element={<Registro />}/>
    <Route path="/registrarse-comercio" element={<RegistroComercio />}/>
 </CustomRoutes>
</Admin>

);