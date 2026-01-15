import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Global Error Boundary caught:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: '#D8000C', backgroundColor: '#FFD2D2', fontFamily: 'sans-serif', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '2rem' }}>Critical Application Error</h1>
          <p style={{ fontSize: '1.2rem' }}>The application failed to start.</p>
          <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '5px', overflow: 'auto', maxWidth: '80%', margin: '20px 0', border: '1px solid #ccc' }}>
            <strong>Error:</strong> {this.state.error && this.state.error.toString()}
            <br />
            <pre style={{ fontSize: '0.8rem' }}>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
          </div>
          <button
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{ padding: '15px 30px', fontSize: '1rem', backgroundColor: '#D8000C', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            HARD RESET & RELOAD
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </React.StrictMode>,
)
