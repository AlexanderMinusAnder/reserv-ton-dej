import '../css/Edit.css'
import { useState } from 'react';
import { useEffect } from 'react';

const Edit = () => {


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

        
    const [addReservation, setAddReservation] = useState<string[]>([])
    const [deleteReservation, setDeleteReservation] = useState<string[]>([])


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

            data.forEach((info: any) => {
                const date = new Date(info.reservation_date)
                const dbDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
                const dbSchedule = info.reservation_schedule
                const tableBox: any = document.getElementById(dbDate+dbSchedule)
                
                if(tableBox && !deleteReservation.includes(tableBox.id)) {
                    tableBox.parentNode.style.background = "#d5edfa"
                    tableBox.checked = true
                }
            })

            if(addReservation.length > 0) {
                addReservation.forEach((e: any) => {
                    const checkbox: any = [...document.getElementsByClassName("reservationBox")]
                    checkbox.forEach((b: any) => {
                        if (b.id === e) {
                            b.checked = "checked"
                        }
                    })
                })
            }

            if(deleteReservation.length > 0) {
                addReservation.forEach((e: any) => {
                    const checkbox: any = [...document.getElementsByClassName("reservationBox")]
                    checkbox.forEach((b: any) => {
                        if (b.id === e) {
                            b.checked = ""
                        }
                    })
                })
            }

            const checkbox = [...document.getElementsByClassName('reservationBox')]

            checkbox.forEach((e: any) => {
                if(e.id.substring(0, 10) <= new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '-' + ('0' + new Date().getDate()).slice(-2)) {
                    e.hidden = true
                } else {
                    e.hidden = false
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

    // Get currently checked and unchecked box

    const handleCheck = (e: any) => {

        if(e.target.checked) {
            setAddReservation([...addReservation, e.target.id])

            reservation.forEach((info: any) => {
                const date = new Date(info.reservation_date)
                const dbDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
                const dbSchedule = info.reservation_schedule

                if(e.target.id === dbDate+dbSchedule) {
                    setAddReservation(addReservation.filter((f: any) => f !== e.target.id))
                }
                
            })
            setDeleteReservation(deleteReservation.filter((f: any) => f !== e.target.id))

        } else {

            reservation.forEach((info: any) => {
                const date = new Date(info.reservation_date)
                const dbDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
                const dbSchedule = info.reservation_schedule

                if(e.target.id === dbDate+dbSchedule) {
                    setDeleteReservation([...deleteReservation, e.target.id])
                }
            })
            setAddReservation(addReservation.filter((f: any) => f !== e.target.id))
            
        }
    }

    const handleValidate = () => {
        addReservation.forEach(i => {
            const date = i.substring(0, 10)
            const schedule = i.substring(10)
            fetch(`http://localhost:5050/api/reservation/create`,  {
            method: "POST",
            mode: "cors",
            headers: {
            "Content-Type": "application/json",
            "x-auth-token": String(accessToken)
            },
            body: JSON.stringify({
                'reservation_date': date,
                'reservation_schedule': schedule
            })
            }).then( async (response) => {
                const data: any = await response.json()
            })
        })

        deleteReservation.forEach(i => {
            const date = i.substring(0, 10)
            const schedule = i.substring(10)
            fetch(`http://localhost:5050/api/reservation/cancel`,  {
            method: "DELETE",
            mode: "cors",
            headers: {
            "Content-Type": "application/json",
            "x-auth-token": String(accessToken)
            },
            body: JSON.stringify({
                'reservation_date': date,
                'reservation_schedule': schedule
            })
            }).then( async (response) => {
                const data = await response.json()
            })
        })

        alert("Vos modifications ont bien été prises en compte.")
        window.location.reload()
    
    }

    // Next week and previous week buttons

    const handleSkip = (skipParam: number) => {
        setSkip(skip + skipParam)
        reservation.forEach((info: any) => {
            const date = new Date(info.reservation_date)
            const dbDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
            const dbSchedule = info.reservation_schedule
            const tableBox: any = document.getElementById(dbDate+dbSchedule)

            if(tableBox) {
                tableBox.checked = ""
                tableBox.parentNode.style.background = ""
            }
        })

        const check = [...document.getElementsByClassName('reservationBox')]
        check.forEach((e: any) => {
            e.checked = ""
        })

        reservationFetch(skipParam)
    }

    return (
        <>

        <div id='reservation'>
        <div id='weekButton'>
            <button onClick={() => { handleSkip(-7) }} className='btn'>{'Semaine précédente <<'}</button>
            <h1>Semaine du {monday.dateWithFullMonthName} au {friday.dateWithFullMonthName}</h1>
            <button onClick={() => { handleSkip(7) }} className='btn'>{'>> Semaine suivante'}</button>
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
                    <td className='reservationTd' ><input type='checkbox' id={monday.formatForReservation + 'matin'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                    <td className='reservationTd' ><input type='checkbox' id={tuesday.formatForReservation + 'matin'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                    <td className='reservationTd' ><input type='checkbox' id={wednesday.formatForReservation + 'matin'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                    <td className='reservationTd' ><input type='checkbox' id={thursday.formatForReservation + 'matin'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                    <td className='reservationTd' ><input type='checkbox' id={friday.formatForReservation + 'matin'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                </tr>
                <tr>
                    <td className='tdSchedule'>Midi</td>
                    <td className='reservationTd' ><input type='checkbox' id={monday.formatForReservation + 'midi'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                    <td className='reservationTd' ><input type='checkbox' id={tuesday.formatForReservation + 'midi'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                    <td className='reservationTd' ><input type='checkbox' id={wednesday.formatForReservation + 'midi'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                    <td className='reservationTd' ><input type='checkbox' id={thursday.formatForReservation + 'midi'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                    <td className='reservationTd' ><input type='checkbox' id={friday.formatForReservation + 'midi'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                </tr>
                <tr>
                    <td className='tdSchedule' id='lastTd'>Soir</td>
                    <td className='reservationTd' ><input type='checkbox' id={monday.formatForReservation + 'soir'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                    <td className='reservationTd' ><input type='checkbox' id={tuesday.formatForReservation + 'soir'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                    <td className='reservationTd' ><input type='checkbox' id={wednesday.formatForReservation + 'soir'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                    <td className='reservationTd' ><input type='checkbox' id={thursday.formatForReservation + 'soir'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                    <td className='reservationTd' ><input type='checkbox' id={friday.formatForReservation + 'soir'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                </tr>
            </tbody>
        </table>
        <div id='managingReservation'>
            <button className='btn' onClick={() => {handleValidate()}}>Valider mes réservations</button>
        </div>
        
        <div>
            <h2>Réservations ajoutées</h2>
            <ul>
                {addReservation.map(e => {
                    return (
                        <li key={e}>Réservation pour le {e.substring(0, 10)}, repas du {e.substring(10)}</li>
                    )
                })}
            </ul>
        </div>
        <div>
            <h2>Réservations annulées</h2>
            <div>
            <ul>
                {deleteReservation.map(e => {
                    return (
                        <li key={e}>Annulation pour le {e.substring(0, 10)}, repas du {e.substring(10)}</li>
                    )
                })}
            </ul>
            </div>
        </div>

        <div>
            <p>Pour prendre une réservation, cochez la case correspondant au jour et à l'horaire de votre choix, puis validez</p>
            <p>Pour annuler une réservation prise précédemment, décochez la case cochée automatiquement à la date et l'horaire de votre réservation, puis validez</p>
            <p>Les cases cochés par défaut avec un arrière plan foncé représente les réservations faites précédemment</p>
        </div>
        </div>
        </>
    )
}

export default Edit