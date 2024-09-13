import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface nota {
  content: string;
  tags: number[]; // Almacenaremos los IDs de los tags seleccionados
}

interface tagsi {
  id: number;
  name: string;
}

function NoteCreate() {
  const navigate = useNavigate();
  const [noteContent, setNoteContent] = useState(""); // Estado para el contenido de la nota
  const [selectedTags, setSelectedTags] = useState<number[]>([]); // Estado para los tags seleccionados

  // Mutación para el POST de la nota
  const postNoteMutation = useMutation({
    mutationFn: (newNote: nota) => {
      return fetch("http://localhost:3000/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNote),
      });
    },
    onSuccess: () => {
      navigate(`/`); // Redirigir al usuario después de guardar
    },
    onError: (error: any) => {
      console.error("Error posting note:", error);
    },
  });

  // Consulta para obtener las etiquetas (tags)
  const { isPending, error, data } = useQuery({
    queryKey: ["tags"],
    queryFn: () =>
      fetch("http://localhost:3000/tags").then((res) => res.json()),
  });

  if (isPending) return "Loading...";
  if (error) return "An error has occurred: " + error.message;

  // Alternar la selección de una etiqueta (toggle)
  const toggleTag = (tagId: number) => {
    setSelectedTags(
      (prevSelectedTags) =>
        prevSelectedTags.includes(tagId)
          ? prevSelectedTags.filter((id) => id !== tagId) // Quitar el tag si ya está seleccionado
          : [...prevSelectedTags, tagId] // Agregar el tag si no está seleccionado
    );
  };

  // Guardar la nota
  const handleSave = () => {
    const newNote: nota = {
      content: noteContent, // El contenido de la nota
      tags: selectedTags, // Los IDs de los tags seleccionados
    };

    postNoteMutation.mutate(newNote); // Hacer la mutación para el POST
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      {/* Flecha de regreso */}
      <div
        className="position-absolute top-0 start-0 m-2 btn btn-outline-secondary"
        onClick={() => navigate(`/`)}
      >
        ← Back
      </div>

      {/* Botón de guardar */}
      <button
        className="btn btn-success position-absolute top-0 start-50 translate-middle-x mt-2"
        onClick={handleSave}
      >
        Save
      </button>

      {/* Nota editable */}
      <div className="post-it p-4">
        <div>
          <textarea
            className="sticky taped m-0"
            rows={8}
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)} // Almacenar el contenido de la nota
          />
        </div>
        <div>
          {data?.map((tag: tagsi) => (
            <span
              key={tag.id}
              className={`etiqueta badge bg-primary-espace ${
                selectedTags.includes(tag.id) ? "bg-primary" : "bg-primary-un"
              }`} // Cambiar clase según el estado
              onClick={() => toggleTag(tag.id)} // Alternar el tag seleccionado
              style={{ cursor: "pointer" }}
            >
              {tag.name}
            </span>
          ))}
        </div>
        <div>
          <p className="d-flex justify-content-center align-items-center">
            Click for add
          </p>
        </div>
      </div>
    </div>
  );
}

export default NoteCreate;
