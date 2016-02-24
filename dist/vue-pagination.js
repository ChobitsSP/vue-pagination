(function (Vue) {

    Vue.component('pagination', {
        props: {
            pageNo: {
                twoWay: true,
                type: Number,
                validator: function (value) {
                    return value > 0
                },
                default: 1
            },
            pageSize: {
                twoWay: true,
                type: Number,
                validator: function (value) {
                    return value > 0
                },
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
        },
        template: "<nav v-show=\"totalPages > 1\"><ul class=\"pagination\"><li v-if=\"!noPrevious\"><a style=\"cursor:pointer;\"v-on:click=\"selectPage(pageNo - 1)\"aria-label=\"Previous\"><span aria-hidden=\"true\">‹</span></a></li><li v-for=\"page in pages\"v-bind:class=\"{ \'active\': page.number == pageNo, \'disabled\': page.disabled }\"><a style=\"cursor:pointer;\"v-on:click=\"selectPage(page.number)\"v-text=\"page.text\"></a></li><li v-if=\"!noNext\"><a style=\"cursor:pointer;\"v-on:click=\"selectPage(pageNo + 1)\"aria-label=\"Next\"><span aria-hidden=\"true\">›</span></a></li></ul></nav>",
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
                return getTotalPages(this.pageSize, this.totalResult);
            },
        },
        methods: {
            selectPage: function (num) {
                if (this.pageNo != num && num > 0 && num <= this.totalPages) {
                    this.pageNo = num;
                    this.$dispatch('page-change');
                }
            },
            selectSize: function (size) {
                if (this.pageSize != size && size > 0) {
                    this.pageSize = size;
                    if (this.pageNo > this.totalPages) {
                        selectPage(this.totalPages);
                    }
                    else {
                        this.$dispatch('page-change');
                    }
                }
            },
        },
    });

    function getTotalPages(pageSize, totalResult) {
        var totalPages = pageSize < 1 ? 1 : Math.ceil(totalResult / pageSize);
        return Math.max(totalPages || 0, 1);
    }

    // Create page object used in template
    function makePage(number, text, isActive) {
        return {
            number: number,
            text: text,
            disabled: number === -1,
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
        var skip_text = '...';
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
                var page = makePage(-1, skip_text);
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
                var page = makePage(-1, skip_text);
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