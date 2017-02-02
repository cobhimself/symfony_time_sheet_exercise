import React, { Component } from 'react';
import EntryRow from './EntryRow.jsx';

class EntryTable extends Component {
    constructor(props) {
        super(props);
        console.log('Constructing EntryTable. Props:', props);

        var entry,
            entries = this.props.entries,
            data,
            timeSheetId = this.props.timeSheetId,
            rows = [];
        for (entry in entries) {
            if (entries.hasOwnProperty(entry)) {
                data = entries[entry];
                data.timeSheetId = this.props.timeSheetId;
                console.log('New Entry Row Data:', data);
                rows.push(<EntryRow key={entries[entry].id} data={data}/>);
            }
        }
        console.log('EntryTable final rows:', rows);

        this.state = {
            rows: rows
        }
    }
    render() {
        return (<form><table id="timeEntryTable" className="table table-striped table-hover">
            <thead>
            <tr>
                <th className="description-col">Description</th>
                <th className="hourly-column">Hourly Price</th>
                <th className="hours-column">Hours</th>
                <th className="total-column">Total</th>
                <th className="action-column"></th>
            </tr>
            </thead>
            <tbody>
                {this.state.rows}
            </tbody>
        </table></form>);
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
