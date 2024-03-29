import '../css/Table.css'
import { useEffect } from 'react';
import timeManagement from '../utils/timeManagement'

const Table = (props: any) => {

    let monday = timeManagement(new Date(), 1, props.skip);
    let tuesday = timeManagement(new Date(), 2, props.skip);
    let wednesday = timeManagement(new Date(), 3, props.skip);
    let thursday = timeManagement(new Date(), 4, props.skip);
    let friday = timeManagement(new Date(), 5, props.skip);

    // Get reservations for connected user and show them in table

    const displayReservation = async () => {
        props.reservation.forEach((info: any) => {
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
        displayReservation()
        const lastTableBox = document.getElementById(friday.formatForReservation + 'soir') as HTMLElement
        lastTableBox.style.borderBottomRightRadius = '19px'
    }, [props.reservation, props.skip])

    return (
        <>

        <div id='reservation'>
        <div id='weekButton'>
            <button onClick={() => {props.handleSkip(-7)}} className='btn'>{'Semaine précédente <<'}</button>
            <h1>Semaine du {monday.dateWithFullMonthName} au {friday.dateWithFullMonthName}</h1>
            <button onClick={() => {props.handleSkip(+7)}} className='btn'>{'>> Semaine suivante'}</button>
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
        <div id='managingReservation'>
            <button className='btn' onClick={() => props.updateEditing(true)}>Gérer mes réservations</button>
        </div>
        </div>
        </>
    )
}

export default Table