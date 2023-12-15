@theme @theme_boost_union @theme_boost_union_smartmenusettings @theme_boost_union_smartmenusettings_menuitems @theme_boost_union_smartmenusettings_menuitems_presentation
Feature: Configuring the theme_boost_union plugin on the "Smart menus" page, applying different presentation options to the individual smart menu items
  In order to use the features
  As admin
  I need to be able to configure the theme Boost Union plugin

  Background:
    Given I log in as "admin"
    And the following "courses" exist:
      | fullname               | shortname | category |
      | Test course1           | C1        | 0        |
      | Test course2           | C2        | 0        |
      | Test course word count | C3        | 0        |
    And the following "users" exist:
      | username |
      | user1    |
    And I create smart menu with the following fields to these values:
      | Title            | Quick links              |
      | Menu location(s) | Main, Menu, User, Bottom |
  @javascript
  Scenario Outline: Smartmenus: Menu items: Presentation - Display the menu items title with icon
    Given I log in as "admin"
    And I set "Quick links" smart menu items with the following fields to these values:
      | Title              | Resources        |
      | Menu item type     | Heading          |
      | Title presentation | <presentationtitle>  |
    And I should see "Resources" in the "smartmenus_items" "table"
    And I click on ".action-edit" "css_element" in the "Resources" "table_row"
    Then I click on "input[name='iconsearch']" "css_element"
    Then I click on ".fa-info-circle" "css_element" in the ".fontawesome-picker .popover-body " "css_element"
    And I click on "Save changes" "button"
    And I <desktopshouldornot> see smart menu "Quick links" item "Resources" in location "Main, Menu, User"
    And ".fa-info-circle" "css_element" should exist in the ".primary-navigation .dropdown-item.menu-item-heading" "css_element"
    And ".fa-info-circle" "css_element" should exist in the ".boost-union-menubar .dropdown-item" "css_element"
    And ".fa-info-circle" "css_element" should exist in the "#usermenu-carousel .carousel-item.submenu .dropdown-item" "css_element"
    Then I change window size to "mobile"
    And I <mobiletitleshould> see smart menu "Quick links" item "Resources" in location "Menu, User"
    And I click on "More" "button" in the ".bottom-navigation" "css_element"
    And I click on "Quick links" "link" in the "#theme_boost-drawers-primary" "css_element"
    And I <mobiletitleshould> see "Resources" in the "#theme_boost-drawers-primary" "css_element"
    And ".fa-info-circle" "css_element" should exist in the ".primary-navigation .dropdown-item.menu-item-heading" "css_element"
    And ".fa-info-circle" "css_element" should exist in the ".boost-union-menubar .dropdown-item" "css_element"
    And ".fa-info-circle" "css_element" should exist in the "#usermenu-carousel .carousel-item.submenu .dropdown-item" "css_element"
    Then I change window size to "large"

    Examples:
      | presentationtitle                                      | desktopshouldornot | mobiletitleshould |
      | Show text and icon as title                            | should             | should            |
      | Hide title text and show only icon (on all devices)    | should not         | should not        |
      | Hide title text and show only icon (on mobile devices) | should             | should not        |
