import '../css/Table.css'
import { useState } from 'react';
import { useEffect } from 'react';

const Table = () => {


    const [skip, setSkip] = useState(0)
    const [reservation, setReservation] = useState([])

    // Get days of week and display them in tab

    const getFullWeek = (d: any, dayOfWeek: number, daySkipper: number)=> {
        d = new Date(d);
        const day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6:dayOfWeek + daySkipper); // adjust when day is sunday
            new Date(d.setDate(diff));
    
            let date = d.getDate();
            let month = d.getMonth(); 
            let year = d.getFullYear();
    
            const monthNames = [
                "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
            ];
            
            const daysOfWeek = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
            
            const dateWithFullMonthName = daysOfWeek[d.getDay()] + " " + date + " " + monthNames[month] + " " + year
    
            let formatForReservation = year + '-' + ('0' + (month + 1)).slice(-2) + '-' + ('0' + date).slice(-2);
    
            return {
              dateWithFullMonthName,
              day: daysOfWeek[d.getDay()] + " " + date,
              month: monthNames[month] + " " + year,
              formatForReservation
            };
        
      };

    let monday = getFullWeek(new Date(), 1, skip);
    let tuesday = getFullWeek(new Date(), 2, skip);
    let wednesday = getFullWeek(new Date(), 3, skip);
    let thursday = getFullWeek(new Date(), 4, skip);
    let friday = getFullWeek(new Date(), 5, skip);

    let accessToken = localStorage.getItem('accessToken')

    // Get reservations for connected user and show them in table

    const reservationFetch = (skipParam: any) => {
        fetch(`http://localhost:5050/api/reservation/user/${getFullWeek(new Date(), 1, skip + skipParam).formatForReservation}&${getFullWeek(new Date(), 5, skip + skipParam).formatForReservation}`,  {
            method: "GET",
            mode: "cors",
            headers: {
            "Content-Type": "application/json",
            "x-auth-token": String(accessToken)
            }
        }).then( async (response) => {
            const data = await response.json()
            setReservation(data)
            console.log(data);
            data.forEach((info: any) => {
                const date = new Date(info.reservation_date)
                const dbDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
                const dbSchedule = info.reservation_schedule
                const tableBox: any = document.getElementById(dbDate+dbSchedule)
                
                if(tableBox) {
                    tableBox.innerHTML = "X"
                }
            })
        })
    }

    // Get reservation on page loading

    useEffect(() => {
        reservationFetch(0)
        const lastTableBox = document.getElementById(friday.formatForReservation + 'soir') as HTMLElement
        lastTableBox.style.borderBottomRightRadius = '19px'
    }, [])

    // Next week and previous week buttons

    const handleNextWeek = () => {
        setSkip(skip + 7)
        reservation.forEach((info: any) => {
            const date = new Date(info.reservation_date)
            const dbDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
            const dbSchedule = info.reservation_schedule
            const tableBox = document.getElementById(dbDate+dbSchedule)
            
            if(tableBox) {
                tableBox.innerHTML = ""
            }
        })
        reservationFetch(+7)
    }

    const handlePreviousWeek = () => {
        setSkip(skip - 7)
        reservation.forEach((info: any) => {
            const date = new Date(info.reservation_date)
            const dbDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
            const dbSchedule = info.reservation_schedule
            const tableBox = document.getElementById(dbDate+dbSchedule)
            
            if(tableBox) {
                tableBox.innerHTML = ""
            }
        })
        reservationFetch(-7)
    }

    return (
        <>

        <div id='reservation'>
        <div id='weekButton'>
            <button onClick={handlePreviousWeek} className='btn'>{'Semaine précédente <<'}</button>
            <h1>Semaine du {monday.dateWithFullMonthName} au {friday.dateWithFullMonthName}</h1>
            <button onClick={handleNextWeek} className='btn'>{'>> Semaine suivante'}</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>{monday.day}</th>
                    <th>{tuesday.day}</th>
                    <th>{wednesday.day}</th>
                    <th>{thursday.day}</th>
                    <th>{friday.day}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className='tdSchedule'>Matin</td>
                    <td id={monday.formatForReservation + 'matin'} className='reservationTd'></td>
                    <td id={tuesday.formatForReservation + 'matin'} className='reservationTd'></td>
                    <td id={wednesday.formatForReservation + 'matin'} className='reservationTd'></td>
                    <td id={thursday.formatForReservation + 'matin'} className='reservationTd'></td>
                    <td id={friday.formatForReservation + 'matin'} className='reservationTd'></td>
                </tr>
                <tr>
                    <td className='tdSchedule'>Midi</td>
                    <td id={monday.formatForReservation + 'midi'} className='reservationTd'></td>
                    <td id={tuesday.formatForReservation + 'midi'} className='reservationTd'></td>
                    <td id={wednesday.formatForReservation + 'midi'} className='reservationTd'></td>
                    <td id={thursday.formatForReservation + 'midi'} className='reservationTd'></td>
                    <td id={friday.formatForReservation + 'midi'} className='reservationTd'></td>
                </tr>
                <tr>
                    <td className='tdSchedule' id='lastTd'>Soir</td>
                    <td id={monday.formatForReservation + 'soir'} className='reservationTd'></td>
                    <td id={tuesday.formatForReservation + 'soir'} className='reservationTd'></td>
                    <td id={wednesday.formatForReservation + 'soir'} className='reservationTd'></td>
                    <td id={thursday.formatForReservation + 'soir'} className='reservationTd'></td>
                    <td id={friday.formatForReservation + 'soir'} className='reservationTd'></td>
                </tr>
            </tbody>
        </table>
        </div>
        </>
    )
}

export default Table