import React, { Component } from 'react';

class EntryRow extends Component {
    render() {
        return (<tr className="js-existing-entry" id="entry_{{ entry.id }}">
            <td className="js-entry-description"></td>
            <td className="js-entry-hourlyPrice"></td>
            <td className="js-entry-hours"></td>
            <td className="js-entry-total row-total"></td>
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
