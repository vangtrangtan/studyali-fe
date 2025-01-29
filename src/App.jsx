import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './components/NavbarAndFooter/Footer';
import Header from './components/NavbarAndFooter/Header';
// styles

import './App.css';
import About from './components/About';
import GameWordOrderCn from './components/Sentence/WordOrderCn';
import GameWordOrderEng from './components/Sentence/WordOrderEng';
import GameVocaCn from './components/Vocabulary/GameVocaCn';
import GameVocaEng from './components/Vocabulary/GameVocaEng';
import { CHINESE, ENGLISH } from './components/fileWithConstants';

import { Edit } from './components/Gym/ExerciseOperate';
import { GymMain } from './components/Gym/GymMain';
import GymPublic, { ExercisePublic } from './components/Gym/GymPublic';
import LoadOwnExercise, { LoadOwnExerciseTest } from './components/Gym/OwnExercise';
import LoadExercise from './components/Gym/excercise';
import Home from './components/HomePage';
import LoginPage, { LogoutPage } from './components/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import ProfilePage from './components/ProfileAndSetting/ProfilePage';
import SignupPage from './components/SignUpPage';
import { getLangFromLocalStorage } from './components/utils';

function disableDevtool() {
   // Disable right-click
   document.addEventListener("contextmenu", (e) => e.preventDefault());

   function ctrlShiftKey(e, key) {
      return e.ctrlKey && e.shiftKey && e.key === key;
   }

   document.addEventListener("keydown", (e) => {
      // Disable F12, Ctrl + Shift + I, Ctrl + Shift + J, Ctrl + U
      console.log(e);

      if (
         e.key === "F12" ||
         ctrlShiftKey(e, "I") ||
         ctrlShiftKey(e, "J") ||
         (e.ctrlKey && e.key === "U")
      ) {
         e.preventDefault();
      }
   });
}

const App = () => {
   const [language, setLanguage] = useState(getLangFromLocalStorage() === undefined ? ENGLISH : getLangFromLocalStorage());

   disableDevtool();
   //long username testname123456789012345678901234567890
   return <BrowserRouter>
      <div>
         <Header language={language} setLanguage={setLanguage} />
         <div className='main-body'>
            <Routes>
               <Route path="/gym" element={<PrivateRoute><GymMain/></PrivateRoute>} />
               <Route path="/gym/own" element={<PrivateRoute><GymMain /></PrivateRoute>} />
               <Route path="/gym/create" element={<PrivateRoute><GymMain /></PrivateRoute>} />
               <Route path="/chinese/gym/public" element={<GymPublic language={CHINESE}/>} />
               <Route path="/english/gym/public" element={<GymPublic language={ENGLISH}/>} />
               <Route path="/exercise/edit" element={<PrivateRoute><Edit /></PrivateRoute>} />
               <Route path="/exercise" element={<PrivateRoute><LoadExercise /></PrivateRoute>} />
               <Route path="/own/exercise" element={<PrivateRoute><LoadOwnExercise /></PrivateRoute>} />
               <Route path="/exercise/public" element={<ExercisePublic />} />
               
               <Route path="/chinese/vocabulary" element={<PrivateRoute><GameVocaCn /></PrivateRoute>} />
               <Route path="/chinese/wordorder" element={<PrivateRoute><GameWordOrderCn /></PrivateRoute>} />
               <Route path="/english/vocabulary" element={<PrivateRoute><GameVocaEng /></PrivateRoute>} />
               <Route path="/english/wordorder" element={<PrivateRoute><GameWordOrderEng /></PrivateRoute>} />
               <Route path="/signup" element={<SignupPage />} />
               <Route path="/login" element={<LoginPage language={language} setLanguage={setLanguage} />} />
               <Route path="/logout" element={<LogoutPage />} />
               <Route path="/about" element={<About />} />
               <Route path="/home" element={<Home />} />
               <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
               <Route path="/" element={<Home />} />
               <Route path="*" element={<Home />} />
            </Routes>
            <Footer />
         </div>
      </div>
   </BrowserRouter>
};

export default App;