// import ListGroup from "./componets/ListGroups";
import Note from "./componets/Note";
import "./App.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  // let items = ["nota 1", "nota 2", "nota 3", "nota 4"];
  // const handleSelectedItem = (item: string) => {
  //   console.log(item);
  // };

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ListGroup
        items={items}
        heading="Cities"
        onSelectedItem={handleSelectedItem}
      /> */}
      <Note />
    </QueryClientProvider>
  );
}

export default App;
