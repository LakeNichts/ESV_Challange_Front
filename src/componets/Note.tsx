import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface nota {
  id: number;
  content: string;
  tags: tagsi[];
  is_archived: boolean;
  created_at: string; // Nueva propiedad para la fecha de creación
}

interface tagsi {
  id: number;
  name: string;
}

function Note() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null); // Estado para el filtro de categoría
  const [showArchived, setShowArchived] = useState(false); // Estado para el toggle de archivadas

  const handleClick = (noteId: number) => {
    navigate(`/note/${noteId}`);
  };

  const handleClickCreate = () => {
    navigate(`/noteCreate`);
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_BASE_URL}/notes`).then((res) =>
        res.json()
      ),
  });

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + (error as Error).message;

  // Filtrar las notas: solo mostrar archivadas o no archivadas dependiendo del estado del toggle
  const filteredNotes = data
    .filter((note: nota) => {
      const matchesCategory = selectedCategory
        ? note.tags.some((tag) => tag.id === selectedCategory)
        : true; // Si no hay categoría seleccionada, mostrar todas las notas
      const matchesArchived = showArchived
        ? note.is_archived
        : !note.is_archived; // Mostrar archivadas o no archivadas según el toggle
      return matchesCategory && matchesArchived;
    })
    .sort(
      (a: nota, b: nota) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ); // Ordenar por fecha de creación, más reciente primero

  // Filtrar las categorías únicas usando Set y asegurando el tipo correcto
  const uniqueTags: tagsi[] = [
    ...new Set(data.flatMap((note: nota) => note.tags.map((tag) => tag.id))),
  ].map((tagId) => {
    const tag = data
      .flatMap((note: nota) => note.tags)
      .find((tag: tagsi) => tag.id === tagId);
    return tag!;
  });

  // Función para manejar el cambio de categoría
  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedCategory(value === "" ? null : parseInt(value, 10));
  };

  // Función para manejar el toggle de notas archivadas
  const handleToggleArchived = () => {
    setShowArchived((prev) => !prev);
  };

  return (
    <div className="container">
      {/* Filtros en la parte superior */}
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="categorySelect">Filter by Category:</label>
          <select
            id="categorySelect"
            className="form-select"
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {/* Opciones de categorías dinámicamente */}
            {uniqueTags.map((tag: tagsi) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col d-flex align-items-end">
          {/* Toggle para ver archivadas */}
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="archivedToggle"
              checked={showArchived}
              onChange={handleToggleArchived}
            />
            <label className="form-check-label" htmlFor="archivedToggle">
              Show Archived Notes
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        {filteredNotes.map((note: nota) => (
          <div key={note.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="post-it" onClick={() => handleClick(note.id)}>
              <div className="sticky taped position-relative">
                {/* Mostrar "archivado" si is_archived es true */}
                {note.is_archived && (
                  <span className="badge bg-warning position-absolute top-0 end-0 m-2">
                    ARCHIVE
                  </span>
                )}
                <p>{note.content}</p>
                <div className="etiquetas">
                  {note.tags.map((tag: tagsi) => (
                    <span key={tag.id} className="etiqueta badge bg-primary">
                      {tag.name}
                    </span>
                  ))}
                </div>
                {/* Fecha de creación en la esquina inferior derecha */}
                <div className="text-muted small position-absolute bottom-0 end-0 m-2">
                  {new Date(note.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
          <button
            className="add-note"
            type="button"
            onClick={() => handleClickCreate()}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default Note;
