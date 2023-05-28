@theme @theme_boost_union @theme_boost_union_smartmenu @theme_boost_union_menuitems_dynamiccourses
Feature: Configuring the theme_boost_union plugin on the "Smart menus" page, applying different items settings.
  In order to use th features
  As admin
  I need to be able to configure smart menu dynamic course item type to the theme Boost Union plugin

  Background:
    Given the following "categories" exist:
      | name         | category | idnumber |
      | Category 01  | 0        | CAT1     |
      | Category 02  | 0        | CAT2     |
      | Category 03  | 0        | CAT3     |
    And the following "courses" exist:
      | fullname  | shortname | category    | enablecompletion |
      | Course 01 | C1        | CAT1        |   1              |
      | Course 02 | C2        | CAT1        |1              |
      | Course 03 | C3        | CAT1        |1              |
      | Course 04 | C4        | CAT2        |1              |
      | Course 05 | C5        | CAT2        |1              |
      | Course 06 | C6        | CAT3        |1              |
      | Course 07 | C7        | CAT3        |1              |
    And the following "activities" exist:
      | activity   | name                   | intro                         | course | idnumber    | section | completion |
      | assign     | Test assignment name   | Test assignment description   | C1     | assign1     | 0       |   1        |
      | assign     | Test assignment name1  | Test assignment description   | C1     | assign2     | 0       |   1        |
      | assign     | Test assignment name   | Test assignment description   | C2     | assign1     | 0       |   1        |
      | assign     | Test assignment name1  | Test assignment description   | C2     | assign2     | 0       |   1        |
    And the following "users" exist:
      | username | firstname | lastname | email             |
      | student1 | student   | User 1   | student1@test.com |
      | student2 | student2  | User 2   | student2@test.com |
      | teacher  | Teacher   | User 1   | teacher2@test.com |
    And the following "course enrolments" exist:
      | user     | course | role           | timestart | timeend   |
      | teacher  | C1     | editingteacher |   0       |   0       |
      | student1 | C1     | student        |   0       |   0       |
      | student2 | C1     | student        |   ## now ##     | ## tomorrow ##|
      | student1 | C2     | student        |   0       |   0       |
      | student2 | C2     | student        |   0       | ## yesterday ##|
      | student1 | C3     | student        |   0       |   0       |
      | student2 | C3     | student        |## tomorrow ## |   0       |
      | student1 | C4     | student        |   0       |   0       |
      | student2 | C4     | student        |   0       |   0       |
      | admin    | C1     | editingteacher |   0       |   0       |
      | admin    | C2     | editingteacher |   0       |   0       |
      | admin    | C3     | teacher        |   0       |   0       |
      | admin    | C4     | manager        |   0       |   0       |
      | admin    | C5     | student        |   0       |   0       |
      | admin    | C6     | student        |   0       |   0       |
    Given I log in as "admin"
    And I create menu with the following fields to these values:
    | Title     | List menu                |
    | Locations | Main, Menu, User, Bottom |
    And I set "List menu" items with the following fields to these values:
    | Title     | Dynamic courses |
    | Type      | Dynamic courses |

  @javascript
  Scenario: Smartmenu Dynamic courses Item: Check condition.
    Given I navigate to smartmenus
    And I should see "List menu" in the "smartmenus" "table"
    And I click on ".action-list-items" "css_element" in the "List menu" "table_row"
    Then I should see "Dynamic courses"
    And I click on ".action-edit" "css_element" in the "Dynamic courses" "table_row"
    Then I should see "Category"
    Then I should see "Enrolment role"
    Then I should see "Completion status"
    Then I should see "Date range"
    Then I should see "Enrolment role"
    Then I press "Save changes"

  @javascript
  Scenario: Smartmenu Dynamic courses Item: list courses.
    #And I should see menu "List menu" item "Dynamic courses" in location "Main, Menu, User, Bottom"
    And I should see menu "List menu" item "Course 01" in location "Main, Menu, User, Bottom"
    And I should see menu "List menu" item "Course 02" in location "Main, Menu, User, Bottom"
    And I should see menu "List menu" item "Course 03" in location "Main, Menu, User, Bottom"
    And I should see menu "List menu" item "Course 04" in location "Main, Menu, User, Bottom"
    And I should see menu "List menu" item "Course 05" in location "Main, Menu, User, Bottom"

  @javascript
  Scenario: Smartmenu Dynamic courses Item: Category contidion.
    Given I navigate to smartmenus
    And I click on ".action-list-items" "css_element" in the "List menu" "table_row"
    And I click on ".action-edit" "css_element" in the "Dynamic courses" "table_row"
    Then I set the field "Category" to "Category 01"
    Then I press "Save changes"
    And I should see menu "List menu" item "Course 01" in location "Main, Menu, User, Bottom"
    And I should see menu "List menu" item "Course 02" in location "Main, Menu, User, Bottom"
    And I should see menu "List menu" item "Course 03" in location "Main, Menu, User, Bottom"
    And I should not see menu "List menu" item "Course 04" in location "Main, Menu, User, Bottom"
    And I should not see menu "List menu" item "Course 05" in location "Main, Menu, User, Bottom"

  @javascript
  Scenario: Smartmenu Dynamic courses Item: Enrolment contidion.
    Given I navigate to smartmenus
    And I click on ".action-list-items" "css_element" in the "List menu" "table_row"
    And I click on ".action-edit" "css_element" in the "Dynamic courses" "table_row"
    Then I set the field "Enrolment role" to "Non-editing teacher, Teacher"
    Then I press "Save changes"
    And I should see menu "List menu" item "Course 01" in location "Main, Menu, User, Bottom"
    And I should see menu "List menu" item "Course 02" in location "Main, Menu, User, Bottom"
    And I should see menu "List menu" item "Course 03" in location "Main, Menu, User, Bottom"
    And I should not see menu "List menu" item "Course 04" in location "Main, Menu, User, Bottom"
    And I should not see menu "List menu" item "Course 05" in location "Main, Menu, User, Bottom"
    And I should not see menu "List menu" item "Course 06" in location "Main, Menu, User, Bottom"
    And I click on ".action-edit" "css_element" in the "Dynamic courses" "table_row"
    Then I set the field "Enrolment role" to "Teacher"
    Then I press "Save changes"
    And I should see menu "List menu" item "Course 01" in location "Main, Menu, User, Bottom"
    And I should see menu "List menu" item "Course 02" in location "Main, Menu, User, Bottom"
    And I should not see menu "List menu" item "Course 03" in location "Main, Menu, User, Bottom"

  @javascript
  Scenario: Smartmenu Dynamic courses Item: Completion contidion.
    Given I navigate to smartmenus
    And I click on ".action-list-items" "css_element" in the "List menu" "table_row"
    And I click on ".action-edit" "css_element" in the "Dynamic courses" "table_row"
    Then I set the field "Completion status" to "Enrolled, In progress, Completed"
    Then I press "Save changes"

    # need to set course completion to activity.
    And I am on "Course 1" course homepage with editing mode on
    And I navigate to "Course completion" in current page administration
    And I click on "Condition: Completion of other courses" "link"
    And I set the following fields to these values:
      | Courses available| Course 2, Course 3, Course 4, Course 5 |
    And I press "Save changes"


    Then I log out
    Then I log in as "student1"
    Then I am on "Course 01" course homepage
    And the manual completion button of "Test assignment name" is displayed as "Mark as done"
    And I toggle the manual completion state of "Test assignment name"
    And the manual completion button of "Test assignment name1" is displayed as "Mark as done"
    And I toggle the manual completion state of "Test assignment name1"
    Then I am on "Course 02" course homepage
    And the manual completion button of "Test assignment name" is displayed as "Mark as done"
    And I toggle the manual completion state of "Test assignment name"
    And I should see menu "List menu" item "Course 01" in location "Main, Menu, User, Bottom"
    And I should see menu "List menu" item "Course 02" in location "Main, Menu, User, Bottom"
    And I should see menu "List menu" item "Course 03" in location "Main, Menu, User, Bottom"
    And I should see menu "List menu" item "Course 04" in location "Main, Menu, User, Bottom"
    And I should not see menu "List menu" item "Course 05" in location "Main, Menu, User, Bottom"
    And I should not see menu "List menu" item "Course 06" in location "Main, Menu, User, Bottom"
    Then I log out
    Then I log in as "admin"
    And I navigate to smartmenus
    And I click on ".action-list-items" "css_element" in the "List menu" "table_row"
    And I click on ".action-edit" "css_element" in the "Dynamic courses" "table_row"
    Then I set the field "Completion status" to "In progress, Completed"
    Then I press "Save changes"
    Then I log out
    Then I log in as "student1"
    And I should see menu "List menu" item "Course 01" in location "Main, Menu, User, Bottom"
    And I should see menu "List menu" item "Course 02" in location "Main, Menu, User, Bottom"
    And I should not see menu "List menu" item "Course 03" in location "Main, Menu, User, Bottom"
    And I should not see menu "List menu" item "Course 04" in location "Main, Menu, User, Bottom"
    Then I log out
    Then I log in as "admin"
    And I navigate to smartmenus
    And I click on ".action-list-items" "css_element" in the "List menu" "table_row"
    And I click on ".action-edit" "css_element" in the "Dynamic courses" "table_row"
    Then I set the field "Completion status" to "Completed"
    Then I press "Save changes"
    Then I log out
    Then I log in as "student1"
    And I should see menu "List menu" item "Course 01" in location "Main, Menu, User, Bottom"
    And I should not see menu "List menu" item "Course 02" in location "Main, Menu, User, Bottom"
    And I should not see menu "List menu" item "Course 03" in location "Main, Menu, User, Bottom"
    And I should not see menu "List menu" item "Course 04" in location "Main, Menu, User, Bottom"
    Then I log out
    And I log in as "admin"

  @javascript
  Scenario: Smartmenu Dynamic courses Item: Date contidion.
    Given I navigate to smartmenus
    And I click on ".action-list-items" "css_element" in the "List menu" "table_row"
    And I click on ".action-edit" "css_element" in the "Dynamic courses" "table_row"
    Then I set the field "Date range" to "Past, Present, Future"
    Then I press "Save changes"
    Then I log out
    Then I log in as "student1"
    And I should see menu "List menu" item "Course 01" in location "Main, Menu, User, Bottom"
    And I should see menu "List menu" item "Course 02" in location "Main, Menu, User, Bottom"
    And I should see menu "List menu" item "Course 03" in location "Main, Menu, User, Bottom"
    And I should see menu "List menu" item "Course 04" in location "Main, Menu, User, Bottom"
    Then I log out

    Then I log in as "admin"
    And I navigate to smartmenus
    And I click on ".action-list-items" "css_element" in the "List menu" "table_row"
    And I click on ".action-edit" "css_element" in the "Dynamic courses" "table_row"
    Then I set the field "Date range" to "Future"
    Then I press "Save changes"
    Then I log out
    Then I log in as "student1"
    And I should not see menu "List menu" item "Course 01" in location "Main, Menu, User, Bottom"
    And I should see not menu "List menu" item "Course 02" in location "Main, Menu, User, Bottom"
    And I should see menu "List menu" item "Course 03" in location "Main, Menu, User, Bottom"
    Then I log out


    Then I log in as "admin"
    And I navigate to smartmenus
    And I click on ".action-list-items" "css_element" in the "List menu" "table_row"
    And I click on ".action-edit" "css_element" in the "Dynamic courses" "table_row"
    Then I set the field "Date range" to "Present"
    Then I press "Save changes"
    Then I log out
    Then I log in as "student1"
    And I should see menu "List menu" item "Course 01" in location "Main, Menu, User, Bottom"
    And I should not see menu "List menu" item "Course 02" in location "Main, Menu, User, Bottom"
    And I should not see menu "List menu" item "Course 03" in location "Main, Menu, User, Bottom"
    Then I log out

    Then I log in as "admin"
    And I navigate to smartmenus
    And I click on ".action-list-items" "css_element" in the "List menu" "table_row"
    And I click on ".action-edit" "css_element" in the "Dynamic courses" "table_row"
    Then I set the field "Date range" to "Past"
    Then I press "Save changes"
    Then I log out
    Then I log in as "student1"
    And I should not see menu "List menu" item "Course 01" in location "Main, Menu, User, Bottom"
    And I should see menu "List menu" item "Course 02" in location "Main, Menu, User, Bottom"
    And I should not see menu "List menu" item "Course 03" in location "Main, Menu, User, Bottom"
    Then I log out

  @javascript
  Scenario: Smartmenu Dynamic courses Item: profile field contidion.
    And I navigate to "Courses > Course custom fields" in site administration
    And I click on "Add a new custom field" "link"
    And I click on "Short text" "link"
    And I set the following fields to these values:
      | Name       | Test field |
      | Short name | testfield  |
    And I click on "Save changes" "button" in the "Adding a new Short text" "dialogue"
    Then I follow "Dashboard"
    Then I am on "Course 01" course homepage
    And I navigate to "Settings" in current page administration
    And I set the following fields to these values:
      | Test field | value1 |
    And I click on "Save and display" "button"

    Then I am on "Course 02" course homepage
    And I navigate to "Settings" in current page administration
    And I set the following fields to these values:
      | Test field | value1 |
    And I click on "Save and display" "button"

    Then I am on "Course 03" course homepage
    And I navigate to "Settings" in current page administration
    And I set the following fields to these values:
    | Test field | value2 |
    And I click on "Save and display" "button"

    Then I navigate to smartmenus
    And I click on ".action-list-items" "css_element" in the "List menu" "table_row"
    And I click on ".action-edit" "css_element" in the "Dynamic courses" "table_row"
    Then I should see "Test field"
    Then I set the field "Test field" to "value1"
    Then I press "Save changes"
    And I should see menu "List menu" item "Course 01" in location "Main, Menu, User, Bottom"
    And I should see menu "List menu" item "Course 02" in location "Main, Menu, User, Bottom"
    And I should not see menu "List menu" item "Course 03" in location "Main, Menu, User, Bottom"
    And I should not see menu "List menu" item "Course 04" in location "Main, Menu, User, Bottom"

    And I click on ".action-edit" "css_element" in the "Dynamic courses" "table_row"
    Then I should see "Test field"
    Then I set the field "Test field" to "value2"
    Then I press "Save changes"

    And I should not see menu "List menu" item "Course 01" in location "Main, Menu, User, Bottom"
    And I should not see menu "List menu" item "Course 02" in location "Main, Menu, User, Bottom"
    And I should see menu "List menu" item "Course 03" in location "Main, Menu, User, Bottom"
    And I should not see menu "List menu" item "Course 04" in location "Main, Menu, User, Bottom"









