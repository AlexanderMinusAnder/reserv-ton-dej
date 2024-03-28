import '../css/Table.css'
import { useState } from 'react';
import { useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import timeManagement from '../utils/timeManagement'

const Table = () => {

    const [skip, setSkip] = useState(0)
    const [reservation, setReservation] = useState([])

    let monday = timeManagement(new Date(), 1, skip);
    let tuesday = timeManagement(new Date(), 2, skip);
    let wednesday = timeManagement(new Date(), 3, skip);
    let thursday = timeManagement(new Date(), 4, skip);
    let friday = timeManagement(new Date(), 5, skip);

    // Get reservations for connected user and show them in table

    const reservationFetch = async (skipParam: any) => {
        let response = await axiosInstance.get(`/api/reservation/user/${timeManagement(new Date(), 1, skip + skipParam).formatForReservation}&${timeManagement(new Date(), 5, skip + skipParam).formatForReservation}`)

        setReservation(response.data)
        response.data.forEach((info: any) => {
            const date = new Date(info.reservation_date)
            const dbDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
            const dbSchedule = info.reservation_schedule
            const tableBox: any = document.getElementById(dbDate+dbSchedule)
                    
            if(tableBox) {
                tableBox.innerHTML = "X"
            }
        })
    }

    // Get reservation on page loading

    useEffect(() => {
        reservationFetch(0)
        const lastTableBox = document.getElementById(friday.formatForReservation + 'soir') as HTMLElement
        lastTableBox.style.borderBottomRightRadius = '19px'
    }, [])

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