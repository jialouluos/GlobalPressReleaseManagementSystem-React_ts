import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import { lazyLoad } from './routers/router';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react'
import "./App.css"
function App() {
  return (<Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <div className="App">
        <Routes>
          <Route path="/login" element={lazyLoad(React.lazy(() => import('./pages/Login')))} />
          <Route path="/sandbox//*" element={lazyLoad(React.lazy(() => import('./pages/SandBox')))} />
          <Route path="/" element={
            sessionStorage.getItem("menu") ?
              <Navigate to="/sandbox//*" /> :
              <Navigate to="/login" />
          } />
          <Route path="*" element={lazyLoad(React.lazy(() => import('./pages/SandBox/NoPermission')))} />
        </Routes>
      </div>
    </PersistGate>

  </Provider>

  );
}

export default App;
