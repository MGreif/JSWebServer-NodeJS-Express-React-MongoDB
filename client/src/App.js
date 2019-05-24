// /client/App.js
import React, { Component } from 'react';
import axios from 'axios';
import { breakStatement } from '@babel/types';

class App extends Component {
    // initialize our state
    state = {
        data: [],
        id: 0,
        message: null,
        intervalIsSet: false,
        idToDelete: null,
        idToUpdate: null,
        objectToUpdate: null,
    };

    // when component mounts, first thing it does is fetch all existing data in our db
    // then we incorporate a polling logic so that we can easily see if our db has
    // changed and implement those changes into our UI
    componentDidMount() {
        this.getDataFromDb();
        if (!this.state.intervalIsSet) {
            let interval = setInterval(this.getDataFromDb, 1000);
            this.setState({ intervalIsSet: interval });
        }
    }

    // never let a process live forever
    // always kill a process everytime we are done using it
    componentWillUnmount() {
        if (this.state.intervalIsSet) {
            clearInterval(this.state.intervalIsSet);
            this.setState({ intervalIsSet: null });
        }
    }

    // just a note, here, in the front end, we use the id key of our data object
    // in order to identify which we want to Update or delete.
    // for our back end, we use the object id assigned by MongoDB to modify
    // data base entries

    // our first get method that uses our backend api to
    // fetch data from our data base
    getDataFromDb = () => {
        fetch('http://localhost:3001/api/getData')
            .then((data) => data.json())
            .then((res) => this.setState({ data: res.data }));
    };

    // our put method that uses our backend api
    // to create new query into our data base
    putDataToDB = (vorname, nachname, alter) => {
        let currentIds = this.state.data.map((data) => data.id);
        let idToBeAdded = 0;
        while (currentIds.includes(idToBeAdded)) {
            ++idToBeAdded;
        }

        axios.post('http://localhost:3001/api/putData', {
            id: idToBeAdded,
            vorname: vorname,
            nachname: nachname,
            alter: alter
        });
    };

    // our delete method that uses our backend api
    // to remove existing database information
    deleteFromDB = (idTodelete) => {
        parseInt(idTodelete);
        let objIdToDelete = null;
        this.state.data.forEach((dat) => {
            if (dat.id == idTodelete) {
                objIdToDelete = dat._id;
            }
        });

        axios.delete('http://localhost:3001/api/deleteData', {
            data: {
                id: objIdToDelete,
            },
        });
    };

    // our update method that uses our backend api
    // to overwrite existing data base information
    updateDB = (idToUpdate, updateToApplyVN, updateToApplyNN, updateToApplyA) => {
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
        if (updateToApplyA != null && updateToApplyA != "") {
            axios.post('http://localhost:3001/api/updateData', {
                id: objIdToUpdate,
                update: { alter: updateToApplyA },
            });
        };
    }

    // here is our UI
    // it is easy to understand their functions when you
    // see them render into our screen
    render() {
        const { data } = this.state;
        return (
            <div>
                <ul>
                    {data.length <= 0
                        ? 'NO DB ENTRIES YET'
                        : data.map((dat) => (
                            <li style={{ padding: '10px' }} key={data.nachname}>
                                <span style={{ color: 'gray' }}> id: </span> {dat.id} <br />
                                <span style={{ color: 'gray' }}> Vorname: </span> {dat.vorname}<br />
                                <span style={{ color: 'gray' }}> Nachname: </span> {dat.nachname}<br />
                                <span style={{ color: 'gray' }}> Alter: </span> {dat.alter}<br />
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
                        onChange={(e) => this.setState({ alter: e.target.value })}
                        placeholder="Alter"
                        style={{ width: '200px' }}
                    />
                    <button onClick={() => this.putDataToDB(this.state.vorname, this.state.nachname, parseInt(this.state.alter))}>
                        ADD
          </button>
                </div>
                <div style={{ padding: '10px' }}>
                    <input
                        type="text"
                        style={{ width: '200px' }}
                        onChange={(e) => this.setState({ idToDelete: e.target.value })}
                        placeholder="put id of item to delete here"
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
                        placeholder="id of item to update here"
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
                        onChange={(e) => this.setState({ updateToApplyA: e.target.value })}
                        placeholder="Neues Alter"
                    />
                    <button
                        onClick={() =>
                            this.updateDB(this.state.idToUpdate, this.state.updateToApplyVN, this.state.updateToApplyNN, this.state.updateToApplyA)
                        }
                    >
                        UPDATE
          </button>
                </div>
            </div>
        );
    }
}

export default App;