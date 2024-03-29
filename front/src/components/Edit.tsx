import '../css/Edit.css'
import { useState } from 'react';
import { useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import timeManagement from '../utils/timeManagement';

const Edit = (props: any) => {

    let monday = timeManagement(new Date(), 1, props.skip);
    let tuesday = timeManagement(new Date(), 2, props.skip);
    let wednesday = timeManagement(new Date(), 3, props.skip);
    let thursday = timeManagement(new Date(), 4, props.skip);
    let friday = timeManagement(new Date(), 5, props.skip);

    // Get reservations for connected user and show them in table

    const [addReservation, setAddReservation] = useState<string[]>([])
    const [deleteReservation, setDeleteReservation] = useState<string[]>([])

    const [scheduleBox, setScheduleBox] = useState<string[]>([])

    const displayReservations = async () => {

        props.reservation.forEach((info: any) => {
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

            if(scheduleBox.length > 0) {
                scheduleBox.forEach((b: any) => {
                    const checkboxToCheck: any = document.getElementById(b)
                    if(checkboxToCheck) {
                        checkboxToCheck.checked = "checked"
                    }
                })
            }

            const checkbox = [...document.getElementsByClassName('reservationBox')]
            const matin: any = document.getElementById('matin' + monday.formatForReservation + ',' + friday.formatForReservation)
            const midi: any = document.getElementById('midi' + monday.formatForReservation + ',' + friday.formatForReservation)
            const soir: any = document.getElementById('soir' + monday.formatForReservation + ',' + friday.formatForReservation)

            checkbox.forEach((e: any) => {
                if(e.id.substring(0, 10) <= new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '-' + ('0' + new Date().getDate()).slice(-2)) {
                    e.hidden = true
                    matin.hidden = true
                    midi.hidden = true
                    soir.hidden = true
                } else {
                    e.hidden = false
                    matin.hidden = false
                    midi.hidden = false
                    soir.hidden = false
                }
            })
    }

    // Get reservation on page loading

    useEffect(() => {
        displayReservations()
        const lastTableBox = document.getElementById('lastbox') as HTMLElement
        lastTableBox.style.borderBottomRightRadius = '19px'
    }, [props.skip]) 

    // Get currently checked and unchecked box

    const handleCheck = (e: any) => {
   
        if(e.target.checked) {
            setAddReservation([...addReservation, e.target.id])

            props.reservation.forEach((info: any) => {
                const date = new Date(info.reservation_date)
                const dbDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
                const dbSchedule = info.reservation_schedule

                if(e.target.id === dbDate+dbSchedule) {
                    setAddReservation(addReservation.filter((f: any) => f !== e.target.id))
                }
                
            })
            setDeleteReservation(deleteReservation.filter((f: any) => f !== e.target.id))

        } else {

            props.reservation.forEach((info: any) => {
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



    const handleScheduleCheck = (id: string) => {
        let selected: any = []
        let unselected: any = []

        const box = [...document.getElementsByClassName("reservationTd")]

        const schedule: any = document.getElementById(id + monday.formatForReservation + ',' + friday.formatForReservation)

        if(schedule.checked) {
            setScheduleBox(prev => [...prev, schedule.id])
        } else {
            setScheduleBox(scheduleBox.filter((f: any) => {
                f !== schedule.id
            }))
        }

        box.forEach((e: any) => {
            if(schedule.checked && (e.children[0].id).includes(id)) {
                e.children[0].checked = "checked"
                selected.push(e.children[0].id)
                setAddReservation([...addReservation, ...selected])
            } else if((e.children[0].id).includes(id)) {
                e.children[0].checked = ""
                unselected.push(e.children[0].id)
                setAddReservation(addReservation.filter((f: any) => {
                    unselected.forEach((u: any) => {
                        f !== u
                    })
                }))

                props.reservation.forEach((info: any) => {
                    const date = new Date(info.reservation_date)
                    const dbDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
                    const dbSchedule = info.reservation_schedule
    
                    if(e.children[0].id === dbDate+dbSchedule) {
                        setDeleteReservation([...deleteReservation, ...unselected])
                    }
                })
            }
        })

    }

    useEffect(() => {
        console.log("add", addReservation)
        console.log("delete", deleteReservation)
        console.log(scheduleBox)
    }, [addReservation, deleteReservation, scheduleBox])

    const [loading, setLoading] = useState(false)

    const handleValidate = async () => {
        if(addReservation.length > 0) {
            addReservation.forEach(async i => {
                const date = i.substring(0, 10)
                const schedule = i.substring(10)
                await axiosInstance.post('/api/reservation/create', {'reservation_date': date, 'reservation_schedule': schedule})
                .catch((err) => {
                    console.log(err)
                    if(err.request.responseText) {
                        return alert((err.request.responseText).substring(10, 81))
                    }
                    return err.message
                })
            })
        }

        if(deleteReservation.length > 0) {
            deleteReservation.forEach( async i => {
                const date = i.substring(0, 10)
                const schedule = i.substring(10)
                await axiosInstance.delete('/api/reservation/cancel', { data: { 'reservation_date': date, 'reservation_schedule': schedule }})
                .catch(err => {
                    console.log(err)
                    if(err.request.responseText) {
                        return alert((err.request.responseText).substring(10, 81))
                    }
                    return err.message
                })
            })
        }
        
        alert("Vos modifications ont bien été prises en compte.")
        setLoading(true)
        setTimeout(() => {
            window.location.reload()
        }, 500)
    }

    return (
        <>
        {loading ? (
            <div id='reservation'>
                <h1>Loading...</h1>
            </div>
        ) : (
            <>
                <div id='reservation'>
                    <div id='weekButton'>
                        <button onClick={() => { props.handleSkip(-7) }} className='btn'>{'Semaine précédente <<'}</button>
                        <h1>Semaine du {monday.dateWithFullMonthName} au {friday.dateWithFullMonthName}</h1>
                        <button onClick={() => { props.handleSkip(7) }} className='btn'>{'>> Semaine suivante'}</button>
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
                        <td className='tdSchedule'>Matin<input type='checkbox' id={'matin' + monday.formatForReservation + ',' + friday.formatForReservation} title='Cocher automatiquement toutes les cases du matin pour la semaine en cours' className='checkboxSchedule' onChange={() => {handleScheduleCheck("matin")}}></input></td>
                        <td className='reservationTd' ><input type='checkbox' title='Cochez la case pour réserver, décochez la pour annuler une réservation' id={monday.formatForReservation + 'matin'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                        <td className='reservationTd' ><input type='checkbox' title='Cochez la case pour réserver, décochez la pour annuler une réservation' id={tuesday.formatForReservation + 'matin'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                        <td className='reservationTd' ><input type='checkbox' title='Cochez la case pour réserver, décochez la pour annuler une réservation' id={wednesday.formatForReservation + 'matin'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                        <td className='reservationTd' ><input type='checkbox' title='Cochez la case pour réserver, décochez la pour annuler une réservation' id={thursday.formatForReservation + 'matin'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                        <td className='reservationTd' ><input type='checkbox' title='Cochez la case pour réserver, décochez la pour annuler une réservation' id={friday.formatForReservation + 'matin'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                    </tr>
                    <tr>
                        <td className='tdSchedule'>Midi<input type='checkbox' id={'midi' + monday.formatForReservation + ',' + friday.formatForReservation} title='Cocher automatiquement toutes les cases du midi pour la semaine en cours'  className='checkboxSchedule' onChange={() => {handleScheduleCheck("midi")}}></input></td>
                        <td className='reservationTd' ><input type='checkbox' title='Cochez la case pour réserver, décochez la pour annuler une réservation' id={monday.formatForReservation + 'midi'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                        <td className='reservationTd' ><input type='checkbox' title='Cochez la case pour réserver, décochez la pour annuler une réservation' id={tuesday.formatForReservation + 'midi'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                        <td className='reservationTd' ><input type='checkbox' title='Cochez la case pour réserver, décochez la pour annuler une réservation' id={wednesday.formatForReservation + 'midi'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                        <td className='reservationTd' ><input type='checkbox' title='Cochez la case pour réserver, décochez la pour annuler une réservation' id={thursday.formatForReservation + 'midi'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                        <td className='reservationTd' ><input type='checkbox' title='Cochez la case pour réserver, décochez la pour annuler une réservation' id={friday.formatForReservation + 'midi'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                    </tr>
                    <tr>
                        <td className='tdSchedule' id='lastTd'>Soir<input type='checkbox' id={'soir' + monday.formatForReservation + ',' + friday.formatForReservation} title='Cocher automatiquement toutes les cases du soir pour la semaine en cours'  className='checkboxSchedule' onChange={() => {handleScheduleCheck("soir")}}></input></td>
                        <td className='reservationTd' ><input type='checkbox' title='Cochez la case pour réserver, décochez la pour annuler une réservation' id={monday.formatForReservation + 'soir'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                        <td className='reservationTd' ><input type='checkbox' title='Cochez la case pour réserver, décochez la pour annuler une réservation' id={tuesday.formatForReservation + 'soir'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                        <td className='reservationTd' ><input type='checkbox' title='Cochez la case pour réserver, décochez la pour annuler une réservation' id={wednesday.formatForReservation + 'soir'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                        <td className='reservationTd' ><input type='checkbox' title='Cochez la case pour réserver, décochez la pour annuler une réservation' id={thursday.formatForReservation + 'soir'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                        <td className='reservationTd' id='lastbox'><input type='checkbox' title='Cochez la case pour réserver, décochez la pour annuler une réservation'  id={friday.formatForReservation + 'soir'} className="reservationBox" onChange={(e) => {handleCheck(e)}}></input></td>
                    </tr>
                </tbody>
            </table>
            <div id='managingReservation'>
                <button className='btn' onClick={() => {handleValidate()}}>Valider mes réservations</button>
                <button className='btn' onClick={() => props.updateEditing(false)}>Quitter sans sauvegarder</button>
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
        )}
        
        </>
    )
}

export default Edit