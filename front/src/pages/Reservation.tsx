import React, { useEffect, useState } from 'react';
import Table from '../components/Table';
import Edit from '../components/Edit';
import axiosInstance from '../utils/axiosInstance';
import timeManagement from '../utils/timeManagement';

const Reservation = () => {

    const [editing, setEditing] = useState(false)

    const [reservation, setReservation] = useState([])
    const [skip, setSkip] = useState(0)

    const reservationFetch = async (skipParam: any) => {
        let response = await axiosInstance.get(`/api/reservation/user/${timeManagement(new Date(), 1, skip + skipParam).formatForReservation}&${timeManagement(new Date(), 5, skip + skipParam).formatForReservation}`)

        setReservation(response.data)
    }

    const updateEditing = (value: boolean) => {
        setEditing(value)
    }

    const handleSkip = (skipParam: number) => {
        setSkip(skip + skipParam)
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
        }

        reservationFetch(skipParam)
    }


    useEffect(() => {
        reservationFetch(0)
    }, [])

    return (
        <div>
            {!editing ? (
                <>
                    <Table updateEditing={updateEditing} reservation={reservation} handleSkip={handleSkip} skip={skip}></Table>
                </>
            ) : (
                <>
                    <Edit updateEditing={updateEditing} reservation={reservation} handleSkip={handleSkip} skip={skip} reservationFetch={reservationFetch}></Edit>
                </>
                
            )}
            
        </div>
    );
};

export default Reservation;