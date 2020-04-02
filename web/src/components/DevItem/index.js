import React from 'react';
import { FiTrash2, FiEdit } from 'react-icons/fi';

import './styles.css';

function DevItem({ dev }) {
    return (
        <li className="dev-item">
            <header>
                <img src={dev.avatar_url} alt={dev.name} />
                <div className="user-info">
                  <strong>{dev.name}</strong>
                  <span>{dev.techs.join(', ')}</span>
                </div>
                <div className="icons" >
                    <button>
                        <FiEdit size={16} color="#6931ca"/>
                    </button>
                    
                    <button>
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