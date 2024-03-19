import React, { useState } from 'react';
import Table from '../components/Table';
import Edit from '../components/Edit';

const Reservation = () => {

    const [editing, setEditing] = useState(false)

    return (
        <div>
            {!editing ? (
                <>
                    <Table></Table>
                    <div id='managingReservation'>
                        <button className='btn' onClick={() => {setEditing(true)}}>Gérer mes réservations</button>
                    </div>
                </>
            ) : (
                <>
                    <Edit></Edit>
                    <div id='managingReservation'>
                        <button className='btn' onClick={() => {setEditing(false)}}>Quitter sans sauvegarder</button>
                    </div>
                </>
                
            )}
            
        </div>
    );
};

export default Reservation;