import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from './LanguageContext.jsx';
import Header from './components/Header.jsx';
import Landing from './pages/Landing.jsx';
import Editor from './pages/Editor.jsx';
import Preview from './pages/Preview.jsx';
import Read from './pages/Read.jsx';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/write" element={<Editor />} />
          <Route path="/write/:id" element={<Editor />} />
          <Route path="/preview/:id" element={<Preview />} />
          <Route path="/s/:id" element={<Read />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
