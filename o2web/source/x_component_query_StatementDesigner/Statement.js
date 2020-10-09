MWF.xApplication = MWF.xApplication || {};
MWF.xApplication.query = MWF.xApplication.query || {};
MWF.xApplication.query.StatementDesigner = MWF.xApplication.query.StatementDesigner || {};
MWF.APPDSMD = MWF.xApplication.query.StatementDesigner;

MWF.xDesktop.requireApp("query.StatementDesigner", "lp."+MWF.language, null, false);
MWF.xDesktop.requireApp("query.StatementDesigner", "Property", null, false);
MWF.xDesktop.requireApp("query.ViewDesigner", "View", null, false);
o2.require("o2.widget.JavascriptEditor", null, false);

MWF.xApplication.query.StatementDesigner.Statement = new Class({
    Extends: MWF.widget.Common,
    Implements: [Options, Events],
    options: {
        "style": "default",
        "isView": false,
        "showTab": true,
        "propertyPath": "../x_component_query_StatementDesigner/$Statement/statement.html"
    },

    initialize: function(designer, data, options){
        this.setOptions(options);

        this.path = "../x_component_query_StatementDesigner/$Statement/";
        this.cssPath = "../x_component_query_StatementDesigner/$Statement/"+this.options.style+"/css.wcss";

        this._loadCss();

        this.designer = designer;
        this.data = data;
        this.parseData();

        this.node = this.designer.designNode;
        this.areaNode = new Element("div", {"styles": {"height": "100%", "overflow": "auto"}});

        //this.statementRunNode = this.designer.designerStatementArea;

        if(this.designer.application) this.data.applicationName = this.designer.application.name;
        if(this.designer.application) this.data.application = this.designer.application.id;

        this.isNewStatement = (this.data.id) ? false : true;

        this.view = this;

        this.autoSave();
        this.designer.addEvent("queryClose", function(){
            if (this.autoSaveTimerID) window.clearInterval(this.autoSaveTimerID);
        }.bind(this));
    },
    parseData: function(){
        this.json = this.data;
        if (!this.json.type) this.json.type = "select";
        if (!this.json.format) this.json.format = "jpql";
        if (!this.json.entityCategory) this.json.entityCategory = "official";
        if (!this.json.entityClassName) this.json.entityClassName = "com.x.processplatform.core.entity.content.Task";
    },
    autoSave: function(){
        this.autoSaveTimerID = window.setInterval(function(){
            if (!this.autoSaveCheckNode) this.autoSaveCheckNode = this.designer.contentToolbarNode.getElement("#MWFAutoSaveCheck");
            if (this.autoSaveCheckNode){
                if (this.autoSaveCheckNode.get("checked")){
                    this.save();
                }
            }
        }.bind(this), 60000);
    },

    load : function(){


        // this.setAreaNodeSize();
        // this.designer.addEvent("resize", this.setAreaNodeSize.bind(this));
        this.areaNode.inject(this.node);

        this.designer.statementListAreaNode.getChildren().each(function(node){
            var statement = node.retrieve("statement");
            if (statement.id==this.data.id){
                if (this.designer.currentListStatementItem){
                    this.designer.currentListStatementItem.setStyles(this.designer.css.listStatementItem);
                }
                node.setStyles(this.designer.css.listStatementItem_current);
                this.designer.currentListStatementItem = node;
                this.lisNode = node;
            }
        }.bind(this));

        this.loadStatement();
        this.showProperty();
    },
    showProperty: function(){
        if (!this.property){
            this.property = new MWF.xApplication.query.StatementDesigner.Property(this, this.designer.designerContentArea, this.designer, {
                "path": this.options.propertyPath,
                "onPostLoad": function(){
                    this.property.show();
                }.bind(this)
            });
            this.property.load();
        }else{
            this.property.show();
        }
    },
    loadStatement: function(){
        //this.statementDesignerNode = new Element("div", {"styles": this.css.statementDesignerNode}).inject(this.areaNode);
        this.loadStatementHtml(function(){
            this.designerArea = this.areaNode.getElement(".o2_statement_statementDesignerNode");
            this.jpqlArea = this.areaNode.getElement(".o2_statement_statementDesignerJpql");
            this.scriptArea = this.areaNode.getElement(".o2_statement_statementDesignerScript");

            this.formatTypeArea = this.areaNode.getElement(".o2_statement_statementDesignerFormatContent");
            this.entityCategorySelect = this.areaNode.getElement(".o2_statement_statementDesignerCategoryContent").getElement("select");

            this.dynamicTableArea = this.areaNode.getElement(".o2_statement_statementDesignerTableArea_dynamic");
            this.officialTableArea = this.areaNode.getElement(".o2_statement_statementDesignerTableArea_official");
            this.customTableArea = this.areaNode.getElement(".o2_statement_statementDesignerTableArea_custom");

            this.dynamicTableSelect = this.areaNode.getElement(".o2_statement_statementDesignerSelectTable");
            this.officialTableSelect = this.officialTableArea.getElement("select");

            this.dynamicTableContent = this.areaNode.getElement(".o2_statement_statementDesignerTableContent");


            this.jpqlTypeSelect = this.areaNode.getElement(".o2_statement_statementDesignerTypeContent").getElement("select");



            // this.jpqlSelectEditor = this.areaNode.getElement(".o2_statement_statementDesignerJpql_select");
            // this.jpqlUpdateEditor = this.areaNode.getElement(".o2_statement_statementDesignerJpql_update");
            // this.jpqlDeleteEditor = this.areaNode.getElement(".o2_statement_statementDesignerJpql_sdelete");

            // this.jpqlSelectEditor_selectContent= this.jpqlSelectEditor.getElement(".o2_statement_statementDesignerJpql_jpql_selectContent");
            // this.jpqlSelectEditor_fromContent= this.jpqlSelectEditor.getElement(".o2_statement_statementDesignerJpql_jpql_fromContent");
            // this.jpqlSelectEditor_whereContent= this.jpqlSelectEditor.getElement(".o2_statement_statementDesignerJpql_jpql_whereContent");

            this.jpqlEditorNode = this.areaNode.getElement(".o2_statement_statementDesignerJpqlLine");


            // this.runArea = this.areaNode.getElement(".o2_statement_statementRunNode");
            // this.runTitleNode = this.areaNode.getElement(".o2_statement_statementRunTitleNode");
            // this.runContentNode = this.areaNode.getElement(".o2_statement_statementRunContentNode");
            // this.runJsonNode = this.runContentNode.getFirst();
            // this.runActionNode = this.runJsonNode.getNext();
            // this.runResultNode = this.runContentNode.getLast();
            //
            // this.setRunnerSize();
            // this.designer.addEvent("resize", this.setRunnerSize.bind(this));

            this.viewArea = this.areaNode.getElement(".o2_statement_viewNode");

            this.setViewSize();
            this.designer.addEvent("resize", this.setViewSize.bind(this));

            if (this.json.format=="script"){
                this.loadStatementScriptEditor();
            }else{
                this.loadStatementEditor();
            }

            // this.loadStatementRunner();
            this.loadView();
            this.setEvent();
        }.bind(this));
    },
    loadStatementScriptEditor: function(){
        if (! this.scriptEditor){
            debugger;
            o2.require("o2.widget.ScriptArea", function(){
                this.scriptEditor = new o2.widget.ScriptArea(this.scriptArea, {
                    "isbind": false,
                    "maxObj": this.designer.designNode,
                    "title": this.designer.lp.scriptTitle,
                    "onChange": function(){
                        this.json.scriptText = this.scriptEditor.toJson().code;
                    }.bind(this)
                });
                this.scriptEditor.load({"code": this.json.scriptText})
            }.bind(this), false);
        }
    },
    // setRunnerSize: function(){
    //     debugger;
    //     var size = this.areaNode.getSize();
    //     var designerSize = this.designerArea.getComputedSize();
    //     var y = size.y-designerSize.totalHeight;
    //     var mTop = this.runArea.getStyle("margin-top").toInt();
    //     var mBottom = this.runArea.getStyle("margin-bottom").toInt();
    //     var pTop = this.runArea.getStyle("padding-top").toInt();
    //     var pBottom = this.runArea.getStyle("padding-bottom").toInt();
    //     y = y-mTop-mBottom-pTop-pBottom-1;
    //
    //     this.runArea.setStyle("height", ""+y+"px");
    //
    //     var titleSize = this.runTitleNode.getComputedSize();
    //     y = y - titleSize.totalHeight;
    //     this.runContentNode.setStyle("height", ""+y+"px");
    // },
    loadStatementEditor: function(){
        if (!this.editor){
            o2.require("o2.widget.JavascriptEditor", function(){
                this.editor = new o2.widget.JavascriptEditor(this.jpqlEditorNode, {"title": "JPQL", "option": {"mode": "sql"}});
                this.editor.load(function(){
                    if (this.json.data){
                        this.editor.editor.setValue(this.json.data);
                    }else{
                        var table = "table";
                        switch (this.json.type) {
                            case "update":
                                this.editor.editor.setValue("UPDATE "+table+" o SET ");
                                break;
                            case "delete":
                                this.editor.editor.setValue("DELETE "+table+" o WHERE ");
                                break;
                            default:
                                this.editor.editor.setValue("SELECT * FROM "+table+" o");
                        }
                    }
                    this.json.data = this.editor.editor.getValue();

                    this.editor.addEditorEvent("change", function(){
                        debugger;
                        this.data.data = this.editor.getValue();
                        this.checkJpqlType();
                    }.bind(this));

                    // this.editor.editor.on("change", function(){
                    //     this.data.data = this.editor.getValue();
                    //     this.checkJpqlType();
                    // }.bind(this));
                }.bind(this));
            }.bind(this), false);
        }

    },
    setSatementTable: function(){
        if (!this.json.type) this.json.type = "select";
        this.changeType(this.json.type, true);
        if (this.json.data){
            this.editor.editor.setValue(this.json.data);
        }else{
            var table = (this.json.tableObj) ? this.json.tableObj.name : "table";
            switch (this.json.type) {
                case "update":
                    this.editor.editor.setValue("UPDATE "+table+" o SET ");
                    break;
                case "delete":
                    this.editor.editor.setValue("DELETE "+table+" o WHERE ");
                    break;
                default:
                    this.editor.editor.setValue("SELECT * FROM "+table+" o");
            }
        }
    },

    checkJpqlType: function(){
        var str = this.json.data;
        this.json.data = str;
        var jpql_select = /^select/i;
        var jpql_update = /^update/i;
        var jpql_delete = /^delete/i;
        if (jpql_select.test(str)) return this.changeType("select");
        if (jpql_update.test(str)) return this.changeType("update");
        if (jpql_delete.test(str)) return this.changeType("delete");
    },
    changeType: function(type, force){
        if (this.json.type!=type) this.json.type=type;
        if (type != this.jpqlTypeSelect.options[this.jpqlTypeSelect.selectedIndex].value || force){
            for (var i=0; i<this.jpqlTypeSelect.options.length; i++){
                if (this.jpqlTypeSelect.options[i].value==type){
                    this.jpqlTypeSelect.options[i].set("selected", true);
                    break;
                }
            }
        }
    },
    loadStatementHtml: function(callback){
        this.areaNode.loadAll({
            "css": this.path+this.options.style+"/statement.css",
            "html": this.path+"statementDesigner.html"
        }, {
            "bind": {"lp": this.designer.lp, "data": this.data}
        },function(){
            if (callback) callback();
        }.bind(this));
    },
    // loadStatementRunner: function(){
    //     o2.require("o2.widget.JavascriptEditor", function(){
    //         this.jsonEditor = new o2.widget.JavascriptEditor(this.runJsonNode, {"title": "JPQL", "option": {"mode": "json"}});
    //         this.jsonEditor.load(function(){
    //             this.jsonEditor.editor.setValue("{}");
    //         }.bind(this));
    //     }.bind(this), false);
    // },
    setEvent: function(){
        this.formatTypeArea.getElements("input").addEvent("click", function(e){
            if (e.target.checked){
                var v = e.target.get("value");
                if (v==="script"){
                    this.scriptArea.show();
                    this.jpqlArea.hide();
                    this.loadStatementScriptEditor();
                }else{
                    this.scriptArea.hide();
                    this.jpqlArea.show();
                    this.loadStatementEditor();
                }
                this.json.format = v;
            }
        }.bind(this));
        this.entityCategorySelect.addEvent("change", function(e){
            var entityCategory = e.target.options[e.target.selectedIndex].value;
            switch (entityCategory) {
                case "dynamic":
                    this.officialTableArea.hide();
                    this.dynamicTableArea.show();
                    this.customTableArea.hide();
                    break;
                case "custom":
                    this.officialTableArea.hide();
                    this.dynamicTableArea.hide();
                    this.customTableArea.show();
                    break;
                default:
                    this.officialTableArea.show();
                    this.dynamicTableArea.hide();
                    this.customTableArea.hide();
                    break;
            }
            this.json.entityCategory = entityCategory
        }.bind(this));
        //@todo change table
        this.officialTableSelect.addEvent("change", function(e){
            debugger;
            var entityClassName = e.target.options[e.target.selectedIndex].value;
            this.json.entityClassName = entityClassName;
            if (this.json.format=="jpql"){
                if (this.editor){
                    var re = /(.*from\s*)/ig;
                    if (this.json.type=="update") re = /(.*update\s*)/ig;

                    //if (this.json.type=="select" && this.editor){
                        var v = this.json.data;

                        var re2 = /(\s+)/ig;
                        var arr = re.exec(v);
                        if (arr && arr[0]){
                            var left = arr[0]
                            v = v.substring(left.length, v.length);
                            //var ar = re2.exec(v);
                            var right = v.substring(v.indexOf(" "),v.length);
                            this.json.data = left+entityClassName+right;
                            this.editor.editor.setValue(this.json.data);
                        }
                    //}
                }

            }


        //     var className = e.target.options[e.target.selectedIndex].value;
        //     if (this.json.type=="select"){
        //         this.json.data
        //         /(select)*(where|)/g
        //     }
        // }.bind(this));

        // this.jpqlTypeSelect.addEvent("change", function(){
        //     var type = e.target.options[e.target.selectedIndex].value;
        //     switch (entityCategory) {
        //         case "update":
        //             this.jpqlSelectEditor.hide();
        //             this.jpqlUpdateEditor.show();
        //             this.jpqlDeleteEditor.hide();
        //             this.loadJpqlUpdateEditor();
        //             break;
        //         case "delete":
        //             this.jpqlSelectEditor.hide();
        //             this.jpqlUpdateEditor.hide();
        //             this.jpqlDeleteEditor.show();
        //             break;
        //         default:
        //             this.jpqlSelectEditor.show();
        //             this.jpqlUpdateEditor.hide();
        //             this.jpqlDeleteEditor.hide();
        //             break;
        //     }
        }.bind(this));

        // this.runActionNode.getFirst().addEvent("click", this.runStatement.bind(this));

        this.dynamicTableSelect.addEvent("click", this.selectTable.bind(this));
        this.jpqlTypeSelect.addEvent("change", function(){
            var t = this.jpqlTypeSelect.options[this.jpqlTypeSelect.selectedIndex].value;
            if (t!=this.json.type) this.json.type=t;
        }.bind(this));
    },

    selectTable: function(){
        new MWF.O2Selector(this.designer.content, {
            "type": "queryTable",
            "count": 1,
            "values": (this.json.table) ? [this.json.table] : [],
            "title": this.designer.lp.selectTable,
            "onComplete": function(items){
                if (items.length){
                    var id = items[0].data.id;
                    var name = items[0].data.name;
                    this.dynamicTableContent.set("text", name);
                    this.json.table = name;
                    this.json.tableObj = items[0].data;
                }else{
                    this.dynamicTableContent.set("text", "");
                    this.json.table = "";
                }
            }.bind(this)
        });
    },

    runStatement:function(){
        debugger;
        // if (!this.json.data){
        //     this.designer.notice(this.designer.lp.inputStatementData, "error");
        //     return false;
        // }
        o2.require("o2.widget.Mask", null, false);
        this.runMask = new o2.widget.Mask();
        this.runMask.loadNode(this.node);

        this.saveSilence(function(){
            var json = this.jsonEditor.editor.getValue();
            var o = JSON.parse(json);
            o2.Actions.get("x_query_assemble_designer").executeStatement(this.json.id, 1, 50 , o, function(json){
                o2.require("o2.widget.JsonParse", function(){
                    // this.runResultNode.empty();
                    // var jsonResult = new o2.widget.JsonParse(json.data, this.runResultNode);
                    // jsonResult.load();
                }.bind(this));
                this.runMask.hide();
            }.bind(this), function(xhr, text, error){
                debugger;
                if (this.runMask) this.runMask.hide();
                var errorText = error;
                if (xhr){
                    var json = JSON.decode(xhr.responseText);
                    if (json){
                        errorText = json.message.trim() || "request json error";
                    }else{
                        errorText = "request json error: "+xhr.responseText;
                    }
                }
                errorText = errorText.replace(/\</g, "&lt;");
                errorText = errorText.replace(/\</g, "&gt;");
                MWF.xDesktop.notice("error", {x: "right", y:"top"}, errorText);
            }.bind(this))
        }.bind(this));
    },

    save: function(callback){
        debugger;
        if (!this.data.name){
            this.designer.notice(this.designer.lp.inputStatementName, "error");
            return false;
        }
        //if( !this.data.tableType ){
        //    this.data.tableType = "dynamic";
        //}
        if (this.editor) this.data.data = this.editor.editor.getValue();
        if (this.scriptEditor) this.data.scriptText = this.scriptEditor.toJson().code;

        this.designer.actions.saveStatement(this.data, function(json){
            this.designer.notice(this.designer.lp.save_success, "success", this.node, {"x": "left", "y": "bottom"});

            this.data.id = json.data.id;
            if (this.lisNode) {
                this.lisNode.getLast().set("text", this.data.name+"("+this.data.alias+")");
            }
            if (callback) callback();
        }.bind(this));
    },
    _setEditStyle: function(){},

    saveSilence: function(callback){
        if (!this.data.name){
            this.designer.notice(this.designer.lp.inputStatementName, "error");
            return false;
        }
        if (this.editor) this.data.data = this.editor.editor.getValue();
        if (this.scriptEditor) this.data.scriptText = this.scriptEditor.toJson().code;

        this.designer.actions.saveStatement(this.data, function(json){
            //this.designer.notice(this.designer.lp.save_success, "success", this.node, {"x": "left", "y": "bottom"});

            this.data.id = json.data.id;
            if (this.lisNode) {
                this.lisNode.getLast().set("text", this.data.name+"("+this.data.alias+")");
            }
            if (callback) callback();
        }.bind(this));
    },

    loadView : function(){
        if( !this.data.view )this.data.view = {};
        this.view = new MWF.xApplication.query.StatementDesigner.View(this.designer, this, this.data.view, {});
        this.view.load();
    },
    setViewSize: function(){
        debugger;
        var size = this.areaNode.getSize();
        var designerSize = this.designerArea.getComputedSize();
        var y = size.y-designerSize.totalHeight;
        var mTop = this.viewArea.getStyle("margin-top").toInt();
        var mBottom = this.viewArea.getStyle("margin-bottom").toInt();
        var pTop = this.viewArea.getStyle("padding-top").toInt();
        var pBottom = this.viewArea.getStyle("padding-bottom").toInt();
        y = y-mTop-mBottom-pTop-pBottom-1;

        this.viewArea.setStyle("height", ""+y+"px");

        // var titleSize = this.runTitleNode.getComputedSize();
        // y = y - titleSize.totalHeight;
        // this.runContentNode.setStyle("height", ""+y+"px");
    }
});

