import { Button, CanAccess, useCreate, useDelete, useGetList, useNotify, useRecordContext } from "react-admin";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

// Implementación de IA
// Botón de corazón de la lista de Productos: agrega o quita el producto de la wishlist del consumidor
const BotonFavorito = () => {
    const record = useRecordContext();
    const notify = useNotify();
    // El backend solo devuelve la wishlist del propio usuario.
    // Todos los botones comparten esta misma consulta, así que es una sola petición.
    const { data, refetch } = useGetList("Wishlist", { pagination: { page: 1, perPage: 1000 } });
    const [create, { isPending: creando }] = useCreate();
    const [quitar, { isPending: quitando }] = useDelete();

    if (!record) return null;

    // el registro de la wishlist de este producto (si ya está guardado)
    const guardado = data?.find((w) => w.productoId === record.id);

    const alternar = (e: React.MouseEvent) => {
        e.stopPropagation(); // para que el clic no abra la fila de la tabla
        if (guardado) {
            quitar(
                "Wishlist",
                { id: guardado.id, previousData: guardado },
                {
                    mutationMode: "pessimistic", // espera la respuesta del servidor
                    onSuccess: () => { notify("Quitado de tu wishlist"); refetch(); },
                    onError: () => notify("No se pudo quitar, inténtalo de nuevo", { type: "error" }),
                }
            );
        } else {
            create(
                "Wishlist",
                { data: { productoId: record.id } }, // solo se manda el producto; lo demás lo pone el backend
                {
                    onSuccess: () => { notify("Agregado a tu wishlist", { type: "success" }); refetch(); },
                    onError: () => { notify("No se pudo agregar, inténtalo de nuevo", { type: "error" }); refetch(); },
                }
            );
        }
    };

    return (
        <Button
            label={guardado ? "Guardado" : "Guardar"}
            onClick={alternar}
            disabled={creando || quitando}
        >
            {guardado ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </Button>
    );
};

// Solo se muestra si canAccess({ action: "create", resource: "Wishlist" }) es true (consumidores)
// (los hooks de arriba solo se ejecutan para quien tiene ese permiso)
const FavoritoButton = () => (
    <CanAccess action="create" resource="Wishlist">
        <BotonFavorito />
    </CanAccess>
);

export default FavoritoButton;