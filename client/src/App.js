// /client/App.js
import React, { Component } from 'react';
import axios from 'axios';
import { breakStatement } from '@babel/types';

class App extends Component {
    state = {
        data: [],
        id: 0,
        message: null,
        intervalIsSet: false,
        idToDelete: null,
        MDBidToDelete: null,
        idToUpdate: null,
        objectToUpdate: null,
    };
    componentDidMount() {
        this.getDataFromDb();
        if (!this.state.intervalIsSet) {
            let interval = setInterval(this.getDataFromDb, 1000);
            this.setState({ intervalIsSet: interval });
        }
    }
    componentWillUnmount() {
        if (this.state.intervalIsSet) {
            clearInterval(this.state.intervalIsSet);
            this.setState({ intervalIsSet: null });
        }
    }
    getDataFromDb = () => {
        fetch('http://localhost:3001/api/getData')
            .then((data) => data.json())
            .then((res) => this.setState({ data: res.data }));
    };
    putDataToDB = (vorname, nachname, geschlecht, strasse, postleitzahl, ort) => {
        let currentIds = this.state.data.map((data) => data.id);
        let idToBeAdded = 0;
        while (currentIds.includes(idToBeAdded)) {
            ++idToBeAdded;
        }

        axios.post('http://localhost:3001/api/putData', {
            id: idToBeAdded,
            vorname: vorname,
            nachname: nachname,
            geschlecht: geschlecht,
            strasse: strasse,
            postleitzahl: postleitzahl,
            ort: ort

        });
    };
    deleteFromDB = (idTodelete) => {
        let objIdToDelete = null;
        if (idTodelete.match(/[a-z]/i)) {
            objIdToDelete = idTodelete;
        }
        else if (idTodelete.match("[0-9]+")) {
            parseInt(idTodelete);
            this.state.data.forEach((dat) => {
                if (dat.id == idTodelete) {
                    objIdToDelete = dat._id;
                }
            });
        }

        axios.delete('http://localhost:3001/api/deleteData', {
            data: {
                id: objIdToDelete,
            },
        });


    };
    updateDB = (idToUpdate, updateToApplyVN, updateToApplyNN, updateToApplyG, updateToApplyS, updateToApplyP, updateToApplyO) => {
        let objIdToUpdate = null;
        if (idToUpdate.match(/[a-z]/i)) {
            objIdToUpdate = idToUpdate;
        }
        else if (idToUpdate.match("[0-9]+"))
        {
            parseInt(idToUpdate);
            this.state.data.forEach((dat) => {
                if (dat.id == idToUpdate) {
                    objIdToUpdate = dat._id;
                }
            });
        }


        if (updateToApplyVN != null && updateToApplyVN != "") {
            axios.post('http://localhost:3001/api/updateData', {
                id: objIdToUpdate,
                update: { vorname: updateToApplyVN },
            });
        }
        if (updateToApplyNN != null && updateToApplyNN != "") {
            axios.post('http://localhost:3001/api/updateData', {
                id: objIdToUpdate,
                update: { nachname: updateToApplyNN },
            });
        }
        if (updateToApplyG != null && updateToApplyG != "") {
            axios.post('http://localhost:3001/api/updateData', {
                id: objIdToUpdate,
                update: { geschlecht: updateToApplyG },
            });
        } if (updateToApplyS != null && updateToApplyS != "") {
            axios.post('http://localhost:3001/api/updateData', {
                id: objIdToUpdate,
                update: { strasse: updateToApplyS },
            });
        } if (updateToApplyP != null && updateToApplyP != "") {
            axios.post('http://localhost:3001/api/updateData', {
                id: objIdToUpdate,
                update: { postleitzahl: updateToApplyP },
            });
        } if (updateToApplyO != null && updateToApplyO != "") {
            axios.post('http://localhost:3001/api/updateData', {
                id: objIdToUpdate,
                update: { ort: updateToApplyO },
            });
        };
    }
    clicked = (param: String) => {
        switch (param) {
            case "add":
                if (document.getElementById("addDiv").hidden) {
                    document.getElementById("addDiv").hidden = false;
                } else {
                    document.getElementById("addDiv").hidden = true;
                }
                break;
            case "del":
                if (document.getElementById("delDiv").hidden) {
                    document.getElementById("delDiv").hidden = false;
                } else {
                    document.getElementById("delDiv").hidden = true;
                }
                break;
            case "update":
                if (document.getElementById("updateDiv").hidden) {
                    document.getElementById("updateDiv").hidden = false;
                } else {
                    document.getElementById("updateDiv").hidden = true;
                }
                break;
        }  }
    parseGender = () => {
        var x = document.getElementById("geschlecht").value;
        var v = document.getElementById("geschlechtNew").value;
        switch (x) {
            case "male":
                this.setState({ geschlecht: "Maennlich" });
                break;
            case "female":
                this.setState({ geschlecht: "Weiblich" });
                break;
            case "diverse":
                this.setState({ geschlecht: "Divers" });
                break;
            case "select":
                this.setState({ geschlecht: null });
                break
        };
        switch (v) {
            case "maleNew":
                this.setState({ updateToApplyG: "Maennlich" });
                break;
            case "femaleNew":
                this.setState({ updateToApplyG: "Weiblich" });
                break;
            case "diverseNew":
                this.setState({ updateToApplyG: "Divers" });
                break;
            case "selectNew":
                this.setState({ geschlecht: null });
                break
        }
    }
    render() {
        const { data } = this.state;
        const query = { nachname: this.state.searchQuery };
        var results = [];
        data.forEach((dat) => {
            var a = "" + dat.nachname;
            var b = "" + query.nachname;
            if (a.toLocaleLowerCase() == b.toLocaleLowerCase()) {
                results.push(dat);
            }
        });
        window.scrollY = 40;
        return (
            <div>
                <table id="datas">
                  <tr>
                    <th>Mongo-ID</th>
                    <th>My-ID</th>
                    <th>Vorname</th>
                    <th>Nachname</th>
                    <th>Geschlecht</th>
                    <th>Strasse</th>
                    <th>PLZ</th>
                    <th>Ort</th>
                  </tr>
                { data.map((dat) => (
                    <tr>
                      <td>{dat._id}</td>
                      <td>{dat.id} </td>
                      <td>{dat.vorname}</td>
                      <td>{dat.nachname}</td>
                      <td>{dat.geschlecht}</td>
                      <td>{dat.strasse}</td>
                      <td>{dat.postleitzahl}</td>
                      <td>{dat.ort}</td>
                    </tr>
                    ))}
                    <div id="mainButtons">
                        <button class="button" id="addButton" onClick={() => this.clicked("add")}>
                            Add Record
                        </button>
                        <button class="button" id="delButton" onClick={() => this.clicked("del")}>
                            Delete Record
                        </button>
                        <button class="button" id="upButton" onClick={() => this.clicked("update")}>
                            Update Record
                        </button>
                    </div>

                </table>
                <div class="statDiv" style={{ padding: '10px' }} id="addDiv" hidden="true">


                    <input
                        type="text"
                        class="textField"
                        id="textField"
                        onChange={(e) => this.setState({ vorname: e.target.value })}
                        placeholder="Vorname"
                        style={{ width: '200px' }}
                    />
                    <br />
                    <input
                        type="text"
                        class="textField"
                        onChange={(e) => this.setState({ nachname: e.target.value })}
                        placeholder="Nachname"
                        style={{ width: '200px' }}
                    />
                    <br />
                    <select id="geschlecht" name="geschlecht"
                        onChange={() => this.parseGender()}
                    >
                        <option value="select">....</option>
                        <option value="male">Maennlich</option>
                        <option value="female">Weiblich</option>
                        <option value="diverse">Divers</option>
                    </select>
                    <br />
                    <input
                        type="text"
                        class="textField"
                        onChange={(e) => this.setState({ strasse: e.target.value })}
                        placeholder="Strasse"
                        style={{ width: '200px' }}
                    />
                    <br />
                    <input
                        type="text"
                        class="textField"
                        onChange={(e) => this.setState({ postleitzahl: e.target.value })}
                        placeholder="Postleitzahl"
                        style={{ width: '200px' }}
                    />
                    <br />
                    <input
                        type="text"
                        class="textField"
                        onChange={(e) => this.setState({ ort: e.target.value })}
                        placeholder="Ort"
                        style={{ width: '200px' }}
                    />
                    <button class="button" id="Button" onClick={() => this.putDataToDB(this.state.vorname, this.state.nachname, this.state.geschlecht, this.state.strasse, parseInt(this.state.postleitzahl), this.state.ort)}>
                        ADD
          </button>
                </div>
                <div class="statDiv" id="delDiv" hidden="true" style={{ padding: '10px' }}>
                    <input
                        type="text"
                        style={{ width: '300px' }}
                        onChange={(e) => this.setState({ idToDelete: e.target.value })}
                        placeholder="ID / MongoDB-ID des zu loeschenden Objektes"
                    />
                    <button class="button" id="Button" onClick={() => this.deleteFromDB(this.state.idToDelete)}>
                        DELETE
          </button>


                </div>
                <div class="statDiv"  id="updateDiv" hidden="true" style={{ padding: '10px' }}>
                    <input
                        type="text"
                        style={{ width: '200px' }}
                        onChange={(e) => this.setState({ idToUpdate: e.target.value })}
                        placeholder="id / Mongo-ID des zu updatenden Objektes"
                    />
                    <br />
                    <input
                        type="text"
                        style={{ width: '200px' }}
                        onChange={(e) => this.setState({ updateToApplyVN: e.target.value })}
                        placeholder="Neuer Vorname"
                    />
                    <br />
                    <input
                        type="text"
                        style={{ width: '200px' }}
                        onChange={(e) => this.setState({ updateToApplyNN: e.target.value })}
                        placeholder="Neuer Nachname"
                    />
                    <br/>
                    <select id="geschlechtNew" name="geschlechtNew"
                        onChange={() => this.parseGender()}
                    >
                        <option value="selectNew">....</option>
                        <option value="maleNew">Maennlich</option>
                        <option value="femaleNew">Weiblich</option>
                        <option value="diverseNew">Divers</option>
                    </select>
                    <br />
                    <input
                        type="text"
                        style={{ width: '200px' }}
                        onChange={(e) => this.setState({ updateToApplyS: e.target.value })}
                        placeholder="Neue Strasse"
                    />
                    <br />
                    <input
                        type="text"
                        style={{ width: '200px' }}
                        onChange={(e) => this.setState({ updateToApplyP: e.target.value })}
                        placeholder="Neue Postleitzahl"
                    />
                    <br />
                    <input
                        type="text"
                        style={{ width: '200px' }}
                        onChange={(e) => this.setState({ updateToApplyO: e.target.value })}
                        placeholder="Neuer Ort"
                    />
                    <button
                        class="button"
                        onClick={() =>
                            this.updateDB(this.state.idToUpdate, this.state.updateToApplyVN, this.state.updateToApplyNN, this.state.updateToApplyG, this.state.updateToApplyS, this.state.updateToApplyP, this.state.updateToApplyO)
                }
            >
                UPDATE
          </button>
                </div>
                <h1>Suche</h1>
                <input
                    type="text"
                    style={{ width: '200px' }}
                    onChange={(e) => this.setState({ searchQuery: e.target.value })}
                    placeholder="Suche nach Nachname"
                />
                <ul style={{ width: 300, height: 400, overflow: 'scroll' }}>
                    {results.length <= 0
                        ? 'No Match'
                        : results.map((dat) => (
                            <li style={{ padding: '10px' }} key={data.nachname}>
                                <span style={{ color: 'gray' }}> id: </span> {dat.id} <br />
                                <span style={{ color: 'gray' }}> Vorname: </span> {dat.vorname}<br />
                                <span style={{ color: 'gray' }}> Nachname: </span> {dat.nachname}<br />
                                <span style={{ color: 'gray' }}> Geschlecht: </span> {dat.geschlecht}<br />
                                <span style={{ color: 'gray' }}> Strasse: </span> {dat.strasse}<br />
                                <span style={{ color: 'gray' }}> Postleitzahl: </span> {dat.postleitzahl}<br />
                                <span style={{ color: 'gray' }}> Ort: </span> {dat.ort}<br />
                            </li>
                        ))}
                </ul>
            </div>
        );
    }
}
export default App;