MWF.xApplication.query.StatementDesigner.View = new Class({
    Extends: MWF.xApplication.query.ViewDesigner.View,
    Implements: [Options, Events],
    options: {
        "style": "default",
        "isView": false,
        "showTab": true,
        "propertyPath": "../x_component_query_StatementDesigner/$Statement/view.html"
    },

    initialize: function(designer, statement, data, options){
        this.setOptions(options);

        this.path = "../x_component_query_ViewDesigner/$View/";
        this.cssPath = "../x_component_query_ViewDesigner/$View/"+this.options.style+"/css.wcss";

        this._loadCss();

        this.statement = statement;
        this.designer = designer;
        this.data = data;

        // if (!this.data.data) this.data.data = {};
        this.parseData();

        this.node = this.statement.viewArea;
        //this.tab = this.designer.tab;

        this.areaNode = new Element("div", {"styles": {"height": "100%", "overflow": "auto"}});

        //MWF.require("MWF.widget.ScrollBar", function(){
        //    new MWF.widget.ScrollBar(this.areaNode, {"distance": 100});
        //}.bind(this));


        // this.propertyListNode = this.designer.propertyDomArea;
        //this.propertyNode = this.designer.propertyContentArea;

        // if(this.designer.application) this.data.applicationName = this.designer.application.name;
        // if(this.designer.application) this.data.application = this.designer.application.id;

        // this.isNewView = (this.data.name) ? false : true;

        this.items = [];
        this.view = this;

        // this.autoSave();
        // this.designer.addEvent("queryClose", function(){
        //     if (this.autoSaveTimerID) window.clearInterval(this.autoSaveTimerID);
        // }.bind(this));
    },
    load : function(){
        this.setAreaNodeSize();
        this.designer.addEvent("resize", this.setAreaNodeSize.bind(this));
        this.areaNode.inject(this.node);

        this.domListNode = new Element("div", {"styles": {"overflow": "hidden"}}).inject(this.designer.propertyDomArea);

        this.loadTemplateStyle( function () {

            this.loadActionbar();

            this.loadView();

            this.loadPaging();

            this.selected();
            this.setEvent();

            //if (this.options.showTab) this.page.showTabIm();
            this.setViewWidth();

            this.designer.addEvent("resize", this.setViewWidth.bind(this));
        }.bind(this))
    },
    parseData: function(){
        this.json = this.data;
        if( !this.json.data || !this.json.data.events ){
            var url = "../x_component_query_StatementDesigner/$Statement/view.json";
            MWF.getJSON(url, {
                "onSuccess": function(obj){
                    if(!this.json.data)this.json.data = obj.data;
                    if(!this.json.data.events)this.json.data.events = obj.data.events;
                }.bind(this),
                "onerror": function(text){
                    this.notice(text, "error");
                }.bind(this),
                "onRequestFailure": function(xhr){
                    this.notice(xhr.responseText, "error");
                }.bind(this)
            },false);
        }
    },

    showProperty: function(){
        if (!this.property){
            this.property = new MWF.xApplication.query.StatementDesigner.Property(this, this.designer.propertyContentArea, this.designer, {
                "path": this.options.propertyPath,
                "onPostLoad": function(){
                    this.property.show();
                }.bind(this)
            });
            this.property.load();
        }else{
            this.property.show();
        }
    },
    hideProperty: function(){
        if (this.property) this.property.hide();
    },

    loadViewData: function(){
        if (this.data.id){
            this.saveSilence(function(){
                this.viewContentBodyNode.empty();
                this.viewContentTableNode = new Element("table", {
                    "styles": this.css.viewContentTableNode,
                    "border": "0px",
                    "cellPadding": "0",
                    "cellSpacing": "0"
                }).inject(this.viewContentBodyNode);

                this.designer.actions.loadView(this.data.id, null,function(json){
                    var entries = {};

                    json.data.selectList.each(function(entry){entries[entry.column] = entry;}.bind(this));

                    if (this.json.data.group.column){
                        if (json.data.groupGrid.length){
                            var groupColumn = null;
                            for (var c = 0; c<json.data.selectList.length; c++){
                                if (json.data.selectList[c].column === json.data.group.column){
                                    groupColumn = json.data.selectList[c];
                                    break;
                                }
                            }

                            json.data.groupGrid.each(function(line, idx){
                                var groupTr = new Element("tr", {
                                    "styles": this.json.data.viewStyles ? this.json.data.viewStyles["contentTr"] : this.css.viewContentTrNode,
                                    "data-is-group" : "yes"
                                }).inject(this.viewContentTableNode);
                                var colSpan = this.items.length ;
                                var td = new Element("td", {
                                    "styles": this.json.data.viewStyles ? this.json.data.viewStyles["contentGroupTd"] : this.css.viewContentGroupTdNode,
                                    "colSpan": colSpan
                                }).inject(groupTr);

                                var groupAreaNode;
                                if( this.json.data.viewStyles ){
                                    groupAreaNode = new Element("div", {"styles": this.json.data.viewStyles["groupCollapseNode"]}).inject(td);
                                    groupAreaNode.set("text", line.group);
                                }else{
                                    groupAreaNode = new Element("div", {"styles": this.css.viewContentTdGroupNode}).inject(td);
                                    var groupIconNode = new Element("div", {"styles": this.css.viewContentTdGroupIconNode}).inject(groupAreaNode);
                                    var groupTextNode = new Element("div", {"styles": this.css.viewContentTdGroupTextNode}).inject(groupAreaNode);
                                    if (groupColumn){
                                        //groupTextNode.set("text", (groupColumn.code) ? MWF.Macro.exec(groupColumn.code, {"value": line.group, "gridData": json.data.groupGrid, "data": json.data, "entry": line}) : line.group);
                                        groupTextNode.set("text", line.group);
                                    }else{
                                        groupTextNode.set("text", line.group);
                                    }

                                }



                                var subtrs = [];

                                line.list.each(function(entry){
                                    var tr = new Element("tr", {
                                        "styles": this.json.data.viewStyles ? this.json.data.viewStyles["contentTr"] : this.css.viewContentTrNode
                                    }).inject(this.viewContentTableNode);
                                    tr.setStyle("display", "none");

                                    //this.createViewCheckboxTd( tr );

                                    var td = new Element("td", {
                                        "styles": this.json.data.viewStyles ? this.json.data.viewStyles["contentTd"] : this.css.viewContentTdNode
                                    }).inject(tr);

                                    Object.each(entries, function(c, k){
                                        var d = entry.data[k];
                                        if (d!=undefined){
                                            if (k!=this.json.data.group.column){
                                                var td = new Element("td", {
                                                    "styles": this.json.data.viewStyles ? this.json.data.viewStyles["contentTd"] : this.css.viewContentTdNode
                                                }).inject(tr);
                                                //td.set("text", (entries[k].code) ? MWF.Macro.exec(entries[k].code, {"value": d, "gridData": json.data.groupGrid, "data": json.data, "entry": entry}) : d);

                                                if (c.isHtml){
                                                    td.set("html", d);
                                                }else{
                                                    td.set("text", d);
                                                }

                                            }
                                        }
                                    }.bind(this));

                                    // Object.each(entry.data, function(d, k){
                                    //     if (k!=this.json.data.group.column){
                                    //         var td = new Element("td", {"styles": this.css.viewContentTdNode}).inject(tr);
                                    //         td.set("text", (entries[k].code) ? MWF.Macro.exec(entries[k].code, {"value": d, "gridData": json.data.groupGrid, "data": json.data, "entry": entry}) : d);
                                    //     }
                                    // }.bind(this));
                                    subtrs.push(tr)
                                }.bind(this));

                                groupAreaNode.store("subtrs", subtrs);

                                var _self = this;
                                groupAreaNode.addEvent("click", function(){
                                    var subtrs = this.retrieve("subtrs");
                                    var iconNode = groupAreaNode.getFirst("div");
                                    if (subtrs[0]){
                                        if (subtrs[0].getStyle("display")=="none"){
                                            subtrs.each(function(subtr){ subtr.setStyle("display", "table-row"); });
                                            if( iconNode ) {
                                                iconNode.setStyle("background", "url(" + "../x_component_process_StatementDesigner/$View/default/icon/down.png) center center no-repeat");
                                            }else{
                                                this.setStyles( _self.json.data.viewStyles["groupExpandNode"] )
                                            }
                                        }else{
                                            subtrs.each(function(subtr){ subtr.setStyle("display", "none"); });
                                            if( iconNode ) {
                                                iconNode.setStyle("background", "url(" + "../x_component_process_StatementDesigner/$View/default/icon/right.png) center center no-repeat");
                                            }else{
                                                this.setStyles( _self.json.data.viewStyles["groupCollapseNode"] )
                                            }
                                        }
                                    }
                                    _self.setContentHeight();
                                });
                            }.bind(this));
                            this.setContentColumnWidth();
                            this.setContentHeight();
                        }else if(this.json.data.noDataText){
                            var noDataTextNodeStyle = this.css.noDataTextNode;
                            if( this.json.data.viewStyles ){
                                if( this.json.data.viewStyles["noDataTextNode"] ){
                                    noDataTextNodeStyle = this.json.data.viewStyles["noDataTextNode"]
                                }else{
                                    this.json.data.viewStyles["noDataTextNode"] = this.css.noDataTextNode
                                }
                            }
                            this.noDataTextNode = new Element( "div", {
                                "styles": noDataTextNodeStyle,
                                "text" : this.json.data.noDataText
                            }).inject( this.viewContentBodyNode );
                        }

                    }else{

                        if (json.data.grid.length){
                            json.data.grid.each(function(line, idx){
                                var tr = new Element("tr", {
                                    "styles": this.json.data.viewStyles ? this.json.data.viewStyles["contentTr"] : this.css.viewContentTrNode
                                }).inject(this.viewContentTableNode);

                                //this.createViewCheckboxTd( tr );

                                Object.each(entries, function(c, k){
                                    var d = line.data[k];
                                    if (d!=undefined){
                                        var td = new Element("td", {
                                            "styles": this.json.data.viewStyles ? this.json.data.viewStyles["contentTd"] : this.css.viewContentTdNode
                                        }).inject(tr);
                                        //td.set("text", (entries[k].code) ? MWF.Macro.exec(entries[k].code, {"value": d, "gridData": json.data.grid, "data": json.data, "entry": line}) : d);
                                        if (c.isHtml){
                                            td.set("html", d);
                                        }else{
                                            td.set("text", d);
                                        }
                                        //td.set("text", d);
                                    }
                                }.bind(this));

                                // Object.each(line.data, function(d, k){
                                //     var td = new Element("td", {"styles": this.css.viewContentTdNode}).inject(tr);
                                //     td.set("text", (entries[k].code) ? MWF.Macro.exec(entries[k].code, {"value": d, "gridData": json.data.grid, "data": json.data, "entry": line}) : d);
                                // }.bind(this));
                            }.bind(this));
                            this.setContentColumnWidth();
                            this.setContentHeight();
                        }else if(this.json.data.noDataText){
                            var noDataTextNodeStyle = this.css.noDataTextNode;
                            if( this.json.data.viewStyles ){
                                if( this.json.data.viewStyles["noDataTextNode"] ){
                                    noDataTextNodeStyle = this.json.data.viewStyles["noDataTextNode"]
                                }else{
                                    this.json.data.viewStyles["noDataTextNode"] = this.css.noDataTextNode
                                }
                            }
                            this.noDataTextNode = new Element( "div", {
                                "styles": noDataTextNodeStyle,
                                "text" : this.json.data.noDataText
                            }).inject( this.viewContentBodyNode );
                        }
                    }
                }.bind(this));
            }.bind(this));
        }
    },
    addColumn: function(){

        debugger;

        MWF.require("MWF.widget.UUID", function(){
            var id = (new MWF.widget.UUID).id;
            var json = {
                "id": id,
                "column": id,
                "displayName": this.designer.lp.unnamed,
                "orderType": "original"
            };
            if (!this.json.data.selectList) this.json.data.selectList = [];
            this.json.data.selectList.push(json);
            var column = new MWF.xApplication.query.StatementDesigner.View.Column(json, this);
            this.items.push(column);
            column.selected();

            if (this.viewContentTableNode){
                var trs = this.viewContentTableNode.getElements("tr");
                trs.each(function(tr){
                    new Element("td", {"styles": this.css.viewContentTdNode}).inject(tr)
                }.bind(this));
                //this.setContentColumnWidth();
            }
            this.setViewWidth();
            this.addColumnNode.scrollIntoView(true);

        }.bind(this));
        //new Fx.Scroll(this.view.areaNode, {"wheelStops": false, "duration": 0}).toRight();
    },
    unSelected: function(){
        this.currentSelectedModule = null;
        this.hideProperty();
    },
    loadViewColumns: function(){
        //    for (var i=0; i<10; i++){
        if (this.json.data.selectList) {
            this.json.data.selectList.each(function (json) {
                this.items.push(new MWF.xApplication.query.StatementDesigner.View.Column(json, this));

            }.bind(this));
        }
        //    }
    },
    showActionbar : function( noSetHeight ){
        this.actionbarNode.show();
        if( !this.json.data.actionbarList )this.json.data.actionbarList = [];
        if( !this.actionbarList || this.actionbarList.length == 0 ){
            if( this.json.data.actionbarList.length ){
                this.json.data.actionbarList.each( function(json){
                    this.actionbarList.push( new MWF.xApplication.query.StatementDesigner.View.Actionbar( json, this.json.data.actionbarList, this) )
                }.bind(this));
            }else{
                this.actionbarList.push( new MWF.xApplication.query.StatementDesigner.View.Actionbar( null, this.json.data.actionbarList, this) )
            }
        }
        if( !noSetHeight )this.setContentHeight();
    },
    loadPaging: function( noSetHeight ){
        this.pagingNode = new Element("div#pagingNode", {"styles": this.css.pagingNode}).inject(this.areaNode);
        this.pagingList = [];
        if( !this.json.data.pagingList )this.json.data.pagingList = [];
        if( !this.pagingList || this.pagingList.length == 0 ){
            if( this.json.data.pagingList.length ){
                this.json.data.pagingList.each( function(json){
                    this.pagingList.push( new MWF.xApplication.query.StatementDesigner.View.Paging( json, this.json.data.pagingList, this) )
                }.bind(this));
            }else{
                this.pagingList.push( new MWF.xApplication.query.StatementDesigner.View.Paging( null, this.json.data.pagingList, this) )
            }
        }
        // if( !noSetHeight )this.setContentHeight();
    },
    setViewWidth: function(){
        if( !this.viewAreaNode )return;
        this.viewAreaNode.setStyle("width", "auto");
        this.viewTitleNode.setStyle("width", "auto");

        var s1 = this.viewTitleTableNode.getSize();
        var s2 = this.refreshNode.getSize();
        var s3 = this.addColumnNode.getSize();
        var width = s1.x+s2.x+s2.x;
        var size = this.areaNode.getSize();

        if (width>size.x){
            this.viewTitleNode.setStyle("width", ""+width+"px");
            this.viewAreaNode.setStyle("width", ""+width+"px");
        }else{
            this.viewTitleNode.setStyle("width", ""+size.x+"px");
            this.viewAreaNode.setStyle("width", ""+size.x+"px");
        }
        this.setContentColumnWidth();
        this.setContentHeight();
    },


    preview: function(){
        if( this.isNewView ){
            this.designer.notice( this.designer.lp.saveViewNotice, "error" );
            return;
        }
        this.saveSilence( function () {
            var url = "../x_desktop/app.html?app=query.Query&status=";
            url += JSON.stringify({
                id : this.data.application,
                viewId : this.data.id
            });
            window.open(o2.filterUrl(url),"_blank");
        }.bind(this));
    },
    saveSilence: function(callback){
        if (!this.data.name){
            this.designer.notice(this.designer.lp.notice.inputName, "error");
            return false;
        }

        this.designer.actions.saveView(this.data, function(json){
            this.data.id = json.data.id;
            this.isNewView = false;
            //this.page.textNode.set("text", this.data.name);
            if (this.lisNode) {
                this.lisNode.getLast().set("text", this.data.name+"("+this.data.alias+")");
            }
            if (callback) callback();
        }.bind(this));
    },
    save: function(callback){
        //if (this.designer.tab.showPage==this.page){
        if (!this.data.name){
            this.designer.notice(this.designer.lp.notice.inputName, "error");
            return false;
        }
        //}
        this.designer.actions.saveView(this.data, function(json){
            this.designer.notice(this.designer.lp.notice.save_success, "success", this.node, {"x": "left", "y": "bottom"});
            this.isNewView = false;
            this.data.id = json.data.id;
            //this.page.textNode.set("text", this.data.name);
            if (this.lisNode) {
                this.lisNode.getLast().set("text", this.data.name+"("+this.data.alias+")");
            }
            if (callback) callback();
        }.bind(this));
    },
    _setEditStyle: function(name, input, oldValue){
        if( name=="data.actionbarHidden" ){
            if( this.json.data.actionbarHidden ){
                this.hideActionbar()
            }else{
                this.showActionbar()
            }
        }
        if( name=="data.selectAllEnable" ){
            if( this.json.data.selectAllEnable ){
                this.viewTitleTrNode.getElement(".viewTitleCheckboxTd").setStyle("display","table-cell");
                this.viewContentTableNode.getElements(".viewContentCheckboxTd").setStyle("display","table-cell");
            }else{
                this.viewTitleTrNode.getElement(".viewTitleCheckboxTd").setStyle("display","none");
                this.viewContentTableNode.getElements(".viewContentCheckboxTd").setStyle("display","none");
            }
        }
        if (name=="data.viewStyleType"){

            var file = (this.stylesList && this.json.data.viewStyleType) ? this.stylesList[this.json.data.viewStyleType].file : null;
            var extendFile = (this.stylesList && this.json.data.viewStyleType) ? this.stylesList[this.json.data.viewStyleType].extendFile : null;
            this.loadTemplateStyles( file, extendFile, function( templateStyles ){
                this.templateStyles = templateStyles;

                var oldFile, oldExtendFile;
                if( oldValue && this.stylesList[oldValue] ){
                    oldFile = this.stylesList[oldValue].file;
                    oldExtendFile = this.stylesList[oldValue].extendFile;
                }
                this.loadTemplateStyles( oldFile, oldExtendFile, function( oldTemplateStyles ){

                    this.json.data.styleConfig = (this.stylesList && this.json.data.viewStyleType) ? this.stylesList[this.json.data.viewStyleType] : null;

                    if (oldTemplateStyles["view"]) this.clearTemplateStyles(oldTemplateStyles["view"]);
                    if (this.templateStyles["view"]) this.setTemplateStyles(this.templateStyles["view"]);
                    this.setAllStyles();

                    this.actionbarList.each( function (module) {
                        if (oldTemplateStyles["actionbar"]){
                            module.clearTemplateStyles(oldTemplateStyles["actionbar"]);
                        }
                        module.setStyleTemplate();
                        module.setAllStyles();
                    })

                    this.pagingList.each( function (module) {
                        if (oldTemplateStyles["paging"]){
                            module.clearTemplateStyles(oldTemplateStyles["paging"]);
                        }
                        module.setStyleTemplate();
                        module.setAllStyles();
                    });

                    // this.moduleList.each(function(module){
                    //     if (oldTemplateStyles[module.moduleName]){
                    //         module.clearTemplateStyles(oldTemplateStyles[module.moduleName]);
                    //     }
                    //     module.setStyleTemplate();
                    //     module.setAllStyles();
                    // }.bind(this));
                }.bind(this))

            }.bind(this))
        }
        if (name=="data.viewStyles"){
            this.setCustomStyles();
        }
    },
    removeStyles: function(from, to){
        if (this.json.data.viewStyles[to]){
            Object.each(from, function(style, key){
                if (this.json.data.viewStyles[to][key] && this.json.data.viewStyles[to][key]==style){
                    delete this.json.data.viewStyles[to][key];
                }
            }.bind(this));
        }
    },
    copyStyles: function(from, to){
        if (!this.json.data.viewStyles[to]) this.json.data.viewStyles[to] = {};
        Object.each(from, function(style, key){
            if (!this.json.data.viewStyles[to][key]) this.json.data.viewStyles[to][key] = style;
        }.bind(this));
    },

    saveAs: function(){
        var form = new MWF.xApplication.query.StatementDesigner.View.NewNameForm(this, {
            name : this.data.name + "_" + MWF.xApplication.query.StatementDesigner.LP.copy,
            query : this.data.query || this.data.application,
            queryName :	this.data.queryName || this.data.applicationName
        }, {
            onSave : function( data, callback ){
                this._saveAs( data, callback );
            }.bind(this)
        }, {
            app: this.designer
        });
        form.edit()
    },
    _saveAs : function( data , callback){
        var _self = this;

        var d = this.cloneObject( this.data );

        d.isNewView = true;
        d.id = this.designer.actions.getUUID();
        d.name = data.name;
        d.alias = "";
        d.query = data.query;
        d.queryName = data.queryName;
        d.application = data.query;
        d.applicationName = data.queryName;
        d.pid = d.id + d.id;

        delete d[this.data.id+"viewFilterType"];
        d[d.id+"viewFilterType"]="custom";

        d.data.selectList.each( function( entry ){
            entry.id = (new MWF.widget.UUID).id;
        }.bind(this));

        this.designer.actions.saveView(d, function(json){
            this.designer.notice(this.designer.lp.notice.saveAs_success, "success", this.node, {"x": "left", "y": "bottom"});
            if (callback) callback();
        }.bind(this));
    }

});

MWF.xApplication.query.StatementDesigner.View.Column = new Class({
    Extends: MWF.xApplication.query.ViewDesigner.View.Column
});

MWF.xApplication.query.StatementDesigner.View.Actionbar = new Class({
    Extends: MWF.xApplication.query.ViewDesigner.View.Actionbar
});

MWF.xApplication.query.StatementDesigner.View.Paging = new Class({
    Extends: MWF.xApplication.query.ViewDesigner.View.Paging
});