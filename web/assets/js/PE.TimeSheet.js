(function (PE, $, undefined) {
    'use strict';

    /**
     * @class PE.TimeSheet
     */
    PE.TimeSheet = function TimeSheet(id) {

        //Force this to be called with "new"
        if (!(this instanceof PE.TimeSheet)) {
            return new PE.TimeSheet(id);
        }

        this.id = id;

        var self = {},
            $timeEntryTable = $('#timeEntryTable'),
            $timeEntryForm = $('#timeEntryForm'),
            $newEntryRowTemplate = $('#newEntryFormContainer').clone(),
            cache = new PE.util.Cache();

        /**
         * Take the data from the new entry form and create a new entry.
         */
        self.addNewEntry = function addNewEntry() {
            console.log('Create addNewEntryMethod');
        };

        /**
         * Initialize binds on the new entry form.
         */
        self.initNewEntryForm = function initNewEntryForm() {
            $('.js-add-entry-button').on('click', self.addNewEntry);
        };

        /**
         * Locate each entry on our timesheet and bind it's handlers.
         */
        self.bindEntries = function bindEntries() {
            //Initialize our entries cache
            cache.set('entries', []);

            var $entryRows = $timeEntryTable.find('.js-existing-entry');

            $entryRows.each(self.addAndBindExistingEntry);
        };

        /**
         * Callback used when binding the existing entries in the timesheet.
         * @callback
         * @this {jQuery}
         */
        self.addAndBindExistingEntry = function addAndBindExistingEntry() {
            var entries, entry, cacheKey = 'entries';

            entry = new PE.TimeSheetEntry().init({
                'row': this,
                'onDelete': self.onEntryDelete,
                'onEdit': self.onEntryEdit,
                'onSave': self.onEntrySave,
                'onCancel': self.onEntrySaveCancel,
                'entryRowTemplate': $newEntryRowTemplate
            });

            entries = cache.get(cacheKey);
            entries[entries.length] = entry;
        };

        /**
         * Callback for when an entry is deleted.
         *
         * @callback
         * @this {TimeSheetEntry}
         */
        self.onEntryDelete = function onEntryDelete() {
            alert(this.entryId);
        };

        /**
         * Callback for when an entry is edited.
         *
         * @callback
         * @this {TimeSheetEntry}
         */
        self.onEntryEdit = function onEntryEdit() {
            //Hide the edit and delete buttons.
            this.showOrHide('saveButton')
                .showOrHide('cancelButton')
                .showEditInputs()
                .showOrHide('editButton', false)
                .showOrHide('deleteButton', false);
        };

        /**
         * Callback for when an entry is saved.
         *
         * @callback
         * @this {TimeSheetEntry}
         */
        self.onEntrySave = function onEntrySave() {
            alert('Saving' + this.entryId);
        };

        /**
         * Callback for when the user clicks the cancel button while editing
         * an entry.
         *
         * @callback
         * @this {TimeSheetEntry}
         */
        self.onEntrySaveCancel = function onEntrySaveCancel() {
            this.showOrHide('saveButton', false)
                .showOrHide('cancelButton', false)
                .showEditInputs(false)
                .showOrHide('editButton')
                .showOrHide('deleteButton');
        };

        /**
         * Bind the different elements of our timesheet interface to the
         * appropriate handlers.
         */
        self.bind = function bind() {
            self.initNewEntryForm();
            self.bindEntries();
        };

        /**
         * Initialize the timesheet module with the timesheet id.
         * @param id
         */
        self.init = function init() {
            self.bind();
        };

        return {
            'init': self.init
        };
    };
}(window.PE = window.PE || {}, jQuery));
