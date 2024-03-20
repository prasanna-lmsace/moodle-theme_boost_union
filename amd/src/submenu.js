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
 * Theme Boost Union - Initializes and handles events of the sub menus in smart menu.
 *
 * @module     theme_boost_union/submenu
 * @copyright  2023 bdecent GmbH <https://bdecent.de>
 * @copyright  based on code from core/usermenu by Mihail Geshoski
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import $ from 'jquery';
import {space, enter} from 'core/key_codes';

/**
 * Smartmenu submenu constants.
 */
const Selectors = {
    smartMenuCarousel: '[data-toggle="smartmenu-carousel"]',
    smartMenuCarouselClass: '.theme-boost-union-smartmenu-carousel',
    smartMenuCarouselItem: '[data-toggle="smartmenu-carousel"] .carousel-item',
    smartMenuCarouselItemActive: '[data-toggle="smartmenu-carousel"] .carousel-item.active',
    smartMenuCarouselNavigationLink: '[data-toggle="smartmenu-carousel"] .carousel-navigation-link',
    moreMenuCarouselDropdown: '.theme-boost-union-moremenu-carousel .moremenu .dropdownmoremenu',
    smartMenuDropDownItems: 'ul.dropdown-menu li.nav-item',
    moreMenuCarousel: '.moremenu-carousel',
    boostUnionMoreMenu: '.boost-union-moremenu',
    carouselItem: '.carousel-item',
    carouselMainItem: '#carousel-item-main',
    carouselInner: '.carousel-inner',
    dropDownMenu: '.dropdown-menu',
    roleMenu: '[role="menu"]',
    attr: {
        smartMenuCarouselTargetAttr: 'data-carousel-target-id',
        smartMenuCarouselNavigationClass: 'carousel-navigation-link',
        moreMenuCarousel: 'moremenu-carousel',
    },
    region: {
        dropDown: '[data-region="moredropdown"]'
    }
};


/**
 * Register event listeners.
 *
 * @param {HTMLElement} smartMenu
 */
const registerEventListeners = (smartMenu) => {

    // Handle click events in the smart menu.
    smartMenu.addEventListener('click', (e) => {

        // Handle click event on the carousel navigation (control) links in the smart menu.
        if (e.target.matches(Selectors.smartMenuCarouselNavigationLink)) {
            carouselManagement(e);
        }

    }, true);

    smartMenu.addEventListener('keydown', e => {
        // Handle keydown event on the carousel navigation (control) links in the smart menu.
        if ((e.keyCode === space ||
            e.keyCode === enter) &&
            e.target.matches(Selectors.smartMenuCarouselNavigationLink)) {
            e.preventDefault();
            carouselManagement(e);
        }
    }, true);

    /**
     * We do the same actions here even if the caller was a click or button press.
     *
     * @param {Event} e The triggering element and key presses etc.
     */
    const carouselManagement = e => {

        // By default the smart menu dropdown element closes on a click event. This behaviour is not desirable
        // as we need to be able to navigate through the carousel items (submenus of the smart menu) within the
        // smart menu. Therefore, we need to prevent the propagation of this event and then manually call the
        // carousel transition.
        e.stopPropagation();
        // The id of the targeted carousel item.
        const targetedCarouselItemId = e.target.dataset.carouselTargetId;
        const targetedCarouselItem = smartMenu.querySelector('#' + targetedCarouselItemId);
        // Get the position (index) of the targeted carousel item within the parent container element.
        const index = Array.from(targetedCarouselItem.parentNode.children).indexOf(targetedCarouselItem);
        // Navigate to the targeted carousel item.
        $(smartMenu.querySelector(Selectors.smartMenuCarousel)).carousel(index);

    };

    // Handle the 'hide.bs.dropdown' event (Fired when the dropdown menu is being closed).
    $(Selectors.smartMenu).on('hide.bs.dropdown', () => {
        // Reset the state once the smart menu dropdown is closed and return back to the first (main) carousel item
        // if necessary.
        $(smartMenu.querySelector(Selectors.smartMenuCarousel)).carousel(0);
    });

    // Handle the 'slid.bs.carousel' event (Fired when the carousel has completed its slide transition).
    $(Selectors.smartMenuCarousel).on('slid.bs.carousel', () => {
        const activeCarouselItem = smartMenu.querySelector(Selectors.smartMenuCarouselItemActive);
        // Set the focus on the newly activated carousel item.
        activeCarouselItem.focus();
    });
};


/**
 * Make the top level menus work as carousel when moved into more menu.
 * Clone the menu items from the moremenu dropdown menu and create a custom dropdown menu for carousel.
 */
