import React, { Component } from 'react';

class EntryRow extends Component {
    constructor(props) {
        super(props);
        console.log('Constructing EntryRow');
        this.doSave = this.doSave.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillMount() {
        //Set the save/cancel buttons to be hidden initially.
        this.setState({
            amEditing: false,
            saveButtonDisplay: 'none',
            cancelButtonDisplay: 'none',
            editButtonDisplay: '',
            deleteButtonDisplay: '',
        })
    }
    get(key) {
        return this.props.data[key];
    }
    handleChange(event) {
        //TODO!!!
    }

    /**
     * Add up the total for this entry row.
     *
     * @return {number}
     */
    getTotal() {
        return Math.fround(this.get('hourlyPrice') * this.get('hours'));
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

    /**
     * Save the data from the entry row.
     *
     * @param event
     */
    doSave(event) {
        console.log('saving ', event);
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
        this.setEditing(false);
    }

    /**
     * Perform the deletion of the entry row.
     *
     * @param event
     */
    doDelete(event) {
        console.log('deleting ', event);
    }

    /**
     * Get the display value for the input fields.
     *
     * @return {{display: string}}
     */
    getInputDisplay() {
        var val = (this.state.amEditing) ? '' : 'none';
        console.log('input display: ', val);
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
        return (<tr className="js-existing-entry" id={"entry_" + this.get('id')}>
            <td className="js-entry-description">
                <input type="text" onChange={this.handleChange} value={this.get('description')} style={this.getInputDisplay()} />
                <span style={this.getValueDisplay()}>{this.get('description')}</span>
            </td>
            <td className="js-entry-hourlyPrice">
                <input type="text" onChange={this.handleChange} value={this.get('hourlyPrice')} style={this.getInputDisplay()} />
                <span style={this.getValueDisplay()}>{this.get('hourlyPrice')}</span>
            </td>
            <td className="js-entry-hours">
                <input type="text" onChange={this.handleChange} value={this.get('hours')} style={this.getInputDisplay()} />
                <span style={this.getValueDisplay()}>{this.get('hours')}</span>
            </td>
            <td className="js-entry-total row-total">{this.getTotal()}</td>
            <td className="entry-controls">
                <button type="button" className="js-entry-save btn btn-success" onClick={() => this.doSave(this.get('id'))} style={{display: this.state.saveButtonDisplay}}><i className="glyphicon glyphicon-floppy-disk"></i></button>
                <button type="button" className="js-entry-cancel btn btn-danger" onClick={() => this.doCancel(this.get('id'))} style={{display: this.state.cancelButtonDisplay}}><i className="glyphicon glyphicon-ban-circle"></i></button>
                <button type="button" className="js-entry-edit btn btn-primary" onClick={() => this.doEdit(this.get('id'))} style={{display: this.state.editButtonDisplay}}><i className="glyphicon glyphicon-edit"></i></button>
                <button type="button" className="js-entry-delete btn btn-danger" onClick={() => this.doDelete(this.get('id'))} style={{display: this.state.deleteButtonDisplay}}><i className="glyphicon glyphicon-trash"></i></button>
            </td>
        </tr>);
    }
}

module.exports = EntryRow
