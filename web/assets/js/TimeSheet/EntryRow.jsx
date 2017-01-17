import React, { Component } from 'react';

class EntryRow extends Component {
    constructor(props) {
        super(props);
        console.log('Constructing EntryRow');
        this.doSave = this.doSave.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillMount() {
        //Set the save/cancel buttons to be hidden.
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
    handleChange() {
        
    }
    getTotal() {
        return Math.fround(this.get('hourlyPrice') * this.get('hours'));
    }
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
    doSave(event) {
        console.log('saving ', event);
    }
    doEdit(event) {
        this.setEditing(true);
    }
    doCancel(event) {
        this.setEditing(false);
    }
    doDelete(event) {
        console.log('deleting ', event);
    }
    getInputDisplay() {
        var val = (this.state.amEditing) ? '' : 'none';
        console.log('input display: ', val);
       return {display: val};
    }
    getValueDisplay() {
        var val = (this.state.amEditing) ? 'none' : '';
        return {display: val};
    }
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
