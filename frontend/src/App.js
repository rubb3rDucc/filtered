import './App.css';
import { useState } from 'react';
import Table from './components/Table';
import SongList from './components/SongList';

async function getUserAlbumNames(credentials) {
  return fetch('http://localhost:3000/db/getAllAlbumNames', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(data => data.json())
    .then(data => {
      return data;
    })
}

function App() {
  // get api results
  // show on screen
  // get value from dropdown
  // send value to db
  // return songs matching album selection 

  const [dataList, setDataList] = useState([]);
  const [selection, setSelection] = useState();
  const [songResults, setSongResults] = useState([]);

  const handleAlbumClick = async () => {
    let d = await getUserAlbumNames()
      .then((result) => { return result; })
      .catch((error) => {
        console.log(error);
      });
    setDataList(d);
  }

  const handleSelection = (event) => {
    setSelection(event.target.value);
  }

  const getSongsFromAlbumName = async (data) => {
    let payload = {
      'album_name': data.selection
    }

    console.log(payload);
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
    
    const response = await fetch('http://localhost:3000/db/getMatchingSongsAlbum', options);
    const jsonResponse = await response.json();
    
    // console.log(JSON.stringify(jsonResponse));
    // console.log(jsonResponse);
  
    setSongResults(jsonResponse);
    // return jsonResponse;
  };

  const submitHandler = (event) => {
    let input = { selection }
    getSongsFromAlbumName(input);
  };

  return (
    <div className="App">
      <button className="btn" onClick={handleAlbumClick} >
        Click here for Album Names
      </button>
      <div>
        <label for="album-select">Select an Album: </label>
        <select value={selection} onChange={handleSelection} id="album-select">
          {dataList.map((i, idx) =>
            <option index={idx} value={i.album_name}>
              {i.album_name}
            </option>
          )}
        </select>
        <p>{`I've selected ${selection == null ? "Nothing" : selection}`}</p>
        <button
          className="button is-link"
          onClick={submitHandler}
        >
          Search
        </button>
        <SongList list={songResults}/>
      </div>
      <Table />
      {/* <div className="App">

        <h1>Edit Rules</h1>
        <p>
          <input type="checkbox" id="matchForRule" />
          <label for="matchForRule">Match for the following rule:</label>
        </p>
        {/* if more than one rule */}

      {/* <p>
          <input type="checkbox" id="matchForRule" />
          Limit to
          <label for="matchForRule"></label>
          <input value="25" />
          <select name="appleMusicTypes" id="AppleMusicTypes">
            <option value="album-string">items</option>
            <option value="artist-string">minutes</option>
            <option value="artist-string">hours</option>
            <option value="year-numeric">MB</option>
            <option value="duration-numeric">GB</option>
          </select>
          selected by
          <select name="appleMusicTypes" id="AppleMusicTypes">
            <option value="album-string">random</option>
            <option value="artist-string">album</option>
            <option value="artist-string">hours</option>
            <option value="year-numeric">genre</option>
            <option value="duration-numeric">title</option>
          </select>
        </p> */}
      {/* <label for="objectType"></label>
        <input type="text" name="objectType" required minlength="4" maxlength="8" size="10" /> */}
      {/* <p>
          <select name="appleMusicTypes" id="AppleMusicTypes">
            <option value="album-string">album</option>
            <option value="artist-string">artist</option>
            <option value="year-numeric">year</option>
            <option value="duration-numeric">duration</option>
            <option value="genre-string">genre</option>
          </select>


          {/* string types */}
      {/* <select name="appleMusicStringFilterTypes" id="AppleMusicStringFilterTypes">
            <option value="contains">contains</option>
            <option value="does-not-contain">does not contain</option>
            <option value="is">is</option>
            <option value="is-not">is not</option>
            <option value="begins-with">begins with</option>
            <option value="ends-with">ends with</option>
          </select> */}

      {/* numeric types */}
      {/* <select name="appleMusicNumericFilterTypes" id="AppleMusicNumericFilterTypes">
            <option value="is">is</option>
            <option value="is-not">is not</option>
            <option value="begins-with">is greater than</option>
            <option value="begins-with">is less than</option>
            <option value="begins-with">is in the range</option>
          </select> */}

      {/* adding and deleting rules */}
      {/* <button type="button" id="delete">-</button>
          <button type="button" id="addMOre">+</button> */}
      {/* </p>  */}

      {/* <button type="button">Cancel</button>
        <button type="button">OK</button> */}

      {/* show potential playlist being updated in realtime as the rules change in webview */}
      {/* // <h2>Number of Songs Matching Criteria: 12 </h2> */}
      {/* <h2>Songs Found:</h2> */}
      {/* // </div>  */}
    </div>
  );
}

export default App;
