import React,{useState,useCallback} from 'react'
import { Route,Routes } from 'react-router-dom'
import './App.css'
import LobbyScreen from './assets/component/LobbyScreen'
import Room from './assets/component/Room'

function App() {
  

  return (
    <div>
      <Routes>
        <Route path='/' element={<LobbyScreen/>}/>
        <Route path='/room/:roomId' element={<Room/>}/>
      </Routes>
    </div>
  )
}

export default App
