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
 *     enabled: true
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

        settings.summarize = settings.summarize === undefined ? true : settings.summarize;

        var clickTemp = null;

        return {

            /**
             * Method to adjusts columns
             *
             * @param {type} idElemento
             * @param {type} obj
             * @returns {undefined}
             */
            adjustColumns: function(idElemento, obj) {
                var tabela = document.getElementById(idElemento);
                var rowFilter = document.querySelectorAll('#row-search-' + obj);
                $("#" + idElemento + "_wrapper").find("table").css({"width": "100%"});
                if (tabela.parentNode.className === 'dataTables_scrollBody') {
                    Array.prototype.forEach.call(rowFilter, function(el, i) {
                        var larguraCelulaFiltroCabecalho = tabela.parentNode.previousElementSibling.firstElementChild.firstElementChild.firstElementChild.firstElementChild.children[i].style.width;
                        tabela.parentNode.previousElementSibling.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.children[i].style.cssText += 'min-width: ' + larguraCelulaFiltroCabecalho + '; max-width: ' + larguraCelulaFiltroCabecalho;
                        el.style.cssText += 'min-width: ' + larguraCelulaFiltroCabecalho + '; max-width: ' + larguraCelulaFiltroCabecalho;
                        el.parentNode.nextElementSibling.children[i].style.cssText += 'min-width: ' + larguraCelulaFiltroCabecalho + '; max-width: ' + larguraCelulaFiltroCabecalho;
                    });
                }
            },

            /**
             * Method return instance of DataTable
             *
             * @param {type} v
             * @returns {Boolean}
             */
            getInstance: function(v) {
                return window.informata.dataTableInstance[v] ? window.informata.dataTableInstance[v] : false;
            },

            /**
             *
             * @param {type} v
             * @returns {window.informata.orderTable|Window.informata.orderTable}
             */
            getOrder: function(v) {
                return window.informata.orderTable[v];
            },

            /**
             * Method set custom order
             *
             * @param {type} v
             * @returns {undefined}
             */
            setOrder: function(instance, v) {
                window.informata.orderTable[instance] = v;
            },

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
                var me = this;
                var orderCol = me.getOrder(instanceName + "-order");
                jQuery.each(orderCol, function(key, i) {
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
                var me = this;
                var orderCol = me.getOrder(instanceName + "-order");
                var keyTMP = {};
                jQuery.each(settings.columns, function(i, c) {
                    if (c.summarize) {
                        keyTMP.colName = c.name;
                        keyTMP.colTarget = c.targets;
                    }

                    jQuery.each(orderCol, function(key, pos) {
                        if (settings.columns[pos].name === keyTMP.colName) {
                            keyTMP.colSum = instanceTable.column(key, {search: 'applied'}).data().sum();
                            keyTMP.colPosActual = key;
                            $("#" + instanceName + "-summarize-" + keyTMP.colTarget).empty().html(window.informata.numberFormat(keyTMP.colSum, 2, ",", "."));
                        }
                    });

                });
            },

            /**
             *
             * @param {type} instanceTable
             * @param {type} instanceName
             * @returns {undefined}
             */
            renderFieldColumn: function(instanceTable, instanceName) {
                var me = this;
                var orderCol = me.getOrder(instanceName + "-order");
                var keyTMP = {};
                jQuery.each(settings.columns, function(i, c) {
                    if (c.field) {
                        keyTMP.colName = c.name;
                        keyTMP.colTarget = c.targets;
                        keyTMP.field = c.field;
                    }

                    jQuery.each(orderCol, function(key, pos) {
                        if (settings.columns[pos].name === keyTMP.colName) {
                            keyTMP.colPosActual = key;
                            var field = [];
                            if (keyTMP.field.type === "text") {
                                field = ['<input class="form-control input-sm" id="', instanceName, '-field-', keyTMP.colTarget, '-summarize" type="', keyTMP.field.type, '" value="', keyTMP.field.value, '">'];
                            } else if (keyTMP.field.type === "select") {
                                field = ['<select class="form-control input-sm" id="', instanceName, '-field-', keyTMP.colTarget, '-summarize"></select>'];
                            } else if (keyTMP.field.type === "checkbox") {
                                field = ['<input class="form-control input-sm" id="', instanceName, '-field-', keyTMP.colTarget, '-summarize" type="', keyTMP.field.type, '" value="', keyTMP.field.value, '">'];
                            }

                            $("#" + instanceName + "-summarize-" + keyTMP.colTarget).empty().html(field.join(""));
                            var elementEvent = $('#' + instanceName + '-field-' + keyTMP.colTarget + '-summarize');
                            if (keyTMP.field.actions) {
                                jQuery.each(keyTMP.field.actions, function(a, b) {
                                    elementEvent.on(a, function(e) {
                                        b(e);
                                    });
                                });
                            }
                        }
                    });

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
                    tt.push("<td><div class=\"linhaTotalizadora\" id=\"" + obj + "-summarize-" + i + "\"></div></td>");
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
                        tt.push("<td><input type=\"text\" id=\"" + obj + "-field-search-" + i + "\" data-instance=\"" + obj + "\" class=\"form-control input-sm " + obj + "-field-search\" placeholder=\"Pesquisar...\" /></td>");
                    } else {
                        if (settings.drilldown && i !== 0) {
                            tt.push("<td><input type=\"text\" id=\"" + obj + "-field-search-" + i + "\" data-instance=\"" + obj + "\" class=\"form-control input-sm " + obj + "-field-search\" placeholder=\"Pesquisar...\" /></td>");
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
                var contentButtonSearch = [];
                var contentButtonConfig = [];
                var contentBasic = [
                    '<div id="', instanceName, '-header-', i, '">', labelText, '</div>'
                ];
                objColumn.empty().html(contentBasic.join(""));
                contentButtonSearch = me.renderButtonSearch(instanceName + "-search-" + i);
                contentButtonConfig = me.renderButtonConfig(instanceName + "-config-" + i);
                if (!settings.drilldown) {
                    $("#" + instanceName + "-header-" + i + "").append(contentButtonSearch.join(""));

                    if (i === 0) {
                        $("#" + instanceName + "-header-" + i + "").append(contentButtonConfig.join(""));
                    }

                } else {
                    if (settings.drilldown && i !== 0) {
                        $("#" + instanceName + "-header-" + i + "").append(contentButtonSearch.join(""));
                    } else {
                        $("#" + instanceName + "-header-" + i + "").append(contentButtonConfig.join(""));
                    }
                }

                $("#" + instanceName + "-search-" + i).on("click", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $("." + idTable + "-tempRmv").remove();
                    me.openRowSearch(instanceTable, instanceName, labelText, i);
                });

                $("#" + instanceName + "-config-" + i).on("click", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $("." + idTable + "-tempRmv").remove();
                    me.openConfig();
                });
            },

            /**
             * Method to enable row to search
             *
             * @param {type} instanceTable
             * @param {type} instanceName
             * @param {type} labelText
             * @param {type} i
             * @returns {undefined}
             */
            openRowSearch: function(instanceTable, instanceName, labelText, i) {
                $("#row-search-" + instanceName).show();
                var instanceActual = "", keyTMP = {};
                jQuery.each(settings.columns, function(x, c) {
                    if (c.name === labelText) {
                        keyTMP.colName = c.name;
                        keyTMP.colTarget = c.targets;
                    }
                });
                $("#" + instanceName + "-field-search-" + keyTMP.colTarget).focus();
                $("." + instanceName + "-field-search").off().on("keyup change", function(e) {
                    $("." + idTable + "-tempRmv").remove();
                    instanceActual = $(this).data().instance;
                    window.informata.dataTableInstance[instanceActual].api().column($(this).parent().index() + ':visible').search(this.value).draw();
                    $("#" + instanceName + "-header-" + i).append("<i style=\"float:right\" class=\"fa fa-filter\" aria-hidden=\"true\"></i>");
                    var code = e.keyCode || e.which;
                    if (code === 27 || code === 13) {
                        $("#row-search-" + instanceActual).hide();
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
                var optionsDlg = {
                    title: "Configuração",
                    modal: true,
                    show: {effect: 'fade', duration: 1000},
                    hide: {effect: 'fade', duration: 1000},
                    close: function() {
                        $(this).dialog('destroy').remove();
                    }
                };
                if (settings.filter && settings.filter.buttons) {
                    optionsDlg.buttons = settings.filter.buttons;
                }
                $(contentDialog.join("")).prependTo("#" + idTable).load(settings.filter.url, "", function() {
                    console.log("LOADING FILTER");
                }).dialog(optionsDlg);
            },

            /**
             * Method to render buttons search
             *
             * @param {type} idBtn
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
                var me = this, tableColReorder;
                if (settings.summarize) {
                    me.renderSummarize(obj);
                }
                me.renderSearchField(obj);

                window.informata.dataTableInstance[obj] = $("#" + idTable).dataTable({
                    data: data,
                    columns: settings.columns,
                    colReorder: true,
                    stateSave: true,
                    stateDuration: 60 * 60 * 720,
                    orderCellsTop: true,
                    autoWidth: false,
                    paging: settings.paginate !== undefined ? settings.paginate : true,
                    pagingType: "full_numbers",
                    language: {
                        lengthMenu: "Mostrar _MENU_",
                        zeroRecords: "Nenhum conteúdo encontrado!",
                        info: "Mostrando página _PAGE_ de _PAGES_",
                        infoEmpty: "Sem linhas",
                        infoFiltered: "(filtrado de _MAX_ total linhas)",
                        search: "Filtrar:",
                        paginate: {
                            first: "Primeiro",
                            last: "Último",
                            next: "Próximo",
                            previous: "Anterior"
                        },
                        loadingRecords: "Carregando...",
                        processing: "Processando..."
                    },
                    drawCallback: function() {
                        if (settings.drilldown) {
                            $("#" + idTable + " tbody tr td").on("click", function() {
                                // TODO: Improve this
                                $("#" + idTable + " tbody tr").each(function() {
                                    $(this).find("td:first").find("img").attr("src", BASE_URL_EXTERNO + "images/details_open.png");
                                });
                                if ($(this).index() === 0) {
                                    $("." + idTable + "-tempRmv").hide().remove();
                                    var clickContent = $(this).find("img");
                                    var objDataClick = clickContent.data();
                                    var tempID = informata.uniqID();
                                    var row_index = $(this).parent().index();
                                    var col_index = $(this).index();
                                    var countRows = $('#' + idTable + ' thead tr th').length;
                                    objDataClick.close = false;
                                    clickTemp = row_index;
                                    $(this).html($(clickContent[0]).attr("src", BASE_URL_EXTERNO + "images/details_close.png"));
                                    $('#' + idTable + ' tbody tr').eq(row_index).after("<tr class=\"" + idTable + "-tempRmv\" id=\"rowTmpClick-" + idTable + "-" + row_index + "\" style=\"background-color: #FFFFFF\"><td style=\"padding-bottom: 800px\" colspan=\"" + countRows + "\" id=\"row-" + idTable + "-" + tempID + "\"></td></tr>");
                                    $("#row-" + idTable + "-" + tempID).empty().html("Carregando...");
                                    $("#row-" + idTable + "-" + tempID).load(objDataClick.url, "", function() {
                                        console.log("DRILL LOADING COMPLETE!");
                                    });
                                }
                            });
                        }
                    },
                    initComplete: function(settings, json) {
                        var table = this.api();
                        var larguraJanela = $('#' + idTable + '_wrapper').width() - 25;
                        $('#' + idTable + '_wrapper .dataTables_paginate').width(larguraJanela);
                        //table.columns.adjust().draw();
                        me.adjustColumns(idTable, obj);
                    },
                    stateSaveCallback: function(settings, callback) {
                        $.ajax({
                            url: BASE_URL + "configuracaotabela/salvartabela?ajax=true&idTable=" + obj,
                            data: callback,
                            dataType: "text json",
                            type: "POST"
                        });
                    },
                    stateLoadCallback: function(settings, data) {
                        var table = this.api();
                        $.ajax({
                            url: BASE_URL + "configuracaotabela?ajax=true&idTable=" + obj,
                            dataType: "text json",
                            success: function(response) {
                                if (response.data) {
                                    var orderCols = response.data.ColReorder;
                                    // THE MAGIC!!!! ///////////////////////////
                                    tableColReorder = new $.fn.dataTable.ColReorder(window.informata.dataTableInstance[obj]);
                                    tableColReorder.fnOrder(orderCols);
                                    ////////////////////////////////////////////
                                }
                            }
                        });
                    },
                    headerCallback: function(nHead, aData, iStart, iEnd, aiDisplay) {
                        var table = this.api();
                        var orderCol = sessionStorage.getItem(obj + "-order") === null ? table.columns()[0] : sessionStorage.getItem(obj + "-order").split(',').map(Number);
                        me.setOrder(obj + "-order", orderCol);
                        // CUSTOM HEADER ///////////////////////////////////////
                        $("table#" + idTable + " thead tr th").each(function(i, colObj) {
                            me.renderHeader(table, obj, $(this).text(), i);
                        });

                        if (settings.summarize) {
                            me.summarizeColumn(table, obj);
                        }
                        me.renderFieldColumn(table, obj);
                        me.searchColumn(table, obj);
                        ////////////////////////////////////////////////////////
                    }
                });

                new $.fn.dataTable.FixedColumns(window.informata.dataTableInstance[obj], {
                    leftColumns: 1
                });

            },
            /**
             * Method return list of instance
             *
             * @returns {Array}
             */
            instance: function() {
                return window.informata.dataTableInstance;
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
                        console.log("LOADING...");
                    },
                    error: function(txt) {
                        console.log("ERROR: ", txt);
                    },
                    success: function(response, status, xhr) {
                        var newInstance = informata.toCamelCase(idTable);
//                        if (window.informata.dataTableInstance[newInstance]) {
//                            var tableObj = window.informata.dataTableInstance[newInstance].api().settings();
//                            var colReorder = new $.fn.dataTable.ColReorder(window.informata.dataTableInstance[newInstance]);
//                            tableObj.clear();
//                            tableObj.rows.add(response.data);
//                            tableObj.draw();
//                        } else {
                        me.startTable(newInstance, response.data);
//                        }
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