(function (Vue) {

    Vue.directive('selectAll', {
        params: ['array'],
        twoWay: true,
        deep: true,
        bind: function () {
            var self = this;
            this.handler = function () {
                var arr = self.vm.$get(self.expression);
                arr.forEach(function (t) {
                    t.$checked = self.el.checked;
                });
            }.bind(this)
            this.el.addEventListener('click', this.handler)
        },
        update: function (newVal) {
            var count = 0;
            newVal.forEach(function (t) {
                if (t.$checked) count++;
            })
            var checked = newVal.length === count;
            this.el.checked = checked;
            //this.el.indeterminate = !checked && newVal.length > 0;
        },
        unbind: function () {
            this.el.removeEventListener('click', this.handler)
        }
    })

    Vue.component('vTable', {
        props: ['filters', 'url', 'tpl'],
        created: function () {
            this.$options.template = this.tpl || '#table-tpl';
            this.queryChange();
        },
        data: function () {
            return {
                checklist: [],
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
            pageChange: function () {
                if (this.loading) return;
                this.loading = true;
                this.$http.get(this.url, {
                    limit: this.pageSize,
                    offset: (this.pageNo - 1) * this.pageSize,
                }).then(function (response) {
                    response.data.objects.forEach(function (t) {
                        t.$checked = false;
                    })
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
        }
    });

})(Vue)