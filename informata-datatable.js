/**
 * Copyright (C) 2017 Douglas Lira
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 *   The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 *   the Software.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 *   THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 *   TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *   SOFTWARE.
 */

(function() {

    'use strict';

    window.informata = {};

    /**
     * Method convert string to CamelCase
     *
     * @author Douglas Lira <douglas.lira.web@gmail.com>
     * @param {type} str
     * @returns {unresolved}
     * @example
     *
     *  "test-from-camelcase".toCamelCase();
     */
    String.prototype.toCamelCase = function(str) {
        return str.replace(/\s(.)/g, function($1) {
            return $1.toUpperCase();
        }).replace(/\s/g, '').replace(/^(.)/, function($1) {
            return $1.toLowerCase();
        });
    };

})();

(function(informata) {

    'use strict';

    // Global from scope
    informata.websocketEnabled = false;
    informata.websocket = null;

    // Actions
    informata.checkOutputTab = checkOutputTab;
    informata.numberFormat = numberFormat;
    informata.mask = mask;
    informata.inRange = inRange;
    informata.uniqID = uniqID;
    informata.pulseAnimate = pulseAnimate;
    informata.toCamelCase = toCamelCase;
    informata.stopPropagation = stopPropagation;
    informata.randColor = randColor;

    /**
     * Method to convert string to camelCase
     *
     * @author Douglas Lira <douglas.lira.web@gmail.com>
     * @param {type} str
     * @returns {unresolved}
     */
    function toCamelCase(str) {
        return str.toLowerCase().replace(/[-_]+/g, ' ').replace(/[^\w\s]/g, '').replace(/ (.)/g, function($1) {
            return $1.toUpperCase();
        }).replace(/ /g, '');
    }

    /**
     * Method to find dynamic tab position at INDICADORES
     *
     * @author Douglas Lira <douglas.lira.web@gmail.com>
     * @param {String} v
     * @returns {Number}
     */
    function checkOutputTab(v) {
        var searchPos = 0;
        $(".steps ul li").each(function(key, item) {
            if ($(item).text().indexOf(v) !== -1) {
                searchPos = key + 1;
                return;
            }
        });
        return searchPos;
    }

    /**
     * Method to format number
     *
     * @author Douglas Lira <douglas.lira.web@gmail.com>
     * @param {type} number
     * @param {type} decimals
     * @param {type} decPoint
     * @param {type} thousandsSep
     * @returns {unresolved}
     */
    function numberFormat(number, decimals, decPoint, thousandsSep) {
        number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number;
        var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
        var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep;
        var dec = (typeof decPoint === 'undefined') ? '.' : decPoint;
        var s = '';
        var toFixedFix = function(n, prec) {
            var k = Math.pow(10, prec);
            return '' + (Math.round(n * k) / k).toFixed(prec);
        };
        // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    }

    /**
     * Method to apply mask into input text
     *
     * @author Douglas Lira <douglas.lira.web@gmail.com>
     * @param {type} m
     * @param {type} v
     * @returns {@var;tv|String}
     */
    function mask(m, v) {

        var me = this;
        function empty(v) {
            var vclean = "";
            if (v !== null) {
                for (var i = 0; i < 30; i++) {
                    if (v.substr(i, 1) === " ") {
                    } else {
                        vclean = vclean + v.substr(i, 1);
                    }
                }
            }
            return vclean;
        }

        if (m === '###.###.###-##|##.###.###/####-##') {
            if (v.length > 14) {
                return informata.mask('##.###.###/####-##', v);
            } else {
                return informata.mask('###.###.###-##', v);
            }
        }

        if (m === '## ####-####|## #####-####') {
            if (v.length > 12) {
                return informata.mask('## #####-####', v);
            } else {
                return informata.mask('## ####-####', v);
            }
        }

        var tv = "";
        var ret = "";
        var character = "#";
        var separator = "|";
        var maskUse = "";
        var cleanMask = "";
        v = empty(v);
        if (v === "") {
            return v;
        }
        ;
        var temp = m.split(separator);
        var dif = 1000;
        for (var i = 0; i < v.length; i++) {
            if (!isNaN(v.substr(i, 1))) {
                tv = tv + v.substr(i, 1);
            }
        }

        v = tv;
        for (var i = 0; i < temp.length; i++) {
            var mult = "", validate = 0;
            for (var j = 0; j < temp[i].length; j++) {

                if (temp[i].substr(j, 1) === "]") {
                    temp[i] = temp[i].substr(j + 1);
                    break;
                }

                if (validate === 1) {
                    mult = mult + temp[i].substr(j, 1);
                }

                if (temp[i].substr(j, 1) === "[") {
                    validate = 1;
                }
            }
            for (var j = 0; j < v.length; j++) {
                temp[i] = mult + temp[i];
            }
        }

        if (temp.length === 1) {
            maskUse = temp[0];
            cleanMask = "";
            for (var j = 0; j < maskUse.length; j++) {
                if (maskUse.substr(j, 1) === character) {
                    cleanMask = cleanMask + character;
                }
            }
            var tam = cleanMask.length;
        } else {

            for (var i = 0; i < temp.length; i++) {
                cleanMask = "";
                for (var j = 0; j < temp[i].length; j++) {
                    if (temp[i].substr(j, 1) === character) {
                        cleanMask = cleanMask + character;
                    }
                }
                if (v.length > cleanMask.length) {
                    if (dif > (v.length - cleanMask.length)) {
                        dif = v.length - cleanMask.length;
                        maskUse = temp[i];
                        tam = cleanMask.length;
                    }
                } else if (v.length < cleanMask.length) {
                    if (dif > (cleanMask.length - v.length)) {
                        dif = cleanMask.length - v.length;
                        maskUse = temp[i];
                        tam = cleanMask.length;
                    }
                } else {
                    maskUse = temp[i];
                    tam = cleanMask.length;
                    break;
                }
            }
        }

        if (v.length > tam) {
            v = v.substr(0, tam);
        } else if (v.length < tam) {
            var masct = "", j = v.length;
            for (var i = maskUse.length - 1; i >= 0; i--) {
                if (j === 0) {
                    break;
                }
                if (maskUse.substr(i, 1) === character) {
                    j--;
                }
                masct = maskUse.substr(i, 1) + masct;
            }
            maskUse = masct;
        }

        j = maskUse.length - 1;
        for (var i = v.length - 1; i >= 0; i--) {
            if (maskUse.substr(j, 1) !== character) {
                ret = maskUse.substr(j, 1) + ret;
                j--;
            }
            ret = v.substr(i, 1) + ret;
            j--;
        }
        return ret;
    }
    ;
    /**
     * Method to check value in range
     *
     * @author Douglas Lira <douglas.lira.web@gmail.com>
     * @param {type} number
     * @param {type} start
     * @param {type} end
     * @returns {Boolean}
     */
    function inRange(number, start, end) {
        return number > start && number < end;
    }

    /**
     * Method to create uniq id to element
     *
     * @author Douglas Lira <douglas.lira.web@gmail.com>
     * @returns {String}
     */
    function uniqID() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4();
    }

    /**
     * Methodo to craete animation during ajax loading
     *
     * @author Douglas Lira <douglas.lira.web@gmail.com>
     * @param {type} elm
     * @param {type} visible
     * @returns {undefined}
     */
    function pulseAnimate(elm, visible) {
        var newElm = $(elm);
        if (visible) {
            if (!newElm.is(":visible") && visible) {
                newElm.show();
            } else {
                newElm.animate({
                    opacity: 0.5
                }, 700, function() {
                    newElm.animate({
                        opacity: 1
                    }, 700, function() {
                        informata.pulseAnimate(elm, visible);
                    });
                });
            }

        } else {
            newElm.fadeOut();
        }
    }

    /**
     * Method to stop propagation event
     *
     * @author Douglas Lira <douglas.lira.web@gmail.com>
     * @param {type} evt
     * @returns {undefined}
     */
    function stopPropagation(evt) {
        if (evt.stopPropagation !== undefined) {
            evt.stopPropagation();
        } else {
            evt.cancelBubble = true;
        }
    }

    /**
     * Method to generate color
     *
     * @author Douglas Lira <douglas.lira.web@gmail.com>
     * @returns {String}
     */
    function randColor() {
        var cssHSL = "hsl(" + 360 * Math.random() + ',' + (25 + 70 * Math.random()) + '%,' + (85 + 10 * Math.random()) + '%)';
        return cssHSL;
    }

})(informata);

