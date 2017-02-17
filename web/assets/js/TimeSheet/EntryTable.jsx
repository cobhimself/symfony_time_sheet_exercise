import React, { Component } from 'react';
import EntryRow from './EntryRow.jsx';
import util from '../util.js';

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
                rows.push(this.compileEntryRow(entries[entry].id, data, 'existing'));
            }
        }
        console.log('EntryTable final rows:', rows);

        this.state = {
            rows: rows
        }
    }
    compileEntryRow(key, data, type) {
        return (<EntryRow key={key} data={data} type={type} afterDelete={this.afterDelete.bind(this)}/>);
    }
    afterAdd(data) {
        this.setState(function (prevState, props){
            var rows = prevState.rows;
            rows[rows.length] = this.compileEntryRow(data.id, data, 'existing');

            prevState.rows = rows;
            return prevState;
        });

        //Move focus back to the description field for the add entry row
        document.getElementById('new')
            .getElementsByClassName('js-entry-description')[0]
            .getElementsByTagName('input')[0].focus();
    }
    afterDelete(id) {
        this.setState(function (prevState, props) {
            var i, toDelete, rows = prevState.rows;
            for (i = rows.length; i--;) {
                if (rows.hasOwnProperty(i)) {
                    if (rows[i].props.data.id === id) {
                        console.log('Matching row: ', rows);
                        toDelete = i;
                        break;
                    }
                }
            }

            prevState.rows.splice(toDelete, 1);

            return  prevState;
        });
    }
    calculatedTotal() {
        var hours, hourlyPrice,
            rows = this.state.rows,
            i, total = 0;
        for (i = rows.length; i--;) {
            if (rows.hasOwnProperty(i)) {
                hours = rows[i].props.data.hours;
                hourlyPrice = rows[i].props.data.hourlyPrice;
                total += util.moneyRound(hours * hourlyPrice);
            }
        }

        return util.moneyRound(total);
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
                <EntryRow key="new" data={{timeSheetId: this.props.timeSheetId}} type="new" afterAdd={this.afterAdd.bind(this)}/>
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan="2">&nbsp;</td>
                    <td className="totals-label">Total:</td>
                    <td className="timesheet-total">${this.calculatedTotal()}</td>
                </tr>
            </tfoot>
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
