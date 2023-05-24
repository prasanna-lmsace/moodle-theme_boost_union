// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Theme Boost Union - JS for smartmenu to make the third level submenu support.
 *
 * @module     theme_boost_union/smartmenu
 * @copyright  bdecent GmbH 2023
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


/**
 * Implement the second level of submenu support.
 * Find the submenus inside the dropdown add event listener for click event, on the click show the submenu list.
 */
const addSubmenu = () => {
    // Fetch the list of submenus from moremenu.
    var submenu = document.querySelectorAll('nav.moremenu .dropdown-submenu');
    if (submenu !== null) {
        submenu.forEach((item) => {
            // Add event listener to show the submenu on click.
            item.addEventListener('click', (e) => {
                e.preventDefault();
                var target = e.currentTarget;
                // Hide the shown menu.
                hideSubmenus(target);
                target.classList.toggle('show');
                // Prevent the hide of parent menu.
                e.stopPropagation();
            });
        });
    }
};

/**
 * Hide visible submenus before display new submenu.
 *
 * @param {Selector} target
 */
const hideSubmenus = (target) => {
    var visibleMenu = document.querySelectorAll('nav.moremenu .dropdown-submenu.show');
    if (visibleMenu !== null) {
        visibleMenu.forEach((el) => {
            if (el != target) {
                el.classList.remove('show');
            }
        });
    }
};

/**
 * Make the no wrapped card menus scroll using swipe or drag.
 */
const cardScroll = () => {
    var cards = document.querySelectorAll('.card-dropdown.card-overflow-no-wrap');
    if (cards !== null) {
        var scrollStart; // Verify the mouse is clicked and still in click not released.
        var scrollMoved; // Prevent the click on scrolling.
        let startPos, scrollPos;

        cards.forEach((card) => {
            var scrollElement = card.querySelector('.dropdown-menu');

            scrollElement.addEventListener('mousedown', (e) => {
                scrollStart = true;
                var target = e.currentTarget.querySelector('.card-block-wrapper');
                startPos = e.pageX;
                scrollPos = target.scrollLeft;
            });

            scrollElement.addEventListener('mousemove', (e) => {
                e.preventDefault();
                if (!scrollStart) {
                    return;
                }
                scrollMoved = true;
                var target = e.currentTarget.querySelector('.card-block-wrapper');
                const scroll = e.pageX - startPos;
                target.scrollLeft = scrollPos - scroll;
            });

            scrollElement.addEventListener('click', (e) => {
                if (scrollMoved) {
                    e.preventDefault();
                    scrollMoved = false;
                }
                e.stopPropagation();
            });
            scrollElement.addEventListener('mouseleave', () => {
                scrollStart = false;
                scrollMoved = false;
            });
            scrollElement.addEventListener('mouseup', () => {
                scrollStart = false;
            });
       });
    }
};

export const init = () => {
    addSubmenu();
    cardScroll();
};
