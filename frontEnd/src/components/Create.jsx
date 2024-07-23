import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Create() {
    const [values, setValues] = useState({ nom: '', prenom: '', age: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/;
        const ageRegex = /^[0-9]{1,3}$/;

        if (!nameRegex.test(values.nom)) {
            setError('Le nom est invalide. Il doit contenir entre 2 et 50 caractères alphabétiques.');
            return false;
        }
        if (!nameRegex.test(values.prenom)) {
            setError('Le prénom est invalide. Il doit contenir entre 2 et 50 caractères alphabétiques.');
            return false;
        }
        if (!ageRegex.test(values.age)) {
            setError('L\'âge est invalide. Il doit être un nombre entre 0 et 999.');
            return false;
        }
        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            axios.post('http://localhost:5000/crudTest', values)
                .then(() => {
                    navigate('/');
                })
                .catch((err) => {
                    setError('Erreur lors de l\'ajout des données.');
                    console.error(err);
                });
        }
    };

    return (
        <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
                <div className='w-50 bg-secondary rounded p-3'>
            <h1>Créer une nouvelle entrée</h1>
            <form onSubmit={handleSubmit}>
                <div className='mb-2'>
                    <label>Nom</label>
                    <input type="text" name="nom" value={values.nom} onChange={handleChange} className='form-control' />
                </div>
                <div className='mb-2'>
                    <label>Prénom</label>
                    <input type="text" name="prenom" value={values.prenom} onChange={handleChange} className='form-control' />
                </div>
                <div className='mb-2'>
                    <label>Âge</label>
                    <input type="text" name="age" value={values.age} onChange={handleChange} className='form-control' />
                </div>
                <button className='btn btn-success' type="submit">Créer</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    </div>
    );
}

export default Create;
