import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Note from "./componets/Note";
import NoteDetail from "./componets/NoteDetail";
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
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
