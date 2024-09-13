import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface Note {
  id: number;
  content: string;
}

function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newContent, setNewContent] = useState(""); // Estado para el nuevo contenido

  // Fetch la nota actual
  const { isLoading, isError, data } = useQuery<Note>({
    queryKey: ["note" + id],
    queryFn: () =>
      fetch(`http://localhost:3000/notes/${id}`).then((res) => res.json()),
  });

  // Sincronizar el estado local con el contenido del servidor
  useEffect(() => {
    if (data) {
      setNewContent(data.content); // Setear el contenido al cargar la nota
    }
  }, [data]);

  // Mutación para actualizar la nota
  const updateNoteMutation = useMutation({
    mutationFn: (updatedNote: Note) => {
      return fetch(`http://localhost:3000/notes/${id}`, {
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
      return fetch(`http://localhost:3000/notes/${id}`, {
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
    const idd = parseInt(id!);
    console.log("idd:", idd);
    updateNoteMutation.mutate({ id: idd, content: newContent });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteNoteMutation.mutate();
    }
  };
  console.log("data:", data);
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

      {/* Nota editable */}
      <div className="post-it p-4">
        <textarea
          className="sticky taped"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          rows={8}
        />
      </div>
    </div>
  );
}

export default NoteDetail;