/**
 * Create watch to event show|hide
 *
 * @author Douglas Lira <douglas.lira.web@gmail.com>
 * @param {type} $
 * @returns {undefined}
 * @example
 *
 *   $('#btnShow').click(function(){
 *     $('#foo').show();
 *   });
 *
 *   $('#foo').on('show', function(){ ... });
 *
 */
(function($) {
    $.each(['show', 'hide'], function(i, ev) {
        var el = $.fn[ev];
        $.fn[ev] = function() {
            this.trigger(ev);
            return el.apply(this, arguments);
        };
    });
})(jQuery);

/**
 * @author Douglas Lira <douglas.lira.web@gmail.com>
 * @param {type} informata
 * @returns {undefined}
 * @example
 *
 * window.informata.dataTable('table-main', {
 *   url: "url/to/load-table-main",
 *   drilldown: {
 *     enabled: true,
 *     action: "grid/loadproductdlevelone"
 *   },
 *   columns: [
 *     {data:"A", targets: 0, name: ''},
 *     {data:"B", targets: 1, name: 'Column 1'},
 *     {data:"C", targets: 2, name: 'Column 2'},
 *     {data:"D", targets: 3, name: 'Column 3'},
 *     {data:"E", targets: 4, name: 'Column 4'},
 *     {data:"F", targets: 5, name: 'Column 5', summarize: true},
 *     {data:"G", targets: 6, name: 'Column 6'},
 *     {data:"H", targets: 7, name: 'Column 7'}
 *   ]
 * }).init();
 *
 */
