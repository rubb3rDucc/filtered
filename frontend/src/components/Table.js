import { useState } from "react"

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

export default function Table() {
    const [dataList, setDataList] = useState([]);
    const [selection, setSelection] = useState();
    const [songResults, setSongResults] = useState();


    const [rows, setRows] = useState([{}]);
    const columnsArray = ["Type", "Filter", "Item Data", "Add/Delete"];

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

    console.log(dataList);

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
        console.log(JSON.stringify(jsonResponse));
        setSongResults(JSON.stringify(jsonResponse));

        return jsonResponse;
    };

    const submitHandler = (event) => {
        let input = { selection }
        getSongsFromAlbumName(input);
    };

    const handleAddRow = () => {
        const item = {};
        setRows([...rows, item]);
    }

    const postResults = () => {
        console.log(rows);
    }

    const handleRemoveSpecificRow = (idx) => {
        const tempRows = [...rows];
        tempRows.splice(idx, 1);
        setRows(tempRows);
    }

    const updateState = (e) => {
        let prop = e.target.attributes.column.value;
        let index = e.target.attributes.index.value;
        let fieldValue = e.target.value;

        const tempRows = [...rows];
        const tempObject = rows[index];
        tempObject[prop] = fieldValue;


        tempRows[index] = tempObject;
        setRows(tempRows);
    };

    return (
        <>
            <h1>Rule Table</h1>

            <button onClick={handleAddRow} >
                Click Here to Add a New Rule
            </button>

            <table>
                <thead>
                    <tr>
                        {
                            columnsArray.map((column, index) => {
                                return (
                                    <th key={index}>
                                        {column}
                                    </th>
                                )
                            })}
                        {/* <th>Type</th>
                        <th>Filter</th>
                        <th>Item Data</th>
                        <th>Add/Delete</th> */}
                    </tr>
                </thead>
                <tbody>
                    {
                        rows.map((item, idx) => {
                            return (
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>
                                        {/* <label for="objectType"></label>
        <input type="text" name="objectType" required minlength="4" maxlength="8" size="10" /> */}
                                        <select name="appleMusicTypes" id="AppleMusicTypes">
                                            <option value="albums">album</option>
                                            {/* <option value="artist-string">artist</option> */}
                                            {/* <option value="year-numeric">year</option> */}
                                            {/* <option value="duration-numeric">duration</option> */}
                                            {/* <option value="genre-string">genre</option> */}
                                        </select>
                                    </td>
                                    <td>
                                        {/* string types */}
                                        <select name="appleMusicStringFilterTypes" id="AppleMusicStringFilterTypes">
                                            <option value="contains">contains</option>
                                            <option value="does-not-contain">does not contain</option>
                                            <option value="is">is</option>
                                            <option value="is-not">is not</option>
                                            <option value="begins-with">begins with</option>
                                            <option value="ends-with">ends with</option>
                                        </select>
                                    </td>
                                    <td>
                                        {/* Column Data loaded from database */}
                                        <div onClick={handleAlbumClick}>
                                        <select value={selection} onChange={handleSelection} id="album-select">
                                            {dataList.map((i, idx) =>
                                                <option index={idx} value={i.album_name}>
                                                    {i.album_name}
                                                </option>
                                            )}
                                        </select>
                                        </div>
                                    </td>
                                    <td>
                                        {/* adding and deleting rules */}
                                        <button
                                            id="delete"
                                            onClick={() => handleRemoveSpecificRow(idx)}
                                        >
                                            Remove
                                        </button>
                                        {/* <button type="button" id="delete">-</button> */}
                                        {/* <button type="button" id="addMOre">Add</button> */}
                                        <button onClick={handleAddRow} className="btn btn-primary">
                                            Add Row
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </>
    )
}