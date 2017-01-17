import React, { Component } from 'react';

class EntryRow extends Component {
    constructor(props) {
        super(props);
        console.log('Constructing EntryRow');
    }
    get(key) {
        console.log('EntryRow->get('+key+'):',this.props.data[key]);
        return this.props.data[key];
    }
    getTotal() {
        return this.get('hourlyPrice') * this.get('hours');
    }
    render() {
        if (!this.props.data) {
            return '';
        }
        return (<tr className="js-existing-entry" id={"entry_" + this.get('id')}>
            <td className="js-entry-description">{this.get('description')}</td>
            <td className="js-entry-hourlyPrice">{this.get('hourlyPrice')}</td>
            <td className="js-entry-hours">{this.get('hours')}</td>
            <td className="js-entry-total row-total">{this.getTotal()}</td>
            <td className="entry-controls">
                <button type="button" className="js-entry-save btn btn-success" data-entry="" style={{display: 'none'}}><i className="glyphicon glyphicon-floppy-disk"></i></button>
                <button type="button" className="js-entry-cancel btn btn-danger" data-entry="" style={{display: 'none'}}><i className="glyphicon glyphicon-ban-circle"></i></button>
                <button type="button" className="js-entry-edit btn btn-primary" data-entry=""><i className="glyphicon glyphicon-edit"></i></button>
                <button type="button" className="js-entry-delete btn btn-danger" data-entry=""><i className="glyphicon glyphicon-trash"></i></button>
            </td>
        </tr>);
    }
}

module.exports = EntryRow
