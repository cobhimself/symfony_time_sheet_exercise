Feature: Api access
  In order to obtain data about a timesheets
  As a user
  I should be able to receive data from the api.

  @fixtures
  Scenario: GET TimeSheet data
    Given I request "GET /api/timesheet"
    Then the response status code should be 200
    And an "id" property should exist
    And a "bill to" property should exist
    And a "created at" property should exist
