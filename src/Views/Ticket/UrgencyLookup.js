/// <reference path="../../../../../argos-sdk/libraries/ext/ext-core-debug.js"/>
/// <reference path="../../../../../argos-sdk/libraries/sdata/sdata-client-debug"/>
/// <reference path="../../../../../argos-sdk/libraries/Simplate.js"/>
/// <reference path="../../../../../argos-sdk/src/View.js"/>
/// <reference path="../../../../../argos-sdk/src/List.js"/>

define('Mobile/SalesLogix/Views/Ticket/UrgencyLookup', [
    'dojo/_base/declare',
    'dojo/string',
    'Sage/Platform/Mobile/List'
], function(
    declare,
    string,
    List
) {

    return declare('Mobile.SalesLogix.Views.Ticket.UrgencyLookup', [List], {
        //Localization
        titleText: 'Ticket Urgency',

        //Templates
        itemTemplate: new Simplate([
            '<h3>{%: $.Description %}</h3>'
        ]),

        //View Properties
        id: 'urgency_list',
        queryOrderBy: 'UrgencyCode asc',
        querySelect: [
            'Description',
            'UrgencyCode'
        ],
        resourceKind: 'urgencies',

        formatSearchQuery: function(query) {
            return string.substitute('upper(Description) like "%${0}%"', this.escapeSearchQuery(query.toUpperCase()));
        }
    });
});