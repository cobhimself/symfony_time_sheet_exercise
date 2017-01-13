Feature: Api access
  In order to obtain data about a timesheets
  As a user
  I should be able to receive data from the api.

  @fixtures
  Scenario: GET a specific time sheet
    Given I request "GET /api/timesheet/1"
    Then the response status code should be 200
    And an "id" property should exist
    And a "bill to" property should exist
    And a "created at" property should exist

  Scenario: GET non-existent time sheet
    Given I request "GET /api/timesheet/99"
    Then the response status code should be 404
    And the data should be empty

  Scenario: GET multiple time sheets
    Given I request "GET /api/timesheet"
    Then the response status code should be 200
    And I should have a list of data
    And the data should have values for the following:
    """
    id
    bill to
    created at
    """

  Scenario: POST time sheet data
    Given I have the following data:
    | bill to                                                 |
    | 85289 Daniel Gardens Suite 775 Margarettatown, IA 64118 |
    And I request "POST /api/timesheet/"
    Then the response status code should be 201
    And an "id" property should exist
    And a "bill to" property should equal:
    """
    85289 Daniel Gardens Suite 775 Margarettatown, IA 64118
    """
    And a "created at" property should exist

