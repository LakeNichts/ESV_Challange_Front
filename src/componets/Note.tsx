import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface nota {
  id: number;
  content: string;
  tags: tagsi[];
}

interface tagsi {
  id: number;
  name: string;
}

function Note() {
  const navigate = useNavigate();

  const handleClick = (noteId: number) => {
    navigate(`/note/${noteId}`);
  };

  const handleClickCreate = () => {
    navigate(`/noteCreate`);
  };

  const { isPending, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      fetch("http://localhost:3000/notes").then((res) => res.json()),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  console.log(data);
  return (
    <div className="container">
      <div className="row">
        {data.map((note: nota) => (
          <div key={note.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="post-it" onClick={() => handleClick(note.id)}>
              <div className="sticky taped">
                <p>{note.content}</p>
                <div className="etiquetas">
                  {note.tags.map((tag: tagsi) => (
                    <span key={tag.id} className="etiqueta badge bg-primary">
                      {tag.name}
                    </span>
                  ))}
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
