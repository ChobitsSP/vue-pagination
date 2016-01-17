(function (Vue) {

    Vue.component('pagination', {
        //props: ['pageNo', 'pageSize', 'totalResult', 'displayNum', 'edgeNum'],
        props: {
            pageNo: {
                type: Number,
                //twoWay: true,
                validator: function (value) {
                    return value > 0
                },
                default: 1
            },
            pageSize: {
                type: Number,
                twoWay: true,
                default: 10
            },
            totalResult: {
                type: Number,
                default: 0
            },
            displayNum: {
                type: Number,
                default: 6
            },
            edgeNum: {
                type: Number,
                default: 2
            },
            tpl: {},
        },
        created: function () {
            this.$options.template = this.tpl || '#pagination';
        },
        template: '#pagination',
        replace: true,
        inherit: false,
        computed: {
            noPrevious: function () {
                return this.pageNo === 1;
            },
            noNext: function () {
                return this.pageNo === this.totalPages;
            },
            pages: function () {
                return getPages(this.pageNo, this.totalPages, this.edgeNum, this.displayNum);
            },
            totalPages: function () {
                var totalPages = this.pageSize < 1 ? 1 : Math.ceil(this.totalResult / this.pageSize);
                return Math.max(totalPages || 0, 1);
            },
        },
        methods: {
            selectPage: function (num) {
                if (this.pageNo != num && num > 0 && num <= this.totalPages) {
                    this.$dispatch('page-change', num);
                }
            },
        },
    });

    // Create page object used in template
    function makePage(number, text, isActive) {
        return {
            number: number,
            text: text,
            disabled: text == '...',
        };
    }

    /**
    * Calculate start and end point of pagination links depending on
    * currentPage and num_display_entries.
    * @return {Array}
    */
    function getInterval(currentPage, pageCount, num_display_entries) {
        //var num_display_entries = 6;
        var ne_half = Math.ceil(num_display_entries / 2);
        var np = pageCount;
        var upper_limit = np - num_display_entries;
        var start = currentPage > ne_half ? Math.max(Math.min(currentPage - ne_half, upper_limit), 0) : 0;
        var end = currentPage > ne_half ? Math.min(currentPage + ne_half, np) : Math.min(num_display_entries, np);
        return [start, end];
    }

    function getPages(currentPage, totalPages, num_edge_entries, num_display_entries) {
        var ret = [];
        //var num_edge_entries = 2;
        var np = totalPages;
        var interval = getInterval(currentPage - 1, totalPages, num_display_entries);

        // Generate starting points
        if (interval[0] > 0 && num_edge_entries > 0) {
            var end = Math.min(num_edge_entries, interval[0]);
            for (var i = 0; i < end; i++) {
                var page = makePage(i + 1, i + 1);
                ret.push(page);
            }
            if (num_edge_entries < interval[0]) {
                var page = makePage(-1, '...');
                ret.push(page);
            }
        }
        // Generate interval links
        for (var i = interval[0]; i < interval[1]; i++) {
            var page = makePage(i + 1, i + 1);
            ret.push(page);
        }
        // Generate ending points
        if (interval[1] < np && num_edge_entries > 0) {
            if (np - num_edge_entries > interval[1]) {
                var page = makePage(-1, '...');
                ret.push(page);
            }
            var begin = Math.max(np - num_edge_entries, interval[1]);
            for (var i = begin; i < np; i++) {
                var page = makePage(i + 1, i + 1);
                ret.push(page);
            }
        }

        return ret;
    }

})(Vue)