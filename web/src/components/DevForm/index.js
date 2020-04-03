import React, { useState, useEffect } from 'react';

function DevForm({ onSubmit, onEdit, editModeState }) {
  const [{editMode, dev}, setEditMode] = editModeState;
  const [github_username, setGithubUsername] = useState('');
  const [techs, setTechs] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    if(!editMode) { // Localização de cadastro dev
      setGithubUsername('');
      setTechs('');
      navigator.geolocation.getCurrentPosition( // Pegar a localização do usuario
        (position) => { // Caso de sucesso
          const { latitude, longitude } = position.coords;

          // HTML comum
          // document.getElementById('latitude').value = latitude;

          setLatitude(latitude);
          setLongitude(longitude);
        }, 
        (err) => { // Caso de erro
          console.log(err);
        },
        { // Parametros
          timeout: 30000,
        }
      );
    } else { // Localização de edição dev
      const { github_username, techs, location: { coordinates: [latitude, longitude]} } = dev;
      setGithubUsername(github_username);
      setTechs(techs.join(", "));
      setLatitude(latitude);
      setLongitude(longitude);
    }
  }, [editMode, dev]);

  async function handleSubmit(e) {
    e.preventDefault();
    
    if(editMode) {
      await onEdit(dev, {
        techs,
        latitude,
        longitude,
      })
      setEditMode({editMode: false, dev: {}});
    } else {
      await onSubmit({
        github_username,
        techs,
        latitude,
        longitude
      });
      setGithubUsername('');
      setTechs('');
    }

    setGithubUsername('');
    setTechs('');
  }

  return (
      <form onSubmit={handleSubmit}>
        <div className="input-block">
          <label htmlFor="github_username">Usuário do Github</label>
          <input 
            name="github_username" 
            id="github_username" 
            required
            value={github_username}
            disabled={editMode}
            onChange={e => setGithubUsername(e.target.value)} 
          />
        </div>
        <div className="input-block">
          <label htmlFor="techs">Tecnologias</label>
            <input 
              name="techs" 
              id="techs" 
              required 
              value={techs}
              onChange={e => setTechs(e.target.value)} 
            />
        </div>

        <div className="input-group">
          <div className="input-block">
            <label htmlFor="latitude">Latitude</label>
            <input 
              type="number" 
              name="latitude" 
              id="latitude" 
              required 
              value={latitude}
              onChange={e => setLatitude(e.target.value)} 
            />
          </div>

          <div className="input-block">
            <label htmlFor="longitude">Longitude</label>
            <input 
              type="number" 
              name="longitude" 
              id="longitude" 
              required 
              value={longitude} 
              onChange={e => setLongitude(e.target.value)}
            />
          </div>
        </div>

        <button type="submit">Salvar</button>
      </form>
    );
}

export default DevForm;