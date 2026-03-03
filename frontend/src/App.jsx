import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import TheVault from './pages/TheVault';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<TheVault />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
