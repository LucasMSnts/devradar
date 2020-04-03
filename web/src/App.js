import React, { useState, useEffect } from 'react';
import api from './services/api';

import './global.css';
import './App.css';
import './SideBar.css';
import './Main.css';

import DevItem from './components/DevItem';
import DevForm from './components/DevForm';

//  Componente: Bloco isolado de HTML, CSS e JS, o qual não interfere no restante da aplicação
//  Propriedade: Informações que um componente PAI passa para o componente FILHO
//  Estado: Informações mantidas pelo componente (Lembrar: imutabilidade)

function App() {
  const editModeState = useState({editMode: false, dev: {}});
  const [devs, setDevs] = useState([]);
  const [{ editMode }] = editModeState;

  useEffect(() => {
    async function loadDevs() {
      const response = await api('/devs');

      setDevs(response.data);
    }

    loadDevs();
  }, []);

  async function handleAddDev(data) {
    const response = await api.post('/devs', data);
    if (!devs.reduce((res, dev) => res === true || dev._id === response.data._id)) { // evitar adicionar duplicatas
      setDevs([...devs, response.data]);
    }
  }

  async function handleEditDev(dev, data) {
    const { github_username } = dev;

    const newDevs = devs.map(async dev => {
      if (dev.github_username === github_username) {
        //console.log(`devs/${github_username}`, data);
        const response = await api.put(`devs/${github_username}`, data);
        if (response.data.modifiedCount > 0) {
          const newDev = await api.get(`devs/${github_username}`);
          return newDev.data;
        } else {
          return dev;
        }
      } else {
        return dev;
      }
    });
    (async () => {
      const resultado = await Promise.all(newDevs);
      setDevs(resultado);
    })()
  }

  async function handleDeleteDev(github_username) {
    await api.delete(`devs/${github_username}`);
    setDevs(devs.filter(dev => dev.github_username !== github_username));
  }

  return (
    <div id="app">
      <aside>
        <strong>{editMode ? 'Editar' : 'Cadastrar'}</strong>
        <DevForm onSubmit={handleAddDev} onEdit={handleEditDev} editModeState={editModeState} />
      </aside>

      <main>
        <ul>
          {devs.map(dev => (
            <DevItem key={dev._id} dev={dev} onEdit={editModeState} onDelete={handleDeleteDev} />
          ))}          
        </ul>
      </main>
    </div>
  );
}

export default App;
