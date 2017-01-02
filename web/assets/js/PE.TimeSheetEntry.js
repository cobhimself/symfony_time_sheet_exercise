(function (PE, $, undefined) {
    'use strict';

    /**
     * PE.TimeSheetEntry
     *
     * @constructor
     * Represents a TimeSheetEntry.
     */
    PE.TimeSheetEntry = function TimeSheetEntry(initData) {
        /**
         * Holds the data for this TimeSheetEntry.
         *
         * @type {{}}
         */
        this._elementData = {};

        /**
         * Holds references to the elements the TimeSheetEntry values
         * live within.
         *
         * @type {Array}
         */
        this._elements = [];

        var that = this,
            i, len, initError = false,

            _constructorArgs = [
                'row', 'onDelete', 'onEdit'
            ],

            /**
             * Values for these keys are required in order to save
             * the time sheet entry.
             *
             * @type {String[]}
             */
            _valuesNeededToSave = [
                'description',
                'hourlyPrice',
                'hours'
            ];

        /**
         * Show, or hide, each of the edit inputs for this TimeSheetEntry.
         *
         * @param {boolean} [flag=true]
         *
         * @return {PE.TimeSheetEntry}
         */
        this.showEditInputs = function showEditInputs(flag) {
            console.log('TODO: showEditInputs');

            return this;
        };

        /**
         * Show or hide the element with the given element name.
         *
         * @param {string} elementName The element name to show or hide.
         * @param {boolean} [flag=true] Whether or not to show the element.
         * @private
         */
        this.showOrHide = function showOrHide(elementName, flag) {
            flag = flag || true;

            this.getElement(elementName).toggle(flag);

            return this;
        };

        /**
         * Returns the entry's element with the given name.
         *
         * @param {string} name
         */
        this.getElement = function getElement(name) {
            if (!(name in this._elements))
            {
                console.error('Element ' + name + ' does not exist on this entry!', this);
            }

            return $(this._elements[name]);
        };

        /**
         * Get the text value of the given element.
         *
         * @param {String} element The element name.
         */
        this.getElementValue = function getElementValue(element) {
            element = this.getElement(element);

            return $(element).text();
        };

        /**
         * Get the element values for each of the keys provided.
         *
         * @param {Array} $keys
         *
         * @return {Object}
         */
        this.getElementValues = function getElementValues(keys) {
            var values = {}, elem;

            for (elem in keys) {
                if (keys.hasOwnProperty(elem)) {
                    values[keys[elem]] = this.getElementValue(keys[elem]);
                }
            }

            return values;
        };

        /**
         * Set the elements for the TimeSheetEntry.
         *
         * @methodOf PE.TimeSheetEntry
         * @param {object} $initData The init data given upon TimeSheetEntry
         *                           construction.
         */
        this.setElementsFromInitData = function setElementsFromInitData(initData) {
            this.row = $(initData.row);

            this.onDelete = initData.onDelete;
            this.onEdit = initData.onEdit;

            this.entryId = this.row.attr('id').replace('entry_', '');

            this._elements.description = this.row.find('.js-entry-description');
            this._elements.hourlyPrice = this.row.find('.js-entry-hourlyPrice');
            this._elements.hours = this.row.find('.js-entry-hours');
            this._elements.total = this.row.find('.js-entry-total');
            this._elements.deleteButton = this.row.find('.js-entry-delete');
            this._elements.editButton = this.row.find('.js-entry-edit');
            this._elements.saveButton = this.row.find('.js-entry-save');
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
        this.handleEdit = function handleEdit(event) {
            var entry = event.data.entry;

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
        this.handleDelete = function handleDelete(event) {
            var entry = event.data.entry;

            entry.onDelete.call(entry);
        };

        /**
         * Bind all of the input elements for the given entry.
         */
        this.bindElementInputs = function bindElementInputs() {
            //Send in a reference to this TimeSheetEntry since jQuery sets 'this'
            //as the target element of the event.
            var ref = {'entry': this};

            $(this.getElement('deleteButton')).on('click', ref, this.handleDelete);
            $(this.getElement('editButton')).on('click', ref, this.handleEdit);
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
        this.set = function set(key, value) {
            if (key.isPrototypeOf(String)) {
                this._elementData[key] = value;
            } else {
                this._elementData = key;
            }

            return this;
        };

        this.init = function init (initData) {
            //If no init data is provided, we can't set the elements
            //on object initialization. This happens when a TimeSheetEntry
            //is added from the form.
            if (initData) {
                //Sanity check.
                for (i = _constructorArgs.length; i -= 1;) {
                    if (!(_constructorArgs[i] in initData)) {
                        initError = true;
                        console.error(
                            'Required TimeSheetEntry constructor arg missing: ',
                            _constructorArgs[i]
                        );
                    }
                }

                if (!initError) {
                    this.setElementsFromInitData(initData);
                    this.bindElementInputs();
                }
            }

            this.set(this.getElementValues(_valuesNeededToSave));

            return this;
        };

        /**
         * Get the value of the given key in this entry's data array.
         *
         * @param {string} key
         */
        this.get = function get(key) {
            if (!(key in this._elementData)) {
                console.error('This entry does not have dat associated with :' + key);
            }

            return this._elementData[key];
        };

        /**
         * Return the total cost of the entry.
         *
         * @returns {number}
         */
        this.getTotal = function getTotal() {
            return (this.hourlyPrice * this.hours);
        };

        return this;
    };

    PE.TimeSheetEntry.prototype = (function () {
    }());
}(window.PE = window.PE || {}, jQuery));