const moreMenuItemCarousel = () => {

    // Re-initializes the submenu carousel on window resize.
    window.onresize = () => createMoreMenuCarousel();

    /**
     * Initialize the carousel functionality for parent-level menus moved into the more menu.
     * Top-level dropdown items become first-level submenus when moved into the more menu.
     * First and second-level submenus are displayed as carousels.
     *
     * This method initializes the carousel submenu functionality for the more menus of primary and menubar navigations.
     */
    const createMoreMenuCarousel = () => {
        // Get the primary navigation more menu and initialize carousel submenu
        var primaryNav = document.querySelector('.primary-navigation ul.more-nav .dropdownmoremenu');
        carouselSubmenu(primaryNav);

        // Get the menubar more menu and initialize carousel submenu
        var menuBar = document.querySelector('nav.menubar ul.more-nav .dropdownmoremenu');
        carouselSubmenu(menuBar);
    };

    /**
     * Implements carousel functionality for submenus of more menu items.
     *
     * Retrieves the list of menus moved into the more menu and copies those items to a custom dropdown menu
     * as part of the theme-boost-union-smartmenu-carousel. The items are placed into the first carousel item,
     * and submenus from the menus are moved as separate carousel items. Each top-level menu contains a data attribute
     * for the submenu's target-carousel-id.
     *
     * When the more menu is clicked, the original dropdown-menu is hidden,
     * and the created smartmenu carousel dropdown-menu is shown.
     *
     * The visibility of the carousel dropdown changes based on the visibility class "show" of the original dropdowns.
     *
     * @param {HTMLElement} moreMenu The more menu element.
     * @returns {void}
     */
    const carouselSubmenu = (moreMenu) => {

        // Fetches the list of moved menu items from ul.dropdown-menu li.nav-items.
        var items = moreMenu.querySelectorAll(Selectors.smartMenuDropDownItems);

        if (items.length <= 0) {
            return;
        }

        // Close the dropdown menu of the more menu to prevent faulty clicks on elements moved outside
        // of the more menu during resizing.
        if (moreMenu.querySelector(Selectors.dropDownMenu).classList.contains('show')) {
            Array.from(moreMenu.querySelectorAll(Selectors.dropDownMenu)).forEach((e) => e.classList.remove('show'));
        }

        var mainmenus = [];
        var submenus = [];

        // Clone the items, move the submenu dropdown to separate carousel item.
        items.forEach((item) => {

            // Create a deep clone of the menu item node.
            var menuItem = item.cloneNode(true);

            // Check if the menu item contains any submenus.
            if (menuItem.querySelector(Selectors.boostUnionMoreMenu) !== undefined
                && menuItem.querySelectorAll(Selectors.carouselItem) !== null) {

                // Fetch the list of submenu carousel items.
                var carouselItems = menuItem.querySelectorAll(Selectors.carouselItem);

                carouselItems.forEach((el) => {
                    // Clone the submenu and remove it from the menu item to prevent misindexing of carousel items.
                    var cloned = el.cloneNode(true);
                    cloned.classList.remove('active'); // Ensure the main menu-based carousel item is active.
                    submenus.push(cloned);
                    el.remove(); // Remove the submenu from the cloned menu item.
                });

                // Check if the dropdown nav link of this item contains the data set of carousel target.
                // Add the "carousel-navigation-link" class to move to the targeted submenu when this link is clicked.
                if (menuItem.querySelector('a')
                    && menuItem.querySelector('a').hasAttribute(Selectors.attr.smartMenuCarouselTargetAttr)) {
                    menuItem.querySelector('a').classList.add(Selectors.attr.smartMenuCarouselNavigationClass);
                }
            }

            // Add the cloned menu item to the main menu items array.
            mainmenus.push(menuItem);
        });

        // Fetch the more menu carousel element within the current more menu.
        var moreMenuCarousel = moreMenu.querySelector(Selectors.moreMenuCarousel);

        // Check if the more menu carousel exists and contains the main carousel item.
        if (moreMenuCarousel && moreMenuCarousel.querySelector(Selectors.carouselMainItem) !== null) {

            var mainCarouselItem = moreMenuCarousel.querySelector(Selectors.carouselMainItem);
            // Clear any previously created items from the main carousel item.
            Array.from(mainCarouselItem.childNodes).forEach((e) => e.remove());
            // Remove all carousel items except the main carousel item.
            moreMenuCarousel.querySelectorAll(Selectors.carouselItem).forEach((m) => m.id == 'carousel-item-main' || m.remove());

            // Append the current navigation items to the main carousel item.
            mainmenus.forEach((e) => mainCarouselItem.appendChild(e));
            mainCarouselItem.classList.add('active'); // Make the main carousel item as active.

            // Append the submenu items to the carousel inner container.
            submenus.forEach((sb) => moreMenuCarousel.querySelector(Selectors.carouselInner).appendChild(sb));
        }
    };

};


