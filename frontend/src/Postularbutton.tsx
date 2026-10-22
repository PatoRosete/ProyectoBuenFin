import { Button, CanAccess, useCreate, useGetList, useNotify, useRecordContext } from "react-admin";

// Implementación de IA
// El consumidor no ve nada de sus postulaciones: solo el botón, que cambia si ya se postuló
const BotonPostular = () => {
    const record = useRecordContext();
    const notify = useNotify();
    // El backend solo devuelve las postulaciones del propio usuario.
    // Todos los botones comparten esta misma consulta, así que es una sola petición.
    const { data, refetch } = useGetList("Postulaciones", { pagination: { page: 1, perPage: 1000 } });
    const [create, { isPending }] = useCreate();

    if (!record) return null;

    const yaPostulado = data?.some((p) => p.vacanteId === record.id) ?? false;

    const postular = (e: React.MouseEvent) => {
        e.stopPropagation(); // para que el clic no abra la fila de la tabla
        create(
            "Postulaciones",
            { data: { vacanteId: record.id } }, // solo se manda la vacante; lo demás lo pone el backend
            {
                onSuccess: () => {
                    notify("Postulación enviada", { type: "success" });
                    refetch();
                },
                onError: (error: any) => {
                    notify(
                        error?.status === 409
                            ? "Ya te postulaste a esta vacante"
                            : "No se pudo enviar la postulación, inténtalo de nuevo",
                        { type: "error" }
                    );
                    refetch();
                },
            }
        );
    };

    return (
        <Button
            label={yaPostulado ? "Ya te postulaste" : "Postularme"}
            onClick={postular}
            disabled={isPending || yaPostulado}
        />
    );
};

// Solo se muestra si canAccess({ action: "postular", resource: "Vacantes" }) es true
// (los hooks de arriba solo se ejecutan para quien tiene ese permiso)
const PostularButton = () => (
    <CanAccess action="postular" resource="Vacantes">
        <BotonPostular />
    </CanAccess>
);

export default PostularButton;