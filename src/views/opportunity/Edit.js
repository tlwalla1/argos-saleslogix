﻿/// <reference path="../../../../ext/ext-core-debug.js"/>
/// <reference path="../../../../Simplate.js"/>
/// <reference path="../../../../sdata/SDataSingleResourceRequest.js"/>
/// <reference path="../../../../sdata/SDataService.js"/>
/// <reference path="../../../../platform/View.js"/>
/// <reference path="../../../../platform/Detail.js"/>
/// <reference path="../../Format.js"/>
//Rajkumar. G 05-07-2010
Ext.namespace("Mobile.SalesLogix.Opportunity");

Mobile.SalesLogix.Opportunity.Edit = Ext.extend(Sage.Platform.Mobile.Edit, {       
    constructor: function(o) {
        Mobile.SalesLogix.Opportunity.Edit.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'opportunity_edit',
            title: 'Opportunity',
            resourceKind: 'Opportunities'
        });

        this.layout = [
	    {name: 'Description', label: 'description', type: 'text'},
 	    //{name: 'LastName', label: 'lastname', type: 'text'},    
            {name: 'EstimatedClose', label: 'estimatedclose', type: 'text'},
            {name: 'SalesPotential', label: 'salespotential', type: 'text'}, 
	    {name: 'CloseProbability', label: 'closeprobability', type: 'text'},
            {name: 'Weighted', label: 'weighted', type: 'text'},
	    {name: 'Stage', label: 'stage', type: 'text'},
 	    {name: 'Status', label: 'status', type: 'text'}
                  
        ];
    },
    init: function() {     
        Mobile.SalesLogix.Opportunity.Edit.superclass.init.call(this);   
    },
    createRequest: function() {
        return new Sage.SData.Client.SDataSingleResourceRequest(this.getService())            
            .setResourceKind(this.resourceKind)
          .setQueryArgs({
                'include': 'Account,AccountManager,AccountManager/UserInfo',                
                'select': [
                    'Description',
                    'Account/AccountName',
                    'EstimatedClose',
                    'SalesPotential',
                    'CloseProbability',
                    'Weighted',
                    'Stage',
                    'AccountManager/UserInfo/FirstName',
                    'AccountManager/UserInfo/LastName',
                    'Owner/OwnerDescription',
                    'Status',
                    'CreateDate',
                    'CreateUser'
                ].join(',')              
            })
            .setResourceSelector(String.format("'{0}'", this.entry['$key']));
    }
});
//Rajkumar. G