/**
 * Registers event listeners for showing and hiding dropdown menus within the parent menu of the dropdownmoremenu.
 *
 * When the 'shown' event is triggered, it shows the created carousel dropdown and hides the original dropdown-menu,
 * as the original dropdown menu doesn't show submenus.
 *
 * When the 'hidden' event is triggered, it hides the created carousel dropdown.
 *
 * Creates a click event listener for the card menus inside the moremenu, toggling their visibility on click.
 *
 * On visibility toggle, calculates the width of the card menu based on the document size and dropdown menu position.
 * Moves the position of card menus to the left or right based on the dropdown menu's position.
 */
const registerMoreMenuCarouselDropdown = () => {

    // Find all moremenu elements.
    var moreMenu = document.querySelectorAll(Selectors.moreMenuCarouselDropdown);

    moreMenu.forEach((menu) => {

        // Parent dropdown element of the menu item.
        var parentMenu = menu.parentNode;

        // Observe the 'shown' event of the dropdown.
        $(parentMenu).on('shown.bs.dropdown', (e) => {

            // Find the dropdown menu of the shown dropdown item.
            var dropdown = e.relatedTarget.parentNode.querySelector(Selectors.dropDownMenu);
            var moreMenuCarousel = dropdown.nextElementSibling;

            // Check if the next element of the dropdown menu is moremenu carousel,
            // And the class list contains the moremenu-carousel.
            if (moreMenuCarousel && moreMenuCarousel.classList.contains(Selectors.attr.moreMenuCarousel)
                && moreMenuCarousel.querySelector(Selectors.dropDownMenu) !== null) {

                // Show the carousel dropdown menu.
                moreMenuCarousel.querySelector(Selectors.dropDownMenu).classList.add('show');
                dropdown.classList.add('hide-on-show'); // Hide the moodle core moremenus dropdown list.

                // Toggle the card menus inside moremenu using click event listener.
                const moreDropdown = moreMenuCarousel.querySelector(Selectors.region.dropDown);
                moreDropdown.querySelectorAll('.dropdown').forEach((cardMenu) => {
                    // Hide the shown card menus.
                    cardMenu.querySelector(Selectors.roleMenu).classList.remove('show');
                    cardMenu.removeEventListener('click', toggledropdown, true);
                    cardMenu.addEventListener('click', toggledropdown, true);
                });
            }
        });

        // Add event listener for the 'hidden' event.
        $(parentMenu).on('hidden.bs.dropdown', (e) => {

            var dropdown = e.relatedTarget.parentNode.querySelector(Selectors.dropDownMenu);
            var moreMenuCarousel = dropdown.nextElementSibling;
            // Check if the next element of the dropdown menu is moremenu carousel.
            if (moreMenuCarousel && moreMenuCarousel.classList.contains(Selectors.attr.moreMenuCarousel)
                && moreMenuCarousel.querySelector(Selectors.dropDownMenu) !== null) {
                // Hide the carousel dropdown menu.
                moreMenuCarousel.querySelector(Selectors.dropDownMenu).classList.remove('show');
                dropdown.classList.remove('hide-on-show'); // Remove the 'hide-on-show' class from the original dropdown menu.
            }
        });
    });

    /**
     * Toggle the visiblity of the card menu.
     *
     * @param {event} e
     */
    const toggledropdown = e => {

        const innerMenu = e.target.parentNode.querySelector(Selectors.roleMenu);

        if (innerMenu) {
            innerMenu.classList.toggle('show');


            // Calculate and adjust the position of the card menu based on the dropdown menu's position.
            if (innerMenu.classList.contains('show')) {
                var dropDown = innerMenu.parentNode.closest(Selectors.dropDownMenu);
                var rect = dropDown.getBoundingClientRect();
                var right = document.scrollingElement.clientWidth - rect.right;

                // Use the left section of the moremenu dropdown.
                if (rect.left >= right) {
                    innerMenu.style.width = rect.left + 'px';
                    innerMenu.style.left = 0;
                } else {
                    // Use the right side of the moremenu dropdown.
                    innerMenu.style.width = right + 'px';
                    innerMenu.style.left = 'inherit';
                    innerMenu.style.right = 0;
                }
            }
        }
        e.stopPropagation();
    };
};

/**
 * Initialize the sub menus.
 */
const init = () => {

    const smartMenus = document.querySelectorAll(Selectors.smartMenuCarouselClass);

    // Registers event listeners to enable the submenu items carousel.
    if (smartMenus !== undefined && smartMenus.length !== null) {
        smartMenus.forEach((e) => registerEventListeners(e));
    }

    // Initializes the submenu carousel for the menus inside the more menu.
    moreMenuItemCarousel();
    // Registers event listeners for dropdown menu visibility changes to update the carousel menu.
    registerMoreMenuCarouselDropdown();
};

export default {
    init: init,
};
