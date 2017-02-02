import React, { Component } from 'react';
import EntryTable from './EntryTable.jsx';

class TimeSheet extends Component {
    constructor(props) {
        console.log('Constructing TimeSheet');
        super(props);
        this.state = {
            billTo: '',
            entries: [],
            id: null
        };
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        this.getTimeSheetData();
    }
    handleChange(e) {
        this.setState({[e.target.name]: event.target.value});
    }
    render() {
        
        if (!this.state.billTo) {
            console.log('loading');
            return (<div>Loading</div>);
        }

        if ( this.state.entries.length === 0 ) {
            console.log('no results');
            return <div>No result found for this TimeSheet!</div>;
        }
        console.log('returning the container', this.state);

        return (<div className="container">
            <div className="row">
                <h1 className="pull-right">Development Invoice</h1>
            </div>
            <div className="row">
                <div className="pull-right">Date: {new Date().toLocaleDateString("en-US")}</div>
            </div>
            <div className="row">
                <div className="form">
                    <div className="form-group">
                        <label htmlFor="billTo">Bill To</label>
                        <textarea className="form-control" rows="3" id="billTo" cols="100" name="billTo" onChange={this.handleChange} value={this.state.billTo}/>
                    </div>
                </div>
            </div>
            <div className="row">
                <EntryTable timeSheetId={this.state.id} entries={this.state.entries}/>
            </div>
            <div className="row btn-bar">
                <div className="pull-right">
                    <button className="btn btn-default" type="button" id="generatePDF">Generate PDF</button>
                    <button className="btn btn-default" type="button" id="save">Save</button>
                </div>
            </div>
        </div>);
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
        console.log('TimeSheet->getTimeSheetData()');
        var that = this;

        fetch('/api/timesheet', {
            method: "GET",
            credentials: "same-origin"
        })
            .then(this.checkStatus)
            .then(this.parseJSON)
            .then(function (data) {
                //Timesheet data returns as an array of TimeSheets.
                //Get the first one.
                console.log('TimeSheet data loaded. Setting state:', data[0]);
                var data = data[0];
                that.setState({
                    billTo: data.billTo,
                    entries: data.entries,
                    id: data.id
                });
                console.log('TimeSheet data done loading.');
            }).catch(function (error) {
            console.log('request failed', error);
        });
    }
}

module.exports = TimeSheet;
