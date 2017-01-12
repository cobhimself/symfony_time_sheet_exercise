import React, { Component } from 'react';
import EntryRow from './EntryRow.jsx';

class EntryTable extends Component {
    constructor(props) {
        super(props);

    }
    componentDidMount() {
        this.getTimeSheetData()
    }
    render() {
        return (<table id="timeEntryTable" className="table table-striped table-hover">
            <thead>
            <tr>
                <th className="description-col">Description</th>
                <th>Hourly Price</th>
                <th>Hours</th>
                <th>Total</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
                <EntryRow />
            </tbody>
        </table>);
    }
    checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }
    parseJSON(response) {
        return response.json()
    }
    getTimeSheetData() {
        fetch('/api/timesheet', {
            method: "GET",
            credentials: "same-origin"
        })
        .then(this.checkStatus)
        .then(this.parseJSON)
        .then(function (data) {
            console.log(data);
        }).catch(function (error) {
            console.log('request failed', error);
        });
    }
}

module.exports = EntryTable;