(function(informata) {

    'use strict';
    informata.dataTable = dataTable;
    function dataTable(idTable, settings) {

        var dataTableInstance = [];
        var orderTable = [];

        return {

            /**
             * Method to notification
             *
             * @param {type} title
             * @param {type} text
             * @returns {undefined}
             */
            openNotification: function(title, text) {
                if (title && text) {
                    var uniqID = informata.uniqID();
                    var contentDialog = ['<div id="', uniqID, '">', text, '</div>'];
                    $(contentDialog.join("")).prependTo("#" + idTable).dialog({
                        title: title,
                        modal: true,
                        show: {effect: 'fade', duration: 250},
                        hide: {effect: 'fade', duration: 250},
                        buttons: [
                            {
                                text: "Fechar",
                                class: "btn btn-primary",
                                click: function() {
                                    $(this).dialog('destroy').remove();
                                }
                            }
                        ],
                        close: function() {
                            $(this).dialog('destroy').remove();
                        }
                    });
                }
            },

            /**
             *
             * @param {type} instanceTable
             * @param {type} instanceName
             * @returns {undefined}
             */
            searchColumn: function(instanceTable, instanceName) {
                orderTable = localStorage.getItem(instanceName + "-order") === null ? instanceTable.columns()[0] : localStorage.getItem(instanceName + "-order").split(',').map(Number);
                jQuery.each(orderTable, function(key, i) {
                    if (!settings.drilldown) {
                        if ($("#" + instanceName + "-field-search-" + i).val() !== "") {
                            $("#" + instanceName + "-header-" + key).append("<i style=\"float:right\" class=\"fa fa-filter\" aria-hidden=\"true\"></i>");
                        }
                    } else {
                        if (settings.drilldown && i !== 0) {
                            if ($("#" + instanceName + "-field-search-" + i).val() !== "") {
                                $("#" + instanceName + "-header-" + key).append("<i style=\"float:right\" class=\"fa fa-filter\" aria-hidden=\"true\"></i>");
                            }
                        }
                    }
                });
            },

            /**
             * Method to summarize column
             *
             * @param {type} instanceTable
             * @param {type} instanceTableName
             * @returns {undefined}
             *
             * TODO: Improve this method
             */
            summarizeColumn: function(instanceTable, instanceName) {
                orderTable = localStorage.getItem(instanceName + "-order") === null ? instanceTable.columns()[0] : localStorage.getItem(instanceName + "-order").split(',').map(Number);
                var keyTMP = {};
                $(".linhaTotalizadora").empty();
                jQuery.each(settings.columns, function(i, c) {
                    if (c.summarize) {
                        keyTMP.colName = c.name;
                        keyTMP.colTarget = c.targets;
                    }
                });
                jQuery.each(orderTable, function(key, pos) {
                    if (settings.columns[pos].name === keyTMP.colName) {
                        keyTMP.colSum = instanceTable.column(key).data().sum();
                        keyTMP.colPosActual = key;
                        $("#" + instanceName + "-summarize-" + keyTMP.colTarget).empty().html(informata.numberFormat(keyTMP.colSum, 2, ",", "."));
                    }
                });
            },
            /**
             * Method to render value in header
             *
             * @param {type} obj
             * @returns {undefined}
             */
            renderSummarize: function(obj) {
                var countRows = $('#' + idTable + ' thead tr th').length;
                var tt = ["<tr style=\"background-color: #999; border: 1px solid #FFFF; color: #FFF\">"];
                for (var i = 0; i < countRows; i++) {
                    tt.push("<td><div class=\"linhaTotalizadora\" id=\"" + obj + "-summarize-" + i + "\">" + i + "</div></td>");
                }
                tt.push("</tr>");
                $('#' + idTable + ' thead tr:last').after(tt.join(""));
            },
            /**
             * Method to render inputs in header
             *
             * @param {type} obj
             * @returns {undefined}
             */
            renderSearchField: function(obj) {
                var countRows = $('#' + idTable + ' thead tr th').length;
                var tt = ["<tr style=\"display: none\" id=\"row-search-" + obj + "\">"];
                for (var i = 0; i < countRows; i++) {

                    if (!settings.drilldown) {
                        tt.push("<td><input type=\"text\" id=\"" + obj + "-field-search-" + i + "\" data-instance=\"" + obj + "\" class=\"form-control input-sm\" placeholder=\"Pesquisar...\" /></td>");
                    } else {
                        if (settings.drilldown && i !== 0) {
                            tt.push("<td><input type=\"text\" id=\"" + obj + "-field-search-" + i + "\" data-instance=\"" + obj + "\" class=\"form-control input-sm\" placeholder=\"Pesquisar...\" /></td>");
                        } else {
                            tt.push("<td><a href=\"javascript:void(0);\" id=\"" + obj + "-field-search-close\">[X]</a></td>");
                        }
                    }

                }
                tt.push("</tr>");
                $('#' + idTable + ' thead tr:last').after(tt.join(""));
                $("#" + obj + "-field-search-close").on("click", function() {
                    $("#row-search-" + obj).hide();
                });
                return;
            },
            /**
             * Method to render icons and labels in header
             *
             * @param {type} instanceTable
             * @param {type} instanceName
             * @param {type} labelText
             * @param {type} i
             * @returns {undefined}
             */
            renderHeader: function(instanceTable, instanceName, labelText, i) {

                var me = this;
                var objColumn = $(instanceTable.column(i).header());
                var contentButton = [];
                var contentBasic = [
                    '<div id="', instanceName, '-header-', i, '">', labelText, '</div>'
                ];
                objColumn.empty().html(contentBasic.join(""));
                contentButton = me.renderButtonSearch(instanceName + "-search-" + i);
                if (!settings.drilldown) {
                    $("#" + instanceName + "-header-" + i + "").append(contentButton.join(""));
                } else {
                    if (settings.drilldown && i !== 0) {
                        $("#" + instanceName + "-header-" + i + "").append(contentButton.join(""));
                    }
                }

                $("#" + instanceName + "-search-" + i).on("click", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $("." + idTable + "-tempRmv").remove();
                    me.openRowSearch(instanceName, i);
                });
            },
            /**
             * Method to enable row to search
             *
             * @param {type} instanceName
             * @param {type} i
             * @returns {undefined}
             */
            openRowSearch: function(instanceName, i) {
                $("#row-search-" + instanceName).show();
                $("#" + instanceName + "-field-search-" + i).focus().off("keyup change").on("keyup change", function(e) {
                    $("." + idTable + "-tempRmv").remove();
                    var code = e.keyCode || e.which;
                    var instanceActual = $(this).data().instance;
                    dataTableInstance[instanceActual].api().column($(this).parent().index() + ':visible').search(this.value).draw();
                    if (code === 27 || code === 13) {
                        $("#row-search-" + instanceActual).hide();
                        $("#" + instanceName + "-header-" + i).append("<i style=\"float:right\" class=\"fa fa-filter\" aria-hidden=\"true\"></i>");
                    }
                });
            },
            /**
             * TODO: Implements to enable filters
             * @returns {undefined}
             */
            openConfig: function() {
                var uniqID = informata.uniqID();
                var contentDialog = ['<div id="', uniqID, '"></div>'];
                $(contentDialog.join("")).prependTo("#" + idTable).dialog({
                    title: "Configuração",
                    modal: true,
                    show: {effect: 'fade', duration: 250},
                    hide: {effect: 'fade', duration: 250},
                    buttons: [
                        {
                            text: "Salvar",
                            class: "btn btn-primary",
                            click: function() {
                                $(this).dialog('destroy').remove();
                            }
                        }
                    ],
                    close: function() {
                        $(this).dialog('destroy').remove();
                    }
                });
            },
            /**
             * Method to render buttons search
             *
             * @param {type} idBtn
             * @param instanceName
             * @returns {Array}
             */
            renderButtonSearch: function(idBtn, instanceName) {
                return [
                    '<div style="float: left; margin-right: 5px">',
                    '<a title="Pesquisar" id="', idBtn, '" data-instance="', instanceName, '" href="javascript:void(0)">',
                    '<i class="fa fa-search" rel="popover"></i>',
                    '</a>',
                    '</div>'
                ];
            },
            /**
             * Method to render config button
             *
             * @param {type} idBtn
             * @returns {Array}
             */
            renderButtonConfig: function(idBtn) {
                return [
                    '<div style="float: left; margin-right: 5px">',
                    '<a class="btConfigurarJanela" title="Configurar colunas da tabela" id="', idBtn, '" href="javascript:void(0)">',
                    '<i class="fa fa-cog configColunasJanela" rel="popover"></i>',
                    '</a>',
                    '</div>'
                ];
            },
            /**
             * Method to start DataTable
             *
             * @param {type} obj
             * @param {type} data
             * @returns {undefined}
             */
            startTable: function(obj, data) {
                var me = this;
                me.renderSummarize(obj);
                me.renderSearchField(obj);
                dataTableInstance[obj] = $("#" + idTable).dataTable({
                    data: data,
                    columns: settings.columns,
                    colReorder: true,
                    stateSave: true,
                    orderCellsTop: true,
                    paging: settings.paginate !== undefined ? settings.paginate : true,
                    pagingType: "full_numbers",
                    initComplete: function(settings, json) {
                        var table = this.api();
                        var larguraJanela = $('#' + idTable + '_wrapper').width() - 25;
                        $('#' + idTable + '_wrapper .dataTables_paginate').width(larguraJanela);
                    },
                    stateSaveCallback: function(settings, callback) {
                        localStorage.setItem(obj + "-order", callback.ColReorder);
                    },
                    stateLoadCallback: function(settings, data) {
                        var table = this.api();
                    },
                    headerCallback: function(nHead, aData, iStart, iEnd, aiDisplay) {
                        var table = this.api();
                        orderTable = localStorage.getItem(obj + "-order") === null ? table.columns()[0] : localStorage.getItem(obj + "-order").split(',').map(Number);
                        // CUSTOM HEADER ///////////////////////////////////////
                        $("table#" + idTable + " thead tr th").each(function(i, colObj) {
                            me.renderHeader(table, obj, $(this).text(), i);
                        });
                        me.summarizeColumn(table, obj);
                        me.searchColumn(table, obj);
                        //table.colReorder.order(orderSave);
                        ////////////////////////////////////////////////////////
                    }
                });
                if (settings.drilldown) {
                    $("#" + idTable + " tbody tr td").click(function() {

                        if ($(this).index() === 0) {

                            if ($("." + idTable + "-tempRmv").is(":visible")) {
                                $("." + idTable + "-tempRmv").hide().remove();
                                $(this).html("<a href=\"javascript:void(0);\">[+]</a>");
                            } else {
                                $("." + idTable + "-tempRmv").remove();
                                var tempID = informata.uniqID();
                                var row_index = $(this).parent().index();
                                var col_index = $(this).index();
                                var countRows = $('#' + idTable + ' thead tr th').length;
                                $(this).html("<a href=\"javascript:void(0);\">[-]</a>");
                                $('#' + idTable + ' tbody tr').eq(row_index).after("<tr class=\"" + idTable + "-tempRmv\" style=\"background-color: " + informata.randColor() + "\"><td style=\"padding-bottom: 500px\" colspan=\"" + countRows + "\" id=\"row-" + idTable + "-" + tempID + "\"></td></tr>");
                                if (settings.drilldown.action) {
                                    $("#row-" + idTable + "-" + tempID).empty().html("Carregando...").load(settings.drilldown.action, "", function() {
                                        console.log("OK");
                                    });
                                }
                            }

                        }

                    });
                }

                new $.fn.dataTable.FixedColumns(dataTableInstance[obj], {
                    leftColumns: 1
                });
            },
            /**
             * Method return list of instance
             *
             * @returns {Array}
             */
            instance: function() {
                return dataTableInstance;
            },
            /**
             * Method initialize custom DataTable
             *
             * @returns {undefined}
             */
            init: function() {
                var me = this;
                $.ajax({
                    url: settings.url,
                    type: "GET",
                    async: true,
                    dataType: "text json",
                    beforeSend: function() {
                        console.log("AGUARDANDO");
                    },
                    error: function(txt) {
                        console.log("DEU ERRO!");
                    },
                    success: function(response, status, xhr) {
                        var newInstance = informata.toCamelCase(idTable);
                        me.startTable(newInstance, response.data);
                    }
                });
            }

        };
    }

    // PLUGINS FROM DATATABLE //////////////////////////////////////////////////

    jQuery.fn.dataTable.Api.register('sum()', function() {
        return this.flatten().reduce(function(a, b) {
            if (typeof a === 'string') {
                a = a.replace(/[^\d.-]/g, '') * 1;
            }
            if (typeof b === 'string') {
                b = b.replace(/[^\d.-]/g, '') * 1;
            }

            return a + b;
        }, 0);
    });

})(informata);