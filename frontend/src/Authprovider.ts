import { AuthProvider } from "react-admin";

type Regla = (p: { resource: string; action: string }) => boolean;

const accessControlStrategies: Record<string, Regla> = {
    admin:      () => true,
    comercio:   ({ action }) => ["list", "show", "create", "delete"].includes(action),
    consumidor: ({ action }) => ["list", "show"].includes(action),
};

const authProvider : AuthProvider={
    login: async({username,password})=>{
        const request=new Request(import.meta.env.VITE_BACKEND+ "/login", {
            method: "POST",
            body: JSON.stringify({"username":username, "password":password}),
            headers:new Headers({"Content-type":"application/json"})
        });
        try{
            const res=await fetch(request);
            if(res.status<200 || res.status>=300){
                throw new Error(res.statusText);
            }
            const auth=await res.json();
            sessionStorage.setItem("auth", auth.token);
            sessionStorage.setItem("identity", JSON.stringify({"id":auth.id}));
            sessionStorage.setItem("rol", auth.rol);
            return Promise.resolve();
        }catch{
            throw new Error("Error en usuario o password");
        }
    },
    logout:()=>{
        sessionStorage.removeItem("auth");
        sessionStorage.removeItem("identity");
        sessionStorage.removeItem("rol");
        return Promise.resolve();
    },
    checkAuth:()=>{return sessionStorage.getItem("auth")?Promise.resolve():Promise.reject()},
    checkError:(error)=>{
        const status=error.status;
        if(status==401){
            sessionStorage.removeItem("auth");
            sessionStorage.removeItem("identity");
            sessionStorage.removeItem("rol");
            return Promise.reject();
        }
        return Promise.resolve();
    },
    canAccess: async ({resource, action})=>{
        const rol=sessionStorage.getItem("rol") ?? "";
        return accessControlStrategies[rol]?.({resource, action}) ?? false;   // rol desconocido: sin acceso
    },
}
export default authProvider;