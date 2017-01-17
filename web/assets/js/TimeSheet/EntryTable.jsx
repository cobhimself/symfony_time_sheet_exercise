import React, { Component } from 'react';
import EntryRow from './EntryRow.jsx';

class EntryTable extends Component {
    constructor(props) {
        super(props);
        console.log('Constructing EntryTable. Props:', props);

        var entry,
            entries = this.props.entries,
            rows = [];
        for (entry in entries) {
            if (entries.hasOwnProperty(entry)) {
                console.log('New Entry Row Data:', entries[entry]);
                rows.push(<EntryRow key={entries[entry].id} data={entries[entry]} />);
            }
        }
        console.log('EntryTable final rows:', rows);

        this.state = {
            rows: rows
        }
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
                {this.state.rows}
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
}

module.exports = EntryTable;
