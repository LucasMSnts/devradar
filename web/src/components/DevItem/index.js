import React from 'react';
import { FiTrash2, FiEdit } from 'react-icons/fi';

import './styles.css';

function DevItem({ dev, onEdit, onDelete }) {
    const [{editMode, dev: oldDev}, setEditMode] = onEdit;

    function editDev(){
        setEditMode({editMode:
                (oldDev._id !== dev._id) ? true : !editMode, // Se selecionou um Dev diferente, obrigatoriamente editMode deve ser true.
                dev // Novo dev
        });
    }

    function deleteDev(){
        onDelete(dev.github_username);
    }

    return (
        <li className="dev-item">
            <header>
                <img src={dev.avatar_url} alt={dev.name} />
                <div className="user-info">
                  <strong>{dev.name}</strong>
                  <span>{dev.techs.join(', ')}</span>
                </div>
                <div className="icons" >
                    <button onClick={editDev}>
                        <FiEdit size={16} color="#6931ca"/>
                    </button>
                    
                    <button onClick={deleteDev}>
                        <FiTrash2 size={16} color="#6931ca"/>
                    </button>
                </div>
            </header>
            <p>{dev.bio}</p>
            <a href={`https://github.com/${dev.github_username}`}>Acessar perfil no github</a>
        </li>
    );
}

export default DevItem;