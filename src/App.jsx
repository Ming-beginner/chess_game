/* eslint-disable no-unused-vars */
import {useEffect} from 'react';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from 'react-router-dom';
import {Pvp, Pvc, Online, Home, OnlineGame} from './pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: 'pvp',
    element: <Pvp />,
  },
  {
    path: 'pvc',
    element: <Pvc />,
  },
  {
    path: 'online',
    children: [
      {
        path: '/online/',
        element: <Online />,
      },
      {
        path: '/online/:id',
        element: <OnlineGame />,
      },
    ],
  },
]);
function App() {
  const audio = document.getElementById('audio');
  audio.click();
  audio.volume = 0.05;
  audio.play();
  return <RouterProvider router={router} />;
}

export default App;
