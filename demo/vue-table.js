(function (Vue) {

    Vue.component('vTable', {
        props: ['filters', 'url'],
        created: function () {
            this.$options.template = this.tpl || '#table-tpl';
            this.queryChange();
        },
        data: function () {
            return {
                items: [],
                pageNo: 1,
                pageSize: 10,
                totalResult: 0,
                orderBy: null,
                isDesc: false,
                loading: false,
            };
        },
        template: '#table-tpl',
        replace: true,
        inherit: false,
        computed: {

        },
        methods: {
            queryChange: function () {
                this.pageChange(1);
            },
            pageChange: function (num) {
                if (this.loading) return;
                this.loading = true;
                this.pageNo = num;
                this.$http.get(this.url, {
                    limit: this.pageSize,
                    offset: (this.pageNo - 1) * this.pageSize,
                }).then(function (response) {
                    this.items = response.data.objects;
                    this.totalResult = response.data.meta.total_count;
                    this.loading = false;
                });
            },
            orderChange: function (colName) {
                if (this.orderBy == colName) {
                    this.isDesc = !this.isDesc;
                }
                else {
                    this.orderBy = colName;
                    this.isDesc = false;
                }
                this.queryChange();
            },
        },
    });

})(Vue)