/*
 * e107 website system
 * 
 * Copyright (c) 2001-2008 e107 Developers (e107.org)
 * Released under the terms and conditions of the
 * GNU General Public License (http://gnu.org).
 * 
 * e107 Admin Helper
 * 
 * $Source: /cvs_backup/e107_0.8/e107_files/jslib/core/admin.js,v $
 * $Revision: 1.6 $
 * $Date: 2008-12-18 16:55:46 $
 * $Author: secretr $
 * 
*/

if(typeof e107Admin == 'undefined') var e107Admin = {}

/**
 * OnLoad Init Control
 */
if(!e107Admin['initRules']) {
	e107Admin.initRules = {
		'Helper': true,
		'AdminMenu': true
	}
}

e107Admin.Helper = {
	
	/**
	 * Auto Initialize everything
	 * 
	 * Use it with e107#runOnLoad
	 * Example: e107.runOnLoad(e107Admin.Helper.init.bind(e107Admin.Helper), document, true);
	 * Do it only ONCE per page!
	 * 
	 */
	init: function() {
		this.toggleCheckedHandler = this.toggleChecked.bindAsEventListener(this);
		this.allCheckedEventHandler = this.allChecked.bindAsEventListener(this);
		this.allUncheckedEventHandler = this.allUnchecked.bindAsEventListener(this);
	
		$$('.autocheck').invoke('observe', 'click', this.toggleCheckedHandler);
		$$('button.action[name=check_all]').invoke('observe', 'click', this.allCheckedEventHandler);
		$$('button.action[name=uncheck_all]').invoke('observe', 'click', this.allUncheckedEventHandler);
		$$('button.delete', 'input.delete[type=image]', 'a.delete').invoke('observe', 'click', function(e) { 
			if(e.element().hasClassName('no-confirm') || (e.element().readAttribute('rel') &&  e.element().readAttribute('rel').toLowerCase == 'no-confirm')) return;
			var msg = e.element().readAttribute('title') || e107.getModLan('delete_confirm');
			if( !e107Helper.confirm(msg) ) e.stop(); 
		});
	},
	
	/**
	 * Event listener: Auto-toggle single checkbox on click on its container element
	 * Usage: Just be sure to write down the proper CSS rules, no JS code required
	 * if e107Admin.Helper#init is executed
	 * 
	 * Example: 
	 * <div class='autocheck'>
	 * 		<input type='checkbox' class='checkbox' />
	 * 		<div class='smalltext field-help'>Inline Help Text</div>
	 * </div>
	 * OR
	 * <td class='control'>
	 * 		<div class='auto-toggle-area autocheck'>
	 * 			<input class='checkbox' type='checkbox' />
	 *			<div class='smalltext field-help'>Inline Help Text</div>
	 *		</div>
	 * </td>
	 * Note: The important part are classes 'autocheck' and 'checkbox'. 
	 * Container tagName is not important (everything is valid)
	 * 'auto-toggle-area' class should be defined by the admin theme
	 * to control the e.g. width of the auto-toggle clickable area
	 * 
	 * Demo: e107_admin/image.php
	 * 
	 */
	toggleChecked: function(event) {
		//do nothing if checkbox/form element or link is clicked
		var tmp = event.element().nodeName.toLowerCase(); 
		if(tmp == 'input' || tmp == 'a' || tmp == 'select' || tmp == 'textarea' || tmp == 'radio') return;
		//stop event
		//event.stop();
		
		//checkbox container element
		var element = event.findElement('.autocheck'), check = null;
		if(element) { 
			check = element.select('input.checkbox'); //search for checkbox
		} 
		//toggle checked property
		if(check && check[0] && !($(check[0]).disabled)) {
			$(check[0]).checked = !($(check[0]).checked);
		}
	},
	
	/**
	 * Event listener
	 * Check all checkboxes in the current form, having name attribute value starting with 'multiaction' 
	 * by default or any value set by button's value(special command 'jstarget:')
	 * This method is auto-attached to every button having name=check_all if init() method is executed
	 * 
	 * Examples of valid inputbox markup: 
	 * <input type='checkbox' class='checkbox' name='multiaction[]'> 
	 * OR
	 * <input type='checkbox' class='checkbox' name='multiaction_something_else[]'>
	 * OR
	 * <input type='checkbox' class='checkbox' name='some_checkbox_arary[]'> (see the button example below) 
	 * OR
	 * <input type='checkbox' class='checkbox' name='some_checkbox_arary_some_more[]'> (see the button example below) 
	 * 
	 * Example of button being auto-observed (see e107Admin.Helper#init)
	 * <button class='action' type='button' name='check_all' value='Check All'><span>Check All</span></button> // default selector - multiaction
	 * OR
	 * <button class='action' type='button' name='check_all' value='jstarget:some_checkbox_arary'><span>Check All</span></button> // checkboxes names starting with - some_checkbox_arary
	 * 
	 * Demo: e107_admin/image.php, admin_log.php
	 * 
	 */
	allChecked: function(event) {
		event.stop();
		var form = event.element().up('form'), selector = 'multiaction';
		if(event.element().readAttribute('value').startsWith('jstarget:')) {
			selector = event.element().readAttribute('value').replace(/jstarget:/, '').strip();
		}

		if(form) {
			form.toggleChecked(true, 'name^=' + selector);
		}
	},
	
	/**
	 * Event listener
	 * Uncheck all checkboxes in the current form, having name attribute value starting with 'multiaction' 
	 * by default or any value set by button's value(special command 'jstarget:')
	 * This method is auto-attached to every button having name=uncheck_all if init() method is executed
	 * 
	 * Examples of valid inputbox markup: 
	 * <input type='checkbox' class='checkbox' name='multiaction[]'> 
	 * OR
	 * <input type='checkbox' class='checkbox' name='multiaction_something_else[]'>
	 * OR
	 * <input type='checkbox' class='checkbox' name='some_checkbox_arary[]'> (see the button example below) 
	 * OR
	 * <input type='checkbox' class='checkbox' name='some_checkbox_arary_some_more[]'> (see the button example below) 
	 * 
	 * Example of button being auto-observed (see e107Admin.Helper#init)
	 * <button class='action' type='button' name='uncheck_all' value='Uncheck All'><span>Uncheck All</span></button> // default selector - multiaction
	 * OR
	 * <button class='action' type='button' name='uncheck_all' value='jstarget:some_checkbox_arary'><span>Uncheck All</span></button> // checkboxes names starting with - some_checkbox_arary
	 * 
	 * Demo: e107_admin/image.php, admin_log.php
	 * 
	 */
	allUnchecked: function(event) {
		event.stop();
		var form = event.element().up('form'), selector = 'multiaction';
		if(event.element().readAttribute('value').startsWith('jstarget:')) {
			selector = event.element().readAttribute('value').replace(/jstarget:/, '').strip();
		}

		if(form) {
			form.toggleChecked(false, 'name^=' + selector);
		}
	}
}

if(e107Admin.initRules.Helper)
	e107.runOnLoad(e107Admin.Helper.init.bind(e107Admin.Helper), document, true);

/**
 * Admin Menu Class
 */
e107Admin.AdminMenu = {

	init: function(id, selection) {
		if(!id) {
			id = 'plugin-navigation';
			selection = $$('ul.plugin-navigation', 'ul.plugin-navigation-sub');
		}
		selection = $A(selection);

		if(this._track.get(id) || !selection) return false;

		this._track.set(id, selection);
		this.location = document.location.hash.substring(1);
		this.activeTab = null;
		this.activeBar = null;
		if(this.location) {
			this.activeTab = $(this.location);
			if(this.activeTab) {
				this.activeTab.show();
			}
		}
		
		selection.each( function(element, i) {
			if(0 === i && !this.activeTab) { //no page hash
				
				if(!this.activeTab) {
					var check = element.select('a[href^=#]:not([href=#])'); 
					if(check[0]) {
						this.switchTab(check[0].hash.substr(1), element);
					}
				}
			} else if(!this.activeBar && this.activeTab) {//there is page hash
				var h = this.activeTab;
				this.activeBar = element.select('a[href^=#]:not([href=#])').find( function(el){
					return h = el.hash.substr(1);
				});
			}
			element.select('a[href^=#]:not([href=#])').invoke('observe', 'click', this.observe.bindAsEventListener(this, element));
		}.bind(this));
		
		return true;
	},

	switchTab: function(show, container) {
		show = $(show); 
		if(!show) return false;
		if(this.activeTab && this.activeTab.identify() != show.identify()) {
			 //console.log(this.activeTab , container, this.activeTab.identify(), show.identify());
			if(container) $(container).select('a.link-active[href^=#])').invoke('removeClassName', 'link-active');
			this.activeTab.hide().removeClassName('link-active');
			this.activeTab = show.show().addClassName('link-active');
		} else if(!this.activeTab) {
			//init
			if(container) $(container).select('a.link-active[href^=#])').invoke('removeClassName', 'link-active');
			this.activeTab = show.show().addClassName('link-active');
		}
		return true;
	},

	observe: function(event, cont) {
		if(this.switchTab(event.element().hash.substr(1)), cont)
			event.stop();
	},

	_track: $H()
}

if(e107Admin.initRules.AdminMenu)
	document.observe( 'dom:loaded', function() { e107Admin.AdminMenu.init() });
