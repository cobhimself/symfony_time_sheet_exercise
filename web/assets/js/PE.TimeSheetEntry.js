(function (PE, $, undefined) {
    'use strict';

    /**
     * PE.TimeSheetEntry
     *
     * Represents a TimeSheetEntry.
     */
    PE.TimeSheetEntry = function TimeSheetEntry(initData){
        var i, len, initError = false;

        this.constructorArgs = [
            'row', 'onDelete', 'onEdit'
        ];

        /**
         * Values for these keys are required in order to save
         * the time sheet entry.
         *
         * @type {[String]}
         */
        this.valuesNeededToSave = [
            'description',
            'hourlyPrice',
            'hours'
        ];

        /**
         * Holds the data for this TimeSheetEntry.
         *
         * @type {{}}
         */
        this.elementData = {};

        /**
         * Holds references to the elements the TimeSheetEntry values
         * live within.
         *
         * @type {Array}
         */
        this.elements = [];

        //If no init data is provided, we can't set the elements
        //on object initialization. This happens when a TimeSheetEntry
        //is added from the form.
        if (initData) {
            //Sanity check.
            for (i = this.constructorArgs.length; i -= 1;) {
                if (!(this.constructorArgs[i] in initData)) {
                    initError = true;
                    console.error(
                        'Required TimeSheetEntry constructor arg missing: ',
                        this.constructorArgs[i]
                    );
                }
            }

            if (!initError) {
                this.setElementsFromInitData(initData);
                this.bindElementInputs();
            }
        }

        this.set(this.getElementValues(this.valuesNeededToSave));

        return this;
    };

    /**
     * Set the elements for the TimeSheetEntry.
     *
     * @param {object} $initData The init data given upon TimeSheetEntry
     *                           construction.
     */
    PE.TimeSheetEntry.prototype.setElementsFromInitData = function setElementsFromInitData(initData) {
        this.row = $(initData.row);

        this.onDelete = initData.onDelete;
        this.onEdit = initData.onEdit;

        this.entryId = this.row.attr('id').replace('entry_', '');

        this.elements.description = this.row.find('.js-entry-description');
        this.elements.hourlyPrice = this.row.find('.js-entry-hourlyPrice');
        this.elements.hours = this.row.find('.js-entry-hours');
        this.elements.total = this.row.find('.js-entry-total');
        this.elements.deleteButton = this.row.find('.js-entry-delete');
        this.elements.editButton = this.row.find('.js-entry-edit');
    };

    /**
     * Bind all of the input elements for the given entry.
     */
    PE.TimeSheetEntry.prototype.bindElementInputs = function bindElementIntputs() {
        //Send in a reference to this TimeSheetEntry since jQuery sets 'this'
        //as the target element of the event.
        var ref = {'entry': this};

        $(this.elements.deleteButton).on('click', ref, this.handleDelete);
        $(this.elements.editButton).on('click', ref, this.handleEdit);
    };

    /**
     * Get the element values for each of the keys provided.
     *
     * @param {Array} $keys
     *
     * @return {Object}
     */
    PE.TimeSheetEntry.prototype.getElementValues = function getElementValues(keys) {
        var values = {}, elem;

        for (elem in keys) {
            if (keys.hasOwnProperty(elem)) {
                values[keys[elem]] = this.getElementValue(keys[elem]);
            }
        }

        return values;
    };


    /**
     * Set the data for this TimeSheetEntry
     *
     * @param {Object|String} key If an Object, sets the entire data. If a
     *                            string, data for this key is set
     *                            with the value.
     * @param {*} [value] If key is an object, this parameter is ignored.
     *              If key is a string, this parameter is used as it's value.
     *
     * @return PE.TimeSheetEntry
     */
    PE.TimeSheetEntry.prototype.set = function set(key, value) {
        if (key.isPrototypeOf(String)) {
            this.elementData[key] = value;
        } else {
            this.elementData = key;
        }

        return this;
    };

    /**
     * Get the value of the given key in this entry's data array.
     *
     * @param {string} key
     */
    PE.TimeSheetEntry.prototype.get = function get(key) {
        if (!(key in this.elementData)) {
            console.error('This entry does not have dat associated with :' + key);
        }

        return this.elementData[key];
    };

    /**
     * Get the text value of the given element.
     *
     * @param {String} element The element name.
     */
    PE.TimeSheetEntry.prototype.getElementValue = function getElementValue(element) {
        if (!(element in this.elements))
        {
            console.error('Element ' + element + ' does not exist on this entry!', this);
        }

        return $(this.elements[element]).text();
    };

    /**
     * Return the total cost of the entry.
     *
     * @returns {number}
     */
    PE.TimeSheetEntry.prototype.getTotal = function getTotal() {
        return (this.hourlyPrice * this.hours);
    };

    /**
     * Run on this event's edit button being pressed.
     *
     * @callback
     * @this {jQuery}
     * @static
     *
     * @param {Event} event
     */
    PE.TimeSheetEntry.prototype.handleEdit = function handleEdit(event) {
        var entry = event.data.entry
        entry.onEdit.call(entry);
    };

    /**
     * Run on a TimeSheetEntry's delete button being clicked.
     *
     * @callback
     * @this {jQuery}
     * @static
     * @param event
     */
    PE.TimeSheetEntry.prototype.handleDelete = function handleDelete(event) {
        var entry = event.data.entry
        entry.onDelete.call(entry);
    };

}(window.PE = window.PE || {}, jQuery));
