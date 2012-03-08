(function ($) {

    var pages = 0;

    var methods = {
        init:function (options) {
            var settings = $.extend({
                'per_page':5,
                'filter':'',
                'start_at':1,
                'controller':null
            }, options);


            // there's no need to do $(this) because
            // "this" is already a jquery object

            // $(this) would be the same as $($('#element'));

            return this.each(function () {

                console.log(this);
                var $this = $(this),
                    data = $this.data('paginator'),
                    children = $this.children(settings.filter);

                if (!data) {

                    /*
                     Do more setup stuff here
                     */

                    $this.data('paginator', {
                        target:$this,
                        pages:Math.ceil(children.length / settings.per_page),
                        per_page:settings.per_page,
                        children:children
                    });

                    if (settings.controller) {
                        $(settings.controller).replaceWith($this.paginate('controller'));
                    }

                    $this.paginate('page', settings.start_at)
                }

            });
        },
        filter: function(selector) {
            var paginator = this.data('paginator');
            if (!paginator) {
                return null;
            }

            paginator.children = this.children(selector);
            this.paginate('page',1);
        },
        pages:function () {
            var paginator = this.data('paginator');
            if (!paginator) {
                return null;
            }
            return paginator.pages;
        },
        page:function (page) {
            var paginator = this.data('paginator');
            if (!paginator) {
                return null;
            }

            if (page) {
                switch(page) {
                    case 'next':
                        if(paginator.page < paginator.pages) {
                            page = paginator.page + 1;
                        }
                        else {
                            page = paginator.pages;
                        }
                        break;
                    case 'previous':
                        if(paginator.page > 1) {
                            page = paginator.page - 1;
                        }
                        else {
                            page = 1;
                        }
                        break;
                    case 'first':
                        page = 1;
                        break;
                    case 'last':
                        page = paginator.pages;
                        break;
                    default:
                        if (page > paginator.pages) {
                            page = paginator.pages;
                        }
                        else if (paginator.pages < 1) {
                            page = 1;
                        }
                }


                if(page == paginator.page) {
                    return;
                }
                paginator.page = page;

                var idx = (paginator.page - 1) * paginator.per_page;
                var lastidx = idx + paginator.per_page;

                //        if(lastidx > this.comments.length) {
                //            lastidx = this.comments.length;
                //        }

                paginator.children.hide().slice(idx, lastidx).show();
                this.trigger('paginate.change', [ paginator ]);
            }

            return paginator.page


        },
        controller:function (options) {

            var paginator = this.data('paginator');
            if (!paginator) {
                return null;
            }
            var settings = $.extend({
                'size': 10,
                'show_first':true,
                'show_last':true,
                'show_next': true,
                'show_previous': true,
                'active':'active',
                'parent':'<ul/>',
                'children':'<li><a>%s</a></li>',
                labels: {
                    first: '&lt;&lt;',
                    last: '&gt;&gt;',
                    next: '&gt;',
                    previous: '&lt;',
                    page: '%'
                }

            }, options);

            var self = this;

            var controller = $(settings.parent);

            if (settings.show_first) {
                controller.append(item_html('first', settings.labels.first));
            }

            if (settings.show_previous) {
                controller.append(item_html('previous', settings.labels.previous));
            }

            for (var i = 1; i <= paginator.pages; i++) {
                var e = item_html(i, settings.labels.page);

                controller.append(e);
            }

            if (settings.show_next) {
                controller.append(item_html('next', settings.labels.next));
            }

            if (settings.show_last) {
                controller.append(item_html('last', settings.labels.last));
            }



            function item_html(page, label) {
                if(undefined == label) {
                    label = '%';
                }

                var e = $(settings.children.replace('%s', label).replace('%', page));

                if (page == paginator.page) {
                    e.addClass(settings.active);
                }

                self.on('paginate.change', function(ev, paginator) {
                    if(paginator.page == page) {
                        e.addClass(settings.active);
                    }
                    else {
                        e.removeClass(settings.active);
                    }
                });

                e.on('click', function () {
                    self.paginate('page', page);
                });

                return e;
            }

            return controller;
        }
    };

    $.fn.paginate = function (method) {

        // Method calling logic
        if (methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.paginate');
        }

    };

})(jQuery);