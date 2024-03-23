import React from 'react';
import logo from './logo.svg';
import './App.css';
import UploadFile from './UploadFile';
import { PhotoList } from './pages/phtoto-list';

function App() {

  return (
    <div className="App">
      <UploadFile></UploadFile>
      <PhotoList />
    </div>
  );
}

export default App;
