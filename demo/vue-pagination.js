(function (Vue) {

    Vue.component('pagination', {
        //props: ['pageNo', 'pageSize', 'totalResult'],
        template: '#pagination',
        replace: true,
        inherit: false,
        data: function () {
            return {
                pageNo: 1,
                pageSize: 10,
                totalResult: 1000,
            };
        },
        computed: {
            noPrevious: function () {
                return this.pageNo === 1;
            },
            noNext: function () {
                return this.pageNo === this.totalPages;
            },
            pages: function () {
                return getPages(this.pageNo, this.totalPages);
            },
            totalPages: function () {
                var totalPages = this.pageSize < 1 ? 1 : Math.ceil(this.totalResult / this.pageSize);
                return Math.max(totalPages || 0, 1);
            },
        },
        compiled: function () {

        },
        methods: {
            selectPage: function (num) {
                if (this.pageNo != num && num > 0) {
                    this.pageNo = num;
                    this.$dispatch('page-change', this.pageNo);
                }
            },
        },
    });

    // Create page object used in template
    function makePage(number, text, isActive) {
        return {
            number: number,
            text: text,
            active: isActive,
            disabled: text == '...',
        };
    }

    /**
    * Calculate start and end point of pagination links depending on
    * currentPage and num_display_entries.
    * @return {Array}
    */
    function getInterval(currentPage, pageCount) {
        var num_display_entries = 6;
        var num_edge_entries = 2;

        var ne_half = Math.ceil(num_display_entries / 2);
        var np = pageCount;
        var upper_limit = np - num_display_entries;
        var start = currentPage > ne_half ? Math.max(Math.min(currentPage - ne_half, upper_limit), 0) : 0;
        var end = currentPage > ne_half ? Math.min(currentPage + ne_half, np) : Math.min(num_display_entries, np);
        return [start, end];
    }

    function getPages(currentPage, totalPages) {
        var ret = [];
        var num_edge_entries = 2;
        var np = totalPages;
        var interval = getInterval(currentPage - 1, totalPages);

        // Generate starting points
        if (interval[0] > 0 && num_edge_entries > 0) {
            var end = Math.min(num_edge_entries, interval[0]);
            for (var i = 0; i < end; i++) {
                var page = makePage(i + 1, i + 1, (i + 1) === currentPage);
                ret.push(page);
            }
            if (num_edge_entries < interval[0]) {
                var page = makePage(-1, '...', false);
                ret.push(page);
            }
        }
        // Generate interval links
        for (var i = interval[0]; i < interval[1]; i++) {
            var page = makePage(i + 1, i + 1, (i + 1) === currentPage);
            ret.push(page);
        }
        // Generate ending points
        if (interval[1] < np && num_edge_entries > 0) {
            if (np - num_edge_entries > interval[1]) {
                var page = makePage(-1, '...', false);
                ret.push(page);
            }
            var begin = Math.max(np - num_edge_entries, interval[1]);
            for (var i = begin; i < np; i++) {
                var page = makePage(i + 1, i + 1, (i + 1) === currentPage);
                ret.push(page);
            }
        }

        return ret;
    }

})(Vue)