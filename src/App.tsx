import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Note from "./componets/Note";
import NoteDetail from "./componets/NoteDetail";
import NoteCreate from "./componets/NoteCreate";
import "./App.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Note />} />
          <Route path="/note/:id" element={<NoteDetail />} />
          <Route path="/noteCreate" element={<NoteCreate />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
