import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface Note {
  id: number;
  content: string;
  tags: tagsi[];
  is_archived: boolean;
  created_at: string; // Asegúrate de que el campo de fecha exista en la respuesta de la API
}

interface tagsi {
  id: number;
  name?: string;
}

function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newContent, setNewContent] = useState(""); // Estado para el nuevo contenido
  const [activeTags, setActiveTags] = useState<tagsi[]>([]); // Estado para los tags activos
  const [createdAt, setCreatedAt] = useState<string | null>(null); // Estado para almacenar la fecha de creación

  // Fetch la nota actual
  const { isLoading, isError, data } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_BASE_URL}/notes/${id}`).then((res) =>
        res.json()
      ),
  });

  // Fetch para obtener todas las etiquetas
  const { data: allTags } = useQuery<tagsi[]>({
    queryKey: ["tags"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_BASE_URL}/tags`).then((res) =>
        res.json()
      ),
  });

  // Sincronizar el estado local con el contenido del servidor
  useEffect(() => {
    if (data) {
      setNewContent(data.content); // Setear el contenido al cargar la nota
      setActiveTags(data.tags); // Setear las tags activas al cargar la nota
      setCreatedAt(data.created_at); // Guardar la fecha de creación
    }
  }, [data]);

  // Mutación para actualizar la nota
  const updateNoteMutation = useMutation({
    mutationFn: (updatedNote: Partial<Note>) => {
      console.log("updatedNote", updatedNote);
      return fetch(`${import.meta.env.VITE_API_BASE_URL}/notes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedNote),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note", id] }); // Invalida la cache para actualizar
    },
  });

  // Mutación para eliminar la nota
  const deleteNoteMutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_BASE_URL}/notes/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note", id] }); // Invalida la cache para la lista de notas
      navigate("/"); // Navega de regreso a la lista de notas
    },
  });

  if (isLoading) return "Loading...";
  if (isError) return "An error has occurred.";

  const handleClick = () => {
    navigate(`/`);
  };

  const handleSave = () => {
    updateNoteMutation.mutate({
      content: newContent,
      tags: activeTags.map((tag) => tag.id) as unknown as tagsi[], // Convierte a tagsi[] temporalmente
    });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteNoteMutation.mutate();
    }
  };

  const toggleTag = (tag: tagsi) => {
    if (activeTags.some((activeTag) => activeTag.id === tag.id)) {
      setActiveTags(activeTags.filter((activeTag) => activeTag.id !== tag.id));
    } else {
      setActiveTags([...activeTags, tag]);
    }
  };

  const handleArchiveToggle = () => {
    updateNoteMutation.mutate({
      is_archived: !data?.is_archived, // Cambiar el valor de is_archived
    });
  };

  // Formatear la fecha
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      {/* Flecha de regreso */}
      <div
        className="position-absolute top-0 start-0 m-2 btn btn-outline-secondary"
        onClick={() => handleClick()}
      >
        ← Back
      </div>

      {/* Botón de eliminar */}
      <button
        className="btn btn-danger position-absolute top-0 end-0 m-2"
        onClick={handleDelete}
      >
        Delete
      </button>

      {/* Botón de guardar */}
      <button
        className="btn btn-success position-absolute top-0 start-50 translate-middle-x mt-2"
        onClick={handleSave}
      >
        Save
      </button>

      {/* Botón de archive/unarchive */}
      <button
        className={`btn ${
          data?.is_archived ? "btn-secondary" : "btn-warning"
        } position-absolute top-0 endp mt-5`}
        onClick={handleArchiveToggle}
      >
        {data?.is_archived ? "Unarchive" : "Archive"}
      </button>

      {/* Nota editable */}
      <div className="post-it p-4">
        <textarea
          className="sticky taped m-0"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          rows={8}
        />
        <div>
          {allTags?.map((tag: tagsi) => (
            <span
              key={tag.id}
              className={`etiqueta badge bg-primary-espace ${
                activeTags.some((activeTag) => activeTag.id === tag.id)
                  ? "bg-primary"
                  : "bg-primary-un"
              }`}
              onClick={() => toggleTag(tag)}
              style={{ cursor: "pointer", margin: "5px" }}
            >
              {tag.name}
            </span>
          ))}
        </div>
        <div>
          <p className="d-flex justify-content-center align-items-center">
            Click for add or remove
          </p>
        </div>

        {/* Fecha de creación en la parte inferior derecha */}
        <div className="position-absolute bottom-0 end-0 m-2">
          <small>Created on: {formattedDate}</small>
        </div>
      </div>
    </div>
  );
}

export default NoteDetail;
