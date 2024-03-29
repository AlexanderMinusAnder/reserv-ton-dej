import React, { useEffect, useState } from 'react';
import Table from '../components/Table';
import Edit from '../components/Edit';
import axiosInstance from '../utils/axiosInstance';

const Reservation = () => {

    const [editing, setEditing] = useState(false)

    const [reservation, setReservation] = useState([])
    const [skip, setSkip] = useState(0)

    const reservationFetch = async () => {
        await axiosInstance.get('/api/reservation/from-logged-user')
        .then((response) => {
            const data: any = response.data
            setReservation(data)
        })
    }

    const updateEditing = (value: boolean) => {
        setEditing(value)
    }

    const handleSkip = (skipParam: number) => {
        setSkip(prev => prev + skipParam)
        reservation.forEach((info: any) => {
            const date = new Date(info.reservation_date)
            const dbDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
            const dbSchedule = info.reservation_schedule
            const tableBox: any = document.getElementById(dbDate+dbSchedule)

            if(tableBox) {
                if(editing) {
                    tableBox.checked = ""
                    tableBox.parentNode.style.background = ""
                } else {
                    tableBox.innerHTML = ""
                }
            }
        })

        if(editing) {
            const check = [...document.getElementsByClassName('reservationBox')]
            check.forEach((e: any) => {
                e.checked = ""
            })

            const scheduleCheck = [...document.getElementsByClassName('checkboxSchedule')]
            scheduleCheck.forEach((e: any) => {
                e.checked = ""
            })
        }
    }

    useEffect(() => {
        reservationFetch()
    }, [])
    

    return (
        <div>
            {!editing ? (
                <>
                    <Table updateEditing={updateEditing} reservation={reservation} handleSkip={handleSkip} skip={skip} editing={editing}></Table>
                </>
            ) : (
                <>
                    <Edit updateEditing={updateEditing} reservation={reservation} handleSkip={handleSkip} skip={skip} editing={editing} reservationFetch={reservationFetch}></Edit>
                </>
                
            )}
            
        </div>
    );
};

export default Reservation;