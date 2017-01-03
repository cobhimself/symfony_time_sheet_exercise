(function (PE, $, undefined) {
    'use strict';

    /**
     * PE.TimeSheetEntry
     *
     * @todo Performance would be increased if a prototype for this "class"
     *       was used for common methods/properties.
     *
     * @constructor
     * @name PE.TimeSheetEntry
     * Represents a TimeSheetEntry.
     */
    PE.TimeSheetEntry = function TimeSheetEntry(initData) {
        /**
         * Holds the data for this TimeSheetEntry.
         *
         * @type {{}}
         * @private
         */
        this._elementData = {};

        /**
         * Holds references to the elements the TimeSheetEntry values
         * live within.
         *
         * @private
         * @type {Array}
         */
        this._elements = [];

        var i, len, initError = false,

            /**
             * Arguments that are required within the constructor.
             *
             * @type {[*]}
             * @private
             */
            _constructorArgs = [
                'row', 'onDelete', 'onEdit', 'onSave', 'onCancel'
            ],

            /**
             * Values for these keys are required in order to save
             * the time sheet entry.
             *
             * @private
             * @type {String[]}
             */
            _valuesNeededToSave = [
                'description',
                'hourlyPrice',
                'hours'
            ],

            /**
             * Holds the callbacks to be called on the entry's buttons being
             * pressed.
             *
             * @private
             * @type {*}
             */
            _callbacks = {},
            /**
             * A jQuery object that contains what an entry row would look like.
             * @type {jQuery}
             */
            _entryRowTemplate;

        /**
         * Show, or hide, each of the edit inputs for this TimeSheetEntry.
         *
         * @param {boolean} [flag=true]
         *
         * @return {PE.TimeSheetEntry}
         */
        this.showEditInputs = function showEditInputs(flag) {

            var i, columns = [
                '.js-entry-description',
                '.js-entry-hourlyPrice',
                '.js-entry-hours',
            ];

            for (i = columns.length; i -= 1;) {
                this.returnInputGroupForColumn(columns[i]);
                //Fill the input with the appropriate value
                /** STOPPED HERE, will need to make columns an object with col class to data key.**/
            }

            return this;
        };

        this.returnInputGroupForColumn = function returnInputGroupForColumn(col) {
            var column = $(this.row).find(col),
                group = column.find('.input-group');

            if (group.length === 0) {
                //Grab the column from the entry row template
                group = $(_entryRowTemplate).find(col).find('.input-group').hide();
                //Add the new input group to the current row at the given column
                group = column.prepend(group);
            }

            return group;
        }

        this.updateHourlyPrice = function updateHourlyPrice (event) {
            var entry = event.data.entry;

            entry.set('hours', $(this).val());
            entry.updateTotal();
        };

        this.updateHours = function updateHours (event) {
            var entry = event.data.entry;

            entry.set('hourlyPrice', $(this).val());
            entry.updateTotal();
        };

        /**
         * Update the total for this entry
         */
        this.updateTotal = function updateTotal(event) {
            var entry = event.data.entry;

            $(_entryRowTemplate).find('.row-total').text(entry.getTotal());
        };

        /**
         * Show or hide the element with the given element name.
         *
         * @param {string} elementName The element name to show or hide.
         * @param {boolean} [flag=true] Whether or not to show the element.
         * @private
         */
        this.showOrHide = function showOrHide(elementName, flag) {
            flag = (flag === undefined) ? true : false;

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
         * Sets the value for an element.
         *
         * @param {string} element
         * @param {string|number} value
         */
        this.setElementValue = function setElementValue(element, value) {
            element = this.getElement(element);

            $(element).text(value);
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
         * @name PE.TimeSheetEntry.setElementsFromInitData
         * @param {object} $initData The init data given upon TimeSheetEntry
         *                           construction.
         */
        this.setElementsFromInitData = function setElementsFromInitData(initData) {
            this.row = $(initData.row);

            _callbacks.onDelete = initData.onDelete;
            _callbacks.onEdit = initData.onEdit;
            _callbacks.onSave = initData.onSave;
            _callbacks.onCancel = initData.onCancel;

            _entryRowTemplate = initData.entryRowTemplate;

            this.entryId = this.row.attr('id').replace('entry_', '');

            this._elements.description = this.row.find('.js-entry-description');
            this._elements.hourlyPrice = this.row.find('.js-entry-hourlyPrice');
            this._elements.hours = this.row.find('.js-entry-hours');
            this._elements.total = this.row.find('.js-entry-total');
            this._elements.deleteButton = this.row.find('.js-entry-delete');
            this._elements.editButton = this.row.find('.js-entry-edit');
            this._elements.saveButton = this.row.find('.js-entry-save');
            this._elements.cancelButton = this.row.find('.js-entry-cancel');
        };

        /**
         * Run on a button click event.
         *
         * @callback
         * @this {jQuery}
         * @static
         *
         * @param {Event} event
         */
        this.handleCallback = function handleCallback(event) {
            var entry = event.data.entry,
                cbName = event.data.cbName;

            _callbacks[cbName].call(entry);
        };

        /**
         * Bind all of the input elements for the given entry.
         */
        this.bindElementInputs = function bindElementInputs() {
            //Send in a reference to this TimeSheetEntry since jQuery sets 'this'
            //as the target element of the event.
            var ref,
                btnName,
                callbacks = {
                    'deleteButton': 'onDelete',
                    'saveButton': 'onSave',
                    'editButton': 'onEdit',
                    'cancelButton': 'onCancel'
                };

            for (btnName in callbacks) {
                if (callbacks.hasOwnProperty(btnName)) {
                    ref = {'entry': this, 'cbName': callbacks[btnName]};
                    $(this.getElement(btnName)).on('click', ref, this.handleCallback);
                }
            }
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
            if (typeof key === "string") {
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
            var hours = this.get('hours').replace('$', ''),
                hourlyPrice = this.get('hourlyPrice').replace('$', ''),
                total = hours * hourlyPrice;

            return total;
        };

        return this;
    };

    PE.TimeSheetEntry.prototype = (function () {
    }());
}(window.PE = window.PE || {}, jQuery));
