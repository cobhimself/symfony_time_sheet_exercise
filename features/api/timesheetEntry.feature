Feature: Timesheet Entry Api access
  In order to obtain data about a timesheet entry
  As a user
  I should be able to receive data from the api.

  @fixtures
  Scenario: GET existing TimeSheetEntry data
    Given I request "GET /api/timesheet/1"
    Then the response status code should be 200
    And an "id" property should exist
    And a "time sheet id" property should exist
    And a "hours" property should exist
    And a "description" property should exist
    And a "hourly price" property should exist
    And a "created at" property should exist

  Scenario: GET non-existent TimeSheetEntry data
    Given I request "GET /api/timesheet/5"
    Then the response status code should be 404
    And the data should be empty
