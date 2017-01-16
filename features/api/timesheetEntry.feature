Feature: Timesheet Entry Api access
  In order to obtain data about a timesheet entry
  As a user
  I should be able to receive data from the api.

  @fixtures
  Scenario: GET an existing time sheet entry
    Given I request "GET /api/timesheet/entry/1"
    Then the response status code should be 200
    And an "id" property should exist
    And a "time sheet id" property should exist
    And a "hours" property should exist
    And a "description" property should exist
    And a "hourly price" property should exist
    And a "created at" property should exist

  Scenario: GET a non-existent time sheet entry
    Given I request "GET /api/timesheet/entry/5"
    Then the response status code should be 404
    And the data should be empty

  Scenario: GET multiple time sheet entries
    Given I request "GET /api/timesheet/entry"
    Then the response status code should be 200
    And I should have a list of data
    And the data should have values for the following:
    """
    id
    time sheet id
    hours
    description
    hourly price
    created at
    """

  Scenario: POST time sheet entry data
    Given I have the following data:
      | time sheet id | hours | description        | hourly price |
      | 1             | 4.5   | My description     | 3.5          |
      | 1             | 3     | Second description | 3            |
    And I request "POST /api/timesheet/entry"
    Then the response status code should be 201
    And I should have a list of data
    And the list should contain 2 entries
    And regarding item 1 returned in the response
    And an "id" property should exist
    And a "time sheet id" property should equal 1
    And an "hours" property should equal "4.5"
    And a "description" property should equal "My description"
    And an "hourly price" property should equal "3.5"
    And a "created at" property should exist
    And regarding item 2 returned in the response
    And an "id" property should exist
    And a "time sheet id" property should equal 1
    And an "hours" property should equal "3"
    And a "description" property should equal "Second description"
    And an "hourly price" property should equal "3"
    And a "created at" property should exist

  Scenario: POST invalid time sheet entry data
    Given I have invalid json data
    And I request "POST /api/timesheet/entry"
    Then the response status code should be 400
    And the content type should be "application/problem+json"
    And a "title" property should equal "The JSON that was sent is invalid!"
    And a "type" property should equal "invalid_body_format"
