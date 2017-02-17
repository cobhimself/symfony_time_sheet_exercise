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

    /**
     * Get the time sheet data when the TimeSheet is ready to be mounted.
     */
    componentDidMount() {
        this.getTimeSheetData();
    }

    /**
     * Handle input value changes to keep the state up to date.
     *
     * @param {Event} e
     */
    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    /**
     * Send the user to the location to get a PDF version of the time sheet.
     */
    getPdf() {
        document.location = '/get/pdf/' + this.state.id;
    }

    /**
     * Render the TimeSheet.
     *
     * @return {Component}
     */
    render() {
        
        if (!this.state.billTo) {
            //console.log('loading');
            return (<div>Loading</div>);
        }

        if ( this.state.entries.length === 0 ) {
            //console.log('no results');
            return <div>No result found for this TimeSheet!</div>;
        }
        //console.log('returning the container', this.state);

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
                        <button className="btn btn-default" type="button" id="save" onClick={this.saveTimeSheetData.bind(this)}>Save</button>
                    </div>
                </div>
            </div>
            <div className="row">
                <EntryTable timeSheetId={this.state.id} entries={this.state.entries}/>
            </div>
            <div className="row btn-bar">
                <div className="pull-right">
                    <button className="btn btn-default" type="button" id="generatePDF" onClick={this.getPdf.bind(this)}>Generate PDF</button>
                </div>
            </div>
        </div>);
    }

    /**
     * Check the status of the response object to make sure everything is bueno.
     *
     * @param {Object} response
     * @return {Object}
     */
    checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }

    /**
     * Parse the JSON within the given response.
     *
     * @param {Object} response
     */
    parseJSON(response) {
        return response.json()
    }

    /**
     * Get the TimeSheet data and set the state.
     */
    getTimeSheetData() {
        //console.log('TimeSheet->getTimeSheetData()');
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
                //console.log('TimeSheet data loaded. Setting state:', data[0]);
                var data = data[0];
                that.setState({
                    billTo: data.billTo,
                    entries: data.entries,
                    id: data.id
                });
                //console.log('TimeSheet data done loading.');
            }).catch(function (error) {
            //console.log('request failed', error);
        });
    }

    /**
     * Save the TimeSheet data (mainly the bill to field).
     */
    saveTimeSheetData() {
        var that = this;
        fetch('/api/timesheet', {
            method: "POST",
            credentials: "same-origin",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([{'id': this.state.id, 'billTo': this.state.billTo}])
        })
            .then(this.checkStatus)
            .then(this.parseJSON)
            .then(function (data) {
                //Posting new data returns the data for us again.
                //console.log('TimeSheet data done loading.', data);
            })
            .catch(function (error) {
                //console.log('request failed', error);
                if (error.jsonResponse) {
                    //console.log('jsonResponse', error.jsonResponse);
                }
            });
    }
}

module.exports = TimeSheet;
