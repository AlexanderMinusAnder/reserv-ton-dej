import React, { useEffect } from 'react';
import '../css/Home.css'
import Login from '../components/Login';

const Home = () => {

    useEffect(() => {

        if(localStorage.getItem('accessToken') && String(window.location.href).substring(21) === "/") {
            window.location.href = "/reservation"
        }
    }, [])

    return (
        <>
        
        <div id="welcoming">
          <h2>Bienvenu sur Réserve ton dej'</h2>
          <p>L'application pratique pour gérer ses réservations de repas</p>
          <p>Pour vous connecter, utilisez le formulaire ci-dessous</p>
          </div>
          <Login></Login>
          <div id="helping">
            <p id="passwordWarn">⚠️ Si vous vous connectez pour la première fois, changez votre mot de passe dans la partie "Mon profil" une fois connecté ⚠️</p>
            <h3>Élève</h3>
            <p>Pour vous connecter, utilisez votre identifiant fournis par votre école</p>
          </div>
          <div id="helping">
            <h3>Administrateur ou responsable de cuisine</h3>
            <p>Pour vous connecter, utilisez votre identifiant fournis par le développeur de l'application</p>
          </div>
        </>
    );
};

export default Home;