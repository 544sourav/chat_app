// App.jsx

import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Home } from './pages/Home';
import { VerifyEmail } from './pages/VerifyEmail';
import { Chats } from './pages/Chats';
import { ViewChat } from './components/chatsection/viewChat';
import { Navbar } from './components/common/navbar';
import Signup from './pages/Signup';
import { Find } from './pages/Find';
import { PrivateRoute } from './components/auth/privateroute';
import { OpenRoute } from './components/auth/openroute';
import { Group } from './pages/Group';
function App() {
  return (
    <div className='w-screen min-h-screen bg-deepblue-900 flex flex-col font-inter'>
      <Navbar />
      <Routes>
        <Route path='/' element={<OpenRoute><Home/></OpenRoute>} />
        <Route path='/signup' element={<OpenRoute><Signup /></OpenRoute>} />
        <Route path='verify-email' element={<OpenRoute><VerifyEmail /></OpenRoute>} />
        
        <Route
          element={
            <PrivateRoute />
          }
        >
            <Route path='creategroup' element={<Group/>} />
            <Route path='find' element={<Find/>} />
            <Route path='/chats' element={<Chats />}>
              <Route path='/chats/:chatId' element={<ViewChat />} />
            </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
