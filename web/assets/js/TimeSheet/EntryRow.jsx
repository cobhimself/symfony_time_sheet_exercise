import React, { Component } from 'react';

class EntryRow extends Component {
    constructor(props) {
        super(props);
        console.log('Constructing EntryRow');
        console.log(this.props);
        this.afterAdd = (this.props.afterAdd) ? this.props.afterAdd : () => {};
        this.afterDelete = (this.props.afterDelete) ? this.props.afterDelete : () => {};
        console.log(this.afterDelete);
        this.doSave = this.doSave.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillMount() {
        //Set the save/cancel buttons to be hidden initially.
        this.setState({
            amEditing: (this.props.type === 'new') ? true : false,
            saveButtonDisplay: (this.props.type === 'existing') ? 'none' : '',
            cancelButtonDisplay: (this.props.type === 'existing') ? 'none' : '',
            editButtonDisplay: '',
            deleteButtonDisplay: '',
            data: this.props.data,
            type: this.props.type,
            className: (this.props.type === 'new') ? 'js-new-entry' : 'js-existing-entry',
            entryIdString: (this.props.data.id) ? "entry_" + this.props.data.id : 'new'
        })
    }
    get(key) {
        return this.state.data[key];
    }
    handleChange(key, event) {
        var newVal = event.target.value;
        this.setState(function (prevState, props){
            var data = prevState.data;
            data[key] = newVal;

            return data;
        });
    }

    /**
     * Add up the total for this entry row.
     *
     * @return {number}
     */
    getTotal() {
        //This silly looking rounding method helps JavaScript round more precisely
        return (this.get('hourlyPrice') && this.get('hours'))
            ? Number(Math.round(this.get('hourlyPrice') * this.get('hours')+'e2')+'e-2')
            : 0;
    }

    /**
     * Set the entry row as being edited or not.
     *
     * @param {boolean} flag True to go in edit mode, false otherwise.
     */
    setEditing(flag) {
        this.setState({
            amEditing: flag,
            saveButtonDisplay: (flag) ? '' : 'none',
            cancelButtonDisplay: (flag) ? '' : 'none',
            editButtonDisplay: (flag) ? 'none' : '',
            deleteButtonDisplay: (flag) ? 'none' : ''
        });
        console.log(this.state);
    }

    clearInputs() {
        console.log('current state: ', this.state);
        this.setState(function (prevState, props) {
            prevState.data.hourlyPrice = '';
            prevState.data.hours = '';
            prevState.data.description = '';

            return prevState;
        });
    }

    checkStatus(response) {

        if (response.status >= 200 && response.status < 300) {
            return response
        } else {
            let json;
                return response.json().then(function (json) {
                    let error = new Error(response.statusText);
                    error.jsonResponse = json;
                    error.response = response
                    throw error
                });
        }
    }

    parseJSON(response) {
        return response.json()
    }

    /**
     * Save the data from the entry row.
     *
     * @param event
     */
    doSave(event) {
        console.log('saving ', event);
        var that = this;

        fetch('/api/timesheet/entry', {
            method: "POST",
            credentials: "same-origin",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([this.state.data])
        })
            .then(this.checkStatus)
            .then(this.parseJSON)
            .then(function (data) {
                //Posting new data returns the data for us again.
                console.log('TimeSheet data loaded. Setting state:', data[0]);
                var data = data[0];
                if (that.state.type === 'new') {
                    that.afterAdd(data);
                    that.clearInputs();
                } else {
                    that.setEditing(false);
                }
                console.log('TimeSheet data done loading.');
            })
            .catch(function (error) {
                console.log('request failed', error);
                if (error.jsonResponse) {
                    console.log('jsonResponse', error.jsonResponse);
                }
            });
    }

    /**
     * Set the entry row as editing.
     *
     * @param event
     */
    doEdit(event) {
        this.setEditing(true);
    }

    /**
     * Cancel the edit for this entry row.
     *
     * @param event
     */
    doCancel(event) {
        if (this.state.type === 'existing') {
            this.setEditing(false);
        } else {
            this.clearInputs();
        }
    }

    /**
     * Perform the deletion of the entry row.
     *
     * @param event
     */
    doDelete(event) {
        console.log('deleting ', event);
        console.log({'id': this.state.data.id});
        var that = this;

        fetch('/api/timesheet/entry', {
            method: "DELETE",
            credentials: "same-origin",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'id': this.state.data.id})
        })
            .then(this.checkStatus)
            .then(function (response) {
                console.log(that.afterDelete);
                that.afterDelete(that.get('id'));
            })
            .catch(function (error) {
                console.log('request failed', error);
                if (error.jsonResponse) {
                    console.log('jsonResponse', error.jsonResponse);
                }
            });
    }

    /**
     * Get the display value for the input fields.
     *
     * @return {{display: string}}
     */
    getInputDisplay() {
        var val = (this.state.amEditing) ? '' : 'none';
       return {display: val};
    }

    /**
     * Get the display value of the value data.
     *
     * @return {{display: string}}
     */
    getValueDisplay() {
        var val = (this.state.amEditing) ? 'none' : '';
        return {display: val};
    }

    /**
     * Render!
     *
     * @return {*}
     */
    render() {
        if (!this.props.data) {
            return '';
        }
        return (<tr className={this.state.className} id={this.state.entryIdString}>
            <td className="js-entry-description form-group">
                <input className="form-control" type="text" onChange={this.handleChange.bind(this, 'description')} value={this.get('description')} style={this.getInputDisplay()} />
                <span style={this.getValueDisplay()}>{this.get('description')}</span>
            </td>
            <td className="js-entry-hourlyPrice form-group">
                <input type="text" className="form-control" size="4" onChange={this.handleChange.bind(this, 'hourlyPrice')} value={this.get('hourlyPrice')} style={this.getInputDisplay()} />
                <span style={this.getValueDisplay()}>{this.get('hourlyPrice')}</span>
            </td>
            <td className="js-entry-hours form-group">
                <input type="text" className="form-control" size="4" onChange={this.handleChange.bind(this, 'hours')} value={this.get('hours')} style={this.getInputDisplay()} />
                <span style={this.getValueDisplay()}>{this.get('hours')}</span>
            </td>
            <td className="js-entry-total row-total">{this.getTotal()}</td>
            <td className="entry-controls">
                    <span>
                        <button type="button" className="js-entry-save btn btn-success" onClick={() => this.doSave(this.get('id'))} style={{display: this.state.saveButtonDisplay}}><i className="glyphicon glyphicon-floppy-disk"></i></button>
                        <button type="button" className="js-entry-cancel btn btn-danger" onClick={() => this.doCancel(this.get('id'))} style={{display: this.state.cancelButtonDisplay}}><i className="glyphicon glyphicon-ban-circle"></i></button>
                    </span>
                {this.state.type === 'existing' &&
                    <span>
                        <button type="button" className="js-entry-edit btn btn-primary" onClick={() => this.doEdit(this.get('id'))} style={{display: this.state.editButtonDisplay}}><i className="glyphicon glyphicon-edit"></i></button>
                        <button type="button" className="js-entry-delete btn btn-danger" onClick={() => this.doDelete(this.get('id'))} style={{display: this.state.deleteButtonDisplay}}><i className="glyphicon glyphicon-trash"></i></button>
                    </span>
                }
            </td>
        </tr>);
    }
}

module.exports = EntryRow
