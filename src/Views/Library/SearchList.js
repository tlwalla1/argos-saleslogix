define('Mobile/SalesLogix/Views/Library/SearchList', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/string',
    'Mobile/SalesLogix/SpeedSearchWidget',
    'Sage/Platform/Mobile/List'
], function(
    declare,
    lang,
    array,
    domClass,
    domConstruct,
    string,
    SpeedSearchWidget,
    List
) {

    return declare('Mobile.SalesLogix.Views.Library.SearchList', [List], {
        //Templates
        rowTemplate: new Simplate([
            '<li data-action="activateEntry" data-key="{%= $.$key %}" data-descriptor="{%: $.type %}">',
            '<div class="item-static-icon"><img src="{%: $$.iconPathsByType[$.type] %}" alt="{%: $.type %}" /></div>',
            '{%! $$.itemTemplate %}',
            '</li>'
        ]),

        itemTemplate: new Simplate([
            '<h3>{%: $.$descriptor %}</h3>'
        ]),

        //Localization
        titleText: 'Library',

        //View Properties
        id: 'library_speedsearch_list',
        icon: 'content/images/icons/Library_24.png',// TODO: Need an icon for speedsearch
        enableSearch: true,
        searchWidgetClass: SpeedSearchWidget,
        expose: true,

        indexes: [
              {indexName: 'Library', indexType: 0, isSecure: false}
        ],
        types: ['Library'],
        iconPathsByType: {
             'Library': 'content/images/icons/File_24x24.png'
        },
        currentPage: null,

        clear: function() {
            this.inherited(arguments);
            this.currentPage = 0;
        },
        extractTypeFromItem: function(item) {
            for (var i = 0; i < this.types.length; i++) {
                if (item.source.indexOf(this.types[i]) !== -1) {
                    return this.types[i];
                }
            }

            return null;
        },
        extractDescriptorFromItem: function(item, type) {
            var descriptor = '';

            switch (type) {
               case 'Library':
                   descriptor = string.substitute('${displayName}', this.getFieldValues(item.fields, ['displayName']));
                    break;                
            }
            return descriptor;
        },
        extractKeyFromItem: function(item) {
            // Extract the entityId from the display name, which is the last 12 characters
            var displayName, len;
            displayName = item.displayName;
            if (!displayName) {
                return '';
            }

            len = displayName.length;
            return displayName.substring(len - 12);
        },
        getFieldValue: function(fields, name) {
            for (var i = 0; i < fields.length; i++) {
                var field = fields[i];
                if (field.fieldName == name) {
                    return field.fieldValue;
                }
            }

            return '';
        },
        getFieldValues: function(fields, names) {
            var results = {};

            // Assign each field in the results to an empty string,
            // so that dojo's string substitute won't blow up on undefined.
            array.forEach(names, function(name) {
                results[name] = '';
            });

            array.forEach(fields, function(field) {
                array.forEach(names, function(name, i) {
                    if (field.fieldName === name) {
                        results[name] = field.fieldValue;
                    }
                });
            });

            return results;
        },
        more: function() {
            this.currentPage += 1;
            this.inherited(arguments);
        },
        hasMoreData: function() {
            var total, count;
            total = this.feed.totalCount;
            count = (this.currentPage + 1) * this.pageSize;
            return count < total;
        },
        processFeed: function(feed) {
            debugger;
            if (!this.feed) {
                this.set('listContent', '');
            }

            this.feed = feed = feed.response;

            if (feed.totalCount === 0) {
                this.set('listContent', this.noDataTemplate.apply(this));
            } else if (feed.items) {
                var o = [];

                for (var i = 0; i < feed.items.length; i++) {
                    var entry = feed.items[i];

                    entry.type = this.extractTypeFromItem(entry);
                    entry.$descriptor = entry.displayName;    // entry.$descriptor || this.extractDescriptorFromItem(entry, entry.type);
                    //entry.$key = this.extractKeyFromItem(entry);

                    this.entries[entry.$key] = entry;

                    o.push(this.rowTemplate.apply(entry, this));
                }

                if (o.length > 0) {
                    domConstruct.place(o.join(''), this.contentNode, 'last');
                }
            }

            if (typeof feed.totalCount !== 'undefined') {
                var remaining = this.feed.totalCount - ((this.currentPage + 1) * this.pageSize);
                this.set('remainingContent', string.substitute(this.remainingText, [remaining]));
            }

            domClass.toggle(this.domNode, 'list-has-more', this.hasMoreData());
        },
        createRequest: function() {
            var request = new Sage.SData.Client.SDataServiceOperationRequest(this.getService())
                .setContractName('system')
                .setOperationName('executeSearch');
            return request;
        },
        createSearchEntry: function() {
            var entry = {
                request: {
                    docTextItem: -1,
                    searchText: this.query,
                    searchType: App.speedSearch.searchType,
                    noiseFile: 'PMINoise.dat',
                    includeStemming: App.speedSearch.includeStemming,
                    includeThesaurus: App.speedSearch.includeThesaurus,
                    includePhonic: App.speedSearch.includePhonic,
                    useFrequentFilter: App.speedSearch.useFrequentFilter,
                    indexes: this.indexes,
                    whichPage: this.currentPage,
                    itemsPerPage: this.pageSize,
                    filters: null
                },
                response: null
            };

            return entry;
        },
        requestData: function() {
            domClass.add(this.domNode, 'list-loading');

            var request = this.createRequest(),
                entry = this.createSearchEntry();

            request.execute(entry, {
                success: lang.hitch(this, this.onRequestDataSuccess),
                failture: lang.hitch(this, this.onRequestDataFailure)
            });
        },
        navigateToDetailView: function(key, type) {
            debugger;

            var view = App.getView('view_library_file');//App.getView(type.toLowerCase() + '_detail');

            if (view) {
                view.show({
                    key: key
                });
            }
        },
        createToolLayout: function() {
            return this.tools || (this.tools = {
                'tbar': []
            });
        }
    });
});

