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
        parseInt(idToUpdate);
        this.state.data.forEach((dat) => {
            if (dat.id == idToUpdate) {
                objIdToUpdate = dat._id;
            }
        });
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
                <ul id="list" style={{ width: 300, height: 400, overflow: 'scroll' }}>
                    {data.length == 0
                        ? 'NO DB ENTRIES YET'
                        : data.map((dat) => (
                            <li style={{ padding: '10px' }} key={data.nachname}>
                                <span style={{ color: 'red' }}> MongoDB-ID: </span> {dat._id} <br />
                                <span style={{ color: 'gray' }}> ID: </span> {dat.id} <br />
                                <span style={{ color: 'gray' }}> Vorname: </span> {dat.vorname}<br />
                                <span style={{ color: 'gray' }}> Nachname: </span> {dat.nachname}<br />
                                <span style={{ color: 'gray' }}> Geschlecht: </span> {dat.geschlecht}<br />
                                <span style={{ color: 'gray' }}> Strasse: </span> {dat.strasse}<br />
                                <span style={{ color: 'gray' }}> Postleitzahl: </span> {dat.postleitzahl}<br />
                                <span style={{ color: 'gray' }}> Ort: </span> {dat.ort}<br />
                            </li>
                        ))}
                </ul>
                <div style={{ padding: '10px' }}>

                    
                    <input
                        type="text"
                        onChange={(e) => this.setState({ vorname: e.target.value })}
                        placeholder="Vorname"
                        style={{ width: '200px' }}
                    />
                    <br />
                    <input
                        type="text"
                        onChange={(e) => this.setState({ nachname: e.target.value })}
                        placeholder="Nachname"
                        style={{ width: '200px' }}
                    />
                    <br />
                    <input
                        type="text"
                        onChange={(e) => this.setState({ geschlecht: e.target.value })}
                        placeholder="Geschlecht"
                        style={{ width: '200px' }}
                    />
                    <br />
                    <input
                        type="text"
                        onChange={(e) => this.setState({ strasse: e.target.value })}
                        placeholder="Strasse"
                        style={{ width: '200px' }}
                    />
                    <br />
                    <input
                        type="text"
                        onChange={(e) => this.setState({ postleitzahl: e.target.value })}
                        placeholder="Postleitzahl"
                        style={{ width: '200px' }}
                    />
                    <br />
                    <input
                        type="text"
                        onChange={(e) => this.setState({ ort: e.target.value })}
                        placeholder="Ort"
                        style={{ width: '200px' }}
                    />
                    <button onClick={() => this.putDataToDB(this.state.vorname, this.state.nachname, parseInt(this.state.geschlecht), this.state.strasse, parseInt(this.state.postleitzahl), this.state.ort)}>
                        ADD
          </button>
                </div>
                <div style={{ padding: '10px' }}>
                    <input
                        type="text"
                        style={{ width: '300px' }}
                        onChange={(e) => this.setState({ idToDelete: e.target.value })}
                        placeholder="ID / MongoDB-ID des zu loeschenden Objektes"
                    />
                    <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
                        DELETE
          </button>
                </div>
                <div style={{ padding: '10px' }}>
                    <input
                        type="text"
                        style={{ width: '200px' }}
                        onChange={(e) => this.setState({ idToUpdate: e.target.value })}
                        placeholder="id des zu updatenden Objektes"
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
                    <input
                        type="text"
                        style={{ width: '200px' }}
                        onChange={(e) => this.setState({ updateToApplyG: e.target.value })}
                        placeholder="Neues Geschlecht"
                    />
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