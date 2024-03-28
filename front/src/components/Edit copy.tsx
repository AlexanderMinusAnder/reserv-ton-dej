import '../css/Edit.css'
import { useState } from 'react';
import { useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import timeManagement from '../utils/timeManagement';

const Edit = (updateEditing: any) => {

    const [skip, setSkip] = useState(0)
    const [reservation, setReservation] = useState([])

    let monday = timeManagement(new Date(), 1, skip);
    let tuesday = timeManagement(new Date(), 2, skip);
    let wednesday = timeManagement(new Date(), 3, skip);
    let thursday = timeManagement(new Date(), 4, skip);
    let friday = timeManagement(new Date(), 5, skip);

    // Get reservations for connected user and show them in table

    const [addReservation, setAddReservation] = useState<string[]>([])
    const [deleteReservation, setDeleteReservation] = useState<string[]>([])

    const reservationFetch = async (skipParam: any) => {
        await axiosInstance.get(`/api/reservation/user/${timeManagement(new Date(), 1, skip + skipParam).formatForReservation}&${timeManagement(new Date(), 5, skip + skipParam).formatForReservation}`)
        .then((response: any) => {

            setReservation(response.data)

            response.data.forEach((info: any) => {
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
                deleteReservation.forEach((e: any) => {
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
        .catch((err: any) => {
            console.log(err)
        })

    }

    // Get reservation on page loading

    useEffect(() => {
        reservationFetch(0)
        const lastTableBox = document.getElementById('lastbox') as HTMLElement
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
        addReservation.forEach(async i => {
            const date = i.substring(0, 10)
            const schedule = i.substring(10)
            await axiosInstance.post('/api/reservation/create', {'reservation_date': date, 'reservation_schedule': schedule})
            .then(() => {console.log("reservation effectuée")})
            .catch(err => [console.log(err)])
        })

        deleteReservation.forEach( async i => {
            const date = i.substring(0, 10)
            const schedule = i.substring(10)
            await axiosInstance.delete('/api/reservation/cancel', { data: { 'reservation_date': date, 'reservation_schedule': schedule }})
            .then(() => {console.log("reservation annulée")})
            .catch(err => [console.log(err)])
        })

        alert("Vos modifications ont bien été prises en compte.")
        updateEditing.updateEditing(false)
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
                    <td className='reservationTd' id='lastbox'><input type='checkbox' id={friday.formatForReservation + 'soir'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                </tr>
            </tbody>
        </table>
        <div id='managingReservation'>
            <button className='btn' onClick={() => {handleValidate()}}>Valider mes réservations</button>
            <button className='btn' onClick={() => updateEditing.updateEditing(false)}>Quitter sans sauvegarder</button>
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