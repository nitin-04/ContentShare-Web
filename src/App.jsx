
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./components/Body";
import ViewPage from "./components/ViewPage";
import FileList from "./components/FileList";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body />} />
          <Route path="/view/:id" element={<ViewPage />} />
          <Route path="/file-list" element={<FileList />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App;