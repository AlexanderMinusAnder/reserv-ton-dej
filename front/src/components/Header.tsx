import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Header.css'

const Header = () => {
  const [disableReservation, setDisableReservation] = useState(false)
  const [disableProfile, setDisableProfile] = useState(false)

  const accessToken = localStorage.getItem('accessToken')

  const handleDisconnecting = () => {
    window.location.replace('/')
    localStorage.removeItem('accessToken')
  }
  
  const handlePageNavigation = (page: string) => {
    window.location.href = page
  }

  useEffect(() => {

    if(accessToken) {
      if(String(window.location.href).substring(21) === "/reservation") {
        setDisableReservation(true)
        const buttonForReservation = document.getElementById('reservationBtn') as HTMLElement
        buttonForReservation.className = "currentPageNavbarBtn"
      }   else if (String(window.location.href).substring(21) === "/profile") {
        setDisableProfile(true)
        const buttonForProfileInfo = document.getElementById('profileBtn') as HTMLElement
        buttonForProfileInfo.className = "currentPageNavbarBtn"
      }
    }
  }, [])

  return (
    <>
      {!accessToken ? (
        <div id='header'>
          <div id='title'>
            <h1>Réserve ton dej'</h1>
          </div>
        </div>
      ) : (
        <div id='header'>
          <div id='logged'>
            <h1>Réserve ton dej'</h1>
          </div>
          <div id="btnLogged">
              {/* <Link to="/reservation"><button className='navbarBtn' id='reservationBtn' disabled={disableReservation}>Mes Réservations</button></Link>
              <Link to="/profile"><button className='navbarBtn' id='profileBtn' disabled={disableProfile}>Mon Profil</button></Link> */}
            <button className='navbarBtn' id='reservationBtn' disabled={disableReservation} onClick={() => {handlePageNavigation("/reservation")}}>Mes Réservations</button>
            <button className='navbarBtn' id='profileBtn' disabled={disableProfile} onClick={() => {handlePageNavigation("/profile")}}>Mon Profil</button>
            <button className='navbarBtn' onClick={handleDisconnecting}>Se déconnecter</button>
          </div>
        </div>
      )}
    </>
  )
};

export default Header;