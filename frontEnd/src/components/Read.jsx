import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function Read() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:5000/read/${id}`)
            .then(res => setData(res.data))
            .catch(err => setError('Erreur lors de la récupération des données.'));
    }, [id]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div className='d-flex vh-100 bg-dark justify-content-center align-items-center'>
            <div className='w-20 bg-secondary rounded p-3'>
                <h2 className='text-decoration-underline'>Détails de l'entrée</h2>
                <p><span className='fw-bold'>Nom:</span> {data.nom}</p>
                <p><span className='fw-bold'>Prénom:</span> {data.prenom}</p>
                <p><span className='fw-bold'>Âge:</span> {data.age}</p>
                <div>
                <Link to={'/'} className='btn btn-primary'>Home</Link>
            </div>
            </div>
            
        </div>
    );
}

export default Read;
