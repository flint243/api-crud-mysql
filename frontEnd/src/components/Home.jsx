import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/');
                setData(response.data);
            } catch (err) {
                setError('Erreur lors du chargement des données.');
                console.error('Erreur lors du chargement des données:', err);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/delete/${id}`);
            setData(data.filter(item => item.id !== id)); // Mise à jour de l'état local
            navigate('/');
        } catch (err) {
            setError('Erreur lors de la suppression.');
            console.error('Erreur lors de la suppression:', err);
        }
    };

    const handleDeleteAll = async () => {
        try {
            await axios.delete('http://localhost:5000/deleteAll');
            setData([]); // Mise à jour de l'état local
        } catch (err) {
            setError('Erreur lors de la suppression.');
            console.error('Erreur lors de la suppression:', err);
        }
    };

    return (
        <div className='d-flex vh-100 bg-dark justify-content-center align-items-center'>
            <div className='w-75 bg-secondary rounded p-3'>
                <h2>Ma Liste</h2>
                {error && <p className='text-danger'>{error}</p>}
                <div className='d-flex justify-content-end mb-2'>
                    <Link to="/create" className='btn btn-success'>Créer +</Link>
                    {data.length >= 2 && ( // Affichez le bouton seulement si data a au moins 2 éléments
                        <button onClick={handleDeleteAll} className='btn btn-sm btn-danger mx-2'>
                            Tous supprimer
                        </button>
                    )}
                </div>
                {data.length > 0 ? (
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nom</th>
                                <th>Prénom</th>
                                <th>Age</th>
                                <th>Mes actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((crudTest) => (
                                <tr key={crudTest.id}>
                                    <td>{crudTest.id}</td>
                                    <td>{crudTest.nom}</td>
                                    <td>{crudTest.prenom}</td>
                                    <td>{crudTest.age}</td>
                                    <td>
                                        <Link to={`/read/${crudTest.id}`} className='btn btn-sm btn-info'>Lire</Link>
                                        <Link to={`/update/${crudTest.id}`} className='btn btn-sm btn-primary mx-2'>Modifier</Link>
                                        <button onClick={() => handleDelete(crudTest.id)} className='btn btn-sm btn-warning mx-2'>Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className='text-center'>Aucune donnée disponible</p>
                )}
            </div>
        </div>
    );
}
