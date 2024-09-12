import { useQuery } from "@tanstack/react-query";

interface nota {
  id: number;
  content: string;
}

function Note() {
  const { isPending, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      fetch("http://localhost:3000/notes").then((res) => res.json()),
  });

  if (isPending) return "Loading.sss..";

  if (error) return "An error has occurred: " + error.message;

  console.log(data);
  return (
    <div className="container">
      <div className="row">
        {data.map((note: nota) => (
          <div key={note.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="post-it">
              <p className="sticky taped">{note.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Note;
