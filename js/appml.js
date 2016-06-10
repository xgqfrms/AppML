//Appml v1.000 - Created by Refsnes Data for W3Schools. Please don't remove this line.
function AppML(appsrc, appname) {
    this.appName = appname;
    this.appSrc = appsrc;
    this.appmlID = [];
    this.displayType = "list";
    this.updateFields = [];
    this.keyFields = [];
    this.keyFieldCounter = 0;
    this.records = [];
    this.modelTemplateElement = "";
    this.controlItem = [];
    this.controlFunction = [];
    this.controlValue = [];
    this.queryFields = [];
    this.queryValues = [];
    this.queryDisplayValues = [];
    this.queryTypes = [];
    this.queryOperators = [];
    this.queryDisplayOperators = [];
    this.orderBys = [];
    this.orderByLabels = [];
    this.orderByDirections = [];
    this.rowsPerPage =0;
    this.cmdNavigate = true;
    this.maxRecords = 0;
    this.recPos = 1;
    this.commands = true;
    function xmlHttp(target, xml, method, a, readyfunc) {
        var httpObj, async = a;
        if (async !== true) {async = false; }
        if (method !== "GET" && method !== "POST") {
            window.alert("The httpRequest requires GET or POST");
            return false;
        }
        if (window.XMLHttpRequest) {
            httpObj = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            httpObj = new ActiveXObject("Microsoft.XMLHTTP");
        }
        if (httpObj) {
            if (async === true) {
                if (readyfunc) {httpObj.onreadystatechange = readyfunc; }
            }
            httpObj.open(method, target, async);
            httpObj.send(xml);
            if (httpObj.status === 404) {window.alert("The page cannot be found: " + target); }
            if (async === false) {return httpObj; }
        }
    }
    function loadXmlDoc(xml) {
        var xmlDoc, doc;
        if (window.ActiveXObject) {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(xml);
        } else {
            doc = new DOMParser();
            xmlDoc = doc.parseFromString(xml, "text/xml");
        }
        return xmlDoc;
    }
    function getNodeValue(x) {
        var v = "", i, l = 0;
        try {
            l = x.childNodes.length;
        } catch (er) {
            l = 0;
        }
        for (i = 0; i < l; i++) {
            try {
                v = v + x.childNodes[i].nodeValue;
            } catch (er2) {
            }
        }
        return v;
    }
    function rTrim(txt) {
        while (txt.charCodeAt((txt.length - 1)) === 10 || txt.charCodeAt((txt.length - 1)) === 13 || txt.charCodeAt((txt.length - 1)) === 32) {
            txt = txt.substring(0, txt.length - 1);
        }
        return txt;
    }
    function makeXml(txt) {
        var tlen = 3, n, i, addtxt, j, newtxt = "", symbol = [], entity = [];
        symbol[0] = "<";
        entity[0] = "&#60;";
        symbol[1] = ">";
        entity[1] = "&#62;";
        symbol[2] = "&";
        entity[2] = "&#38;";
        symbol[3] = "&";
        entity[3] = "&#38;";
        if (txt) {
            n = rTrim(txt).length;
        } else {
            return "";
        }
        for (i = 0; i < n; i++) {
            addtxt = txt.substr(i, 1);
            for (j = 0; j <= tlen; j++) {
                if (addtxt === symbol[j]) {addtxt = entity[j]; }
            }
            newtxt = newtxt + addtxt;
        }
        return newtxt;
    }
    function decodeXml(x) {
        var l, i, j, c = "", n = "", count, code = [], decode = [];
        code[1] = "#1001;";
        code[2] = "#1002;";
        code[3] = "#1003;";
        decode[1] = "<";
        decode[2] = ">";
        decode[3] = "&";
        count = 3;
        l = x.length;
        for (i = 0; i < l; i++) {
            c = x.substr(i, 1);
            if (c === "#") {
                for (j = 1; j <= count; j++) {
                    if (x.substr(i, 6) === code[j]) {
                        c = decode[j];
                        i = i + 5;
                    }
                }
            }
            n = n + c;
        }
        return n;
    }
    function addClass(x, addclass) {
        var clsnm = x.className;
        if (clsnm === addclass) {return false; }
        if (clsnm.indexOf(addclass + " ") === 0) {return false; }
        if (clsnm.indexOf(" " + addclass) > -1) {
            if (clsnm.indexOf(addclass) + addclass.length === clsnm.length) {return false; }
            if (clsnm.indexOf(" " + addclass + " ") > -1) {return false; }
        }
        x.className = clsnm + " " + addclass;
    }
    function removeClass(x, removeclass) {
        var clsnm = x.className;
        if (clsnm === removeclass) {
            clsnm = "";
        } else {
            if (clsnm.indexOf(removeclass) === 0) {
                clsnm = clsnm.replace(removeclass + " ", "");
            } else {
                if (clsnm.indexOf(removeclass) + removeclass.length === clsnm.length) {
                    clsnm = clsnm.replace(" " + removeclass, "");
                } else {
                    clsnm = clsnm.replace(" " + removeclass + " ", "");
                }
            }
        }
        x.className = clsnm;
    }
    //Denne leter innenfor et bestemt element (x):
    function getElmnt2(x, id) {
        var i, l, y = x.getElementsByTagName("*"), z = id.toUpperCase();
        l = y.length;
        for (i = 0; i < l; i++) {
            if (y[i].id.toUpperCase() === z) {return y[i]; }
        }
    }
    function reformatDate(txt, dtype) {
        var d, m, y;
        if (txt !== "") {
            d = txt.substr(dtype.indexOf("dd"), 2);
            m = txt.substr(dtype.indexOf("mm"), 2);
            y = txt.substr(dtype.indexOf("yyyy"), 4);
            return y + "/" + m + "/" + d;
        }
        return "";
    }
    function getAttributeValue(x, name) {
        if (x.getAttribute(name)) {return x.getAttribute(name); }
        return "";
    }
// check how the browser replaces the innerHTML, IE has problems replacing innerHTML of som elements, like TR
    function checkReplaceInnerHTML(elmnt) {
        var cc, cc1, cc2, cc3, x = 1;
        try {
            cc = elmnt.cloneNode(true);
            cc1 = cc.innerHTML.length;
            cc3 = cc.innerHTML;
            cc.innerHTML = cc3;
            cc2 = cc.innerHTML.length;
            if (cc1 !== cc2) {x = 0; }
        } catch (er) {
            x = 0;
        }
        return x;
    }
    function isDate(x) {
        return (null !== x) && !isNaN(x) && (x.getDate !== "undefined");
    }
    function cmdInits(obj) {
        if (obj.displayType.toUpperCase() === "REPORT" || (obj.displayType.toUpperCase() === "FORM" && obj.appmlID[0] !== "" && obj.appmlID[0] !== undefined)) {
            if (obj.recordNumberDisplay === undefined) {obj.recordNumberDisplay = 0; }
            if (obj.btnFirst === undefined) {obj.btnFirst = 0; }
            if (obj.btnPrevious === undefined) {obj.btnPrevious = 0; }
            if (obj.btnNext === undefined) {obj.btnNext = 0; }
            if (obj.btnLast === undefined) {obj.btnLast = 0; }
        } else {
            if (obj.recordNumberDisplay === undefined) {obj.recordNumberDisplay = 1; }
            if (obj.btnFirst === undefined) {obj.btnFirst = 1; }
            if (obj.btnPrevious === undefined) {obj.btnPrevious = 1; }
            if (obj.btnNext === undefined) {obj.btnNext = 1; }
            if (obj.btnLast === undefined) {obj.btnLast = 1; }
        }
        if (obj.displayType.toUpperCase() === "LIST" && (obj.clickNew === undefined || obj.clickNew === "")) {
            obj.btnNew = 0;
        }
        if (obj.clickReport === undefined || obj.clickReport === "") {
            obj.btnReport = 0;
        } else {
            obj.btnReport = 1;
        }
        if (obj.btnFilter === undefined) {obj.btnFilter = (obj.displayType.toUpperCase() === "FORM") ? 0 : 1; }
        if (obj.btnNew === undefined) {obj.btnNew = (obj.displayType.toUpperCase() === "REPORT") ? 0 : 1; }
        if (obj.btnSave === undefined) {obj.btnSave = (obj.displayType.toUpperCase() === "FORM") ? 1 : 0; }
        if (obj.btnDelete === undefined) {obj.btnDelete = (obj.displayType.toUpperCase() === "FORM") ? 1 : 0; }
        if (obj.rowsPerPage == 0) {
            if (obj.displayType.toUpperCase() === "FORM") {
                obj.rowsPerPage = 1;
            } else if (obj.displayType.toUpperCase() === "REPORT") {
                obj.rowsPerPage = 500;
            } else {
                obj.rowsPerPage = 15;
            }
        }
    }
    function make_xml(txt) {
        var tlen = 3, n, i, addtxt, j, newtxt = "", symbol = [], entity = [];
        symbol[0] = "<";
        entity[0] = "&#60;";
        symbol[1] = ">";
        entity[1] = "&#62;";
        symbol[2] = "&";
        entity[2] = "&#38;";
        symbol[3] = "&";
        entity[3] = "&#38;";
        if (txt) {
            n = rTrim(txt).length;
        } else {
            return "";
        }
        for (i = 0; i < n; i++) {
            addtxt = txt.substr(i, 1);
            for (j = 0; j <= tlen; j++) {
                if (addtxt === symbol[j]) {addtxt = entity[j]; }
            }
            newtxt = newtxt + addtxt;
        }
        return newtxt;
    }
    this.run = function (container, tempID, id) {
        var cc;
        if (id) {
            this.appmlID = (typeof id === "object") ? id : [id];
        }
        if (container !== undefined) {
            if (typeof container === "object") {
                this.container = container;
            } else {
                this.container = document.getElementById(container);
            }
        }
        cmdInits(this);
        if (this.container === undefined || this.container === null) {
            if (container !== "" && container !== undefined) {
                window.alert("The container '" + container + "' does not exist.");
            } else {
                window.alert("Container for AppML not defined");
            }
            return -1;
        }
        if (tempID !== undefined && tempID !== "") {
            cc = document.getElementById(tempID);
            if (cc === undefined || cc === null) {
                window.alert("The template '" + tempID + "' does not exist.");
                return -1;
            }
            this.template = cc.cloneNode(true);
        }
        if (this.displayType.toUpperCase() === "FORM") {
            addClass(this.container, "appmlformout");
            this.closeBtn = 1;
            if (id === "NULL") {this.btnDelete = 0; }                        
        }
        this.container.style.display = "block";
        if (this.getData(1) === -1) {return -1; }
        this.displayContainers();
        this.writeCommands();
        this.setCommandEvents();
        this.getTemplate();
        //xx=new Date() + " :" + new Date().getMilliseconds()
        this.displayHTML();
        //alert(xx + "\n" + new Date() + " :" + new Date().getMilliseconds())        
    };
    //Denne leter i appmlobjectets container:
    this.getElmnt = function (id) {
        if (!this.container) {return false; }
        var y = this.container.getElementsByTagName("*"), l = y.length, i;
        for (i = 0; i < l; i++) {
            if (y[i].id === id) {return y[i]; }
        }
    };
    this.fnpl = function (nav) {
        this.getData(nav);
        this.getTemplate();
        this.displayHTML();
    };
    this.getData = function (nav) {
        var navigate = nav, xmlhttp, xmldoc, xml = "", errmsg = null, dataout, iname, itype, ivalue, keyvalue, l, ll, y, yy, i, ii, cc;
        this.records = [];
        if (navigate === 1) {navigate = "first"; }
        if (!navigate || navigate === "") {navigate = "first"; }
        //HER M� KODE INN SOM SJEKKER OM NOE HAR BLITT ENDRET
        xml = "<?xml version='1.0' encoding='UTF-8' ?>";
        xml = xml + "<appml>";
        xml = xml + "<action>GET</action>";
        xml = xml + "<displaytype>" + this.displayType.toLowerCase() + "</displaytype>";
        l = (!this.appmlID) ? 0 : this.appmlID.length;
        for (i = 0; i < l; i++) {
            if (this.appmlID[i] === "NULL") {navigate = "new"; }
            if (this.appmlID[i] !== undefined) {xml = xml + "<appmlid>" + this.appmlID[i] + "</appmlid>"; }
        }
        xml = xml + "<appname>" + this.appName + "</appname>";
        xml = xml + "<navigate>" + navigate + "</navigate>";
        xml = xml + "<rowsperpage>" + this.rowsPerPage + "</rowsperpage>";
        xml = xml + "<maxrecords>" + this.maxRecords + "</maxrecords>";
        xml = xml + "<recpos>" + this.recPos + "</recpos>";
        xml = xml + "<filters>";
        if (this.queryFields) {
            l = this.queryFields.length;
            for (i = 0; i < l; i++) {
                xml = xml + "<query><field>" + this.queryFields[i] + "</field><operator>" + this.queryOperators[i] + "</operator>";
                ll = this.queryValues[i].length;
                for (ii = 0; ii < ll; ii++) {
                    xml = xml + "<value>" + make_xml(this.queryValues[i][ii]) + "</value>";
                }
                xml = xml + "</query>";
            }
        }
        if (this.orderBys) {
            l = this.orderBys.length;
            for (i = 0; i < l; i++) {
                xml = xml + "<orderby><field label='" + this.orderByLabels[i] + "'>" + this.orderBys[i] + "</field><direction>" + this.orderByDirections[i] + "</direction></orderby>";
            }
        }
        xml = xml + "</filters>";
        xml = xml + "</appml>";
        //alert("111 Request " + xml)
        xmlhttp = xmlHttp(this.appSrc + "?r=" + Math.random(), xml, "POST", false);
        xmldoc = xmlhttp.responseXML;
        //alert("222 Answer" + xmlhttp.responseText);
        if (errmsg === null && ((xmldoc === null) || xmldoc.childNodes.length === 0)) {errmsg = xmlhttp.responseText; }
        if (errmsg === null && xmldoc.getElementsByTagName("error").length > 0) {errmsg = xmldoc.getElementsByTagName("error")[0].firstChild.nodeValue; }
        if (errmsg !== null) {
        	errmsg = this.translate(errmsg);
            this.fromRec = 0;
            this.toRec = 0;
            this.recCounter = 0;
            this.totalRecCounter = 0;
            if (errmsg === "") {errmsg = "Empty response."; }
            try {
                this.displayMessage(errmsg);
            } catch (er) {
                window.alert(errmsg);
            }
            return -1;
        }
        if (this.displayType.toUpperCase() === "LIST" || this.displayType.toUpperCase() === "FORM" || this.displayType.toUpperCase() === "REPORT") {
            this.fromRec = xmldoc.getElementsByTagName("fromrec")[0].firstChild.nodeValue;
            this.toRec = xmldoc.getElementsByTagName("torec")[0].firstChild.nodeValue;
            this.recCounter = xmldoc.getElementsByTagName("reccounter")[0].firstChild.nodeValue;
            if (!isNaN(this.recCounter)) {this.recCounter = Number(this.recCounter); }
            this.totalRecCounter = xmldoc.getElementsByTagName("totalreccounter")[0].firstChild.nodeValue;
            this.dateFormat = xmldoc.getElementsByTagName("dateformat")[0].firstChild.nodeValue;
            this.recPos = xmldoc.getElementsByTagName("recpos")[0].firstChild.nodeValue;
            if (xmldoc.getElementsByTagName("appmlmodel").length > 0) {
                this.modelXML = xmldoc.getElementsByTagName("appmlmodel")[0];
                this.getModel();
            }
        }
        cc = xmldoc.getElementsByTagName("dataout")[0].firstChild.nodeValue;
        dataout = loadXmlDoc(cc);
        this.itemNames = [];
        this.itemTypes = [];
        y = dataout.getElementsByTagName("record");
        l = y.length;
        for (i = 0; i < l; i++) {
            this.records[i] = {};
            this.records[i].itemValues = [];
            this.records[i].keyValues = [];
            yy = y[i].getElementsByTagName("keyvalue");
            ll = yy.length;
            for (ii = 0; ii < ll; ii++) {
                keyvalue = getNodeValue(yy[ii]);
                if (keyvalue === "-1") {keyvalue = ""; }
                this.records[i].keyValues[ii] = keyvalue;
            }
            yy = y[i].getElementsByTagName("item");
            ll = yy.length;
            for (ii = 0; ii < ll; ii++) {
                iname = getNodeValue(yy[ii].getElementsByTagName("name")[0]);
                itype = getNodeValue(yy[ii].getElementsByTagName("type")[0]);
                ivalue = getNodeValue(yy[ii].getElementsByTagName("value")[0]);
                if (ivalue !== "") {ivalue = decodeXml(ivalue); }
                this.itemNames[ii] = iname;
                this.itemTypes[ii] = itype;
                this.records[i].itemValues[ii] = ivalue;
            }
        }
        this.itemCounter = this.itemNames.length;
    };
    this.appmlFixFNPL = function (from, to, count) {
        var cc, i, x, typ, fc = this.rowsPerPage, recout;
        if (this.cmdNavigate === false) {
            this.disableFNPL("first");
            this.disableFNPL("next");
            this.disableFNPL("previous");
            this.disableFNPL("last");
            return;
        }
        for (i = 1; i <= 4; i++) {
            typ = "";
            if (i === 1) {
                x = "first";
                if (from <= 1) {typ = "disable"; }
            }
            if (i === 2) {
                x = "previous";
                if (from <= 1) {typ = "disable"; }
            }
            if (i === 3) {
                x = "next";
                if (to === count) {typ = "disable"; }
            }
            if (i === 4) {
                x = "last";
                if (((to === count) && ((Number(from) - 1) === (Number(to) - Number(fc)))) || (Number(count) < Number(fc))) {typ = "disable"; }
            }
            if (this.getElmnt("db_000_nav_" + x) && typ === "disable") {
                this.disableFNPL(x);
            } else {
                this.enableFNPL(x);
            }
        }
        if (to === "0") {from = "0"; }
        recout = from + " - " + to + " " + this.translate("APPML_MESSAGE_OF") + " " + count;
        if (this.maxRecords !== 0) {if (Number(count) >= Number(this.maxRecords)) {recout = recout + "+"; } }
        cc = this.getElmnt("recordnumberspan");
        if (cc) {cc.innerHTML = recout; }
    };
    this.disableFNPL = function (nav) {
        if (this.getElmnt("db_000_nav_" + nav)) {
            addClass(this.getElmnt("db_000_nav_" + nav), "cmddisabled");
            this.getElmnt("db_000_nav_" + nav).onclick = function () {return false; };
        }
    };
    this.enableFNPL = function (nav) {
        var obj;
        if (this.getElmnt("db_000_nav_" + nav)) {
            removeClass(this.getElmnt("db_000_nav_" + nav), "cmddisabled");
            obj = this;
            this.getElmnt("db_000_nav_" + nav).onclick = function () {obj.fnpl(nav); };
        }
    };
    this.checkSave = function () {
        //HER M� MAN TESTE P� EN NY M�TE OM NOE ER ENDRET
    };
    this.translate = function (txt) {
    	var patt;
    	patt = /APPML_ERR_USN_OR_PWD_REQ/g; txt = txt.replace(patt, "Username or password required");
    	patt = /APPML_ERR_APPNAME_REQ/g; txt = txt.replace(patt, "Appname required");
    	patt = /APPML_ERR_ACTION_REQ/g; txt = txt.replace(patt, "Action required");    	
    	patt = /APPML_ERR_MODEL_REQ/g; txt = txt.replace(patt, "Model required");    	
    	patt = /APPML_ERR_NOT_AUTHORIZED/g; txt = txt.replace(patt, "You are not authorized to perform this action");    	
    	patt = /APPML_ERR_DATASOURCE_REQ/g; txt = txt.replace(patt, "Datasource required");    	
    	patt = /APPML_ERR_KEYFIELD_REQ/g; txt = txt.replace(patt, "Keyfield required");    	
    	patt = /APPML_ERR_MAINTABLE_REQ/g; txt = txt.replace(patt, "Maintable required");    	
    	patt = /APPML_ERR_ILLEGAL_ACTION/g; txt = txt.replace(patt, "Illegal action");    	
    	patt = /APPML_ERR_DATAMODEL/g; txt = txt.replace(patt, "Error in datamodel");    	
    	patt = /APPML_ERR_INPUT_MIN/g; txt = txt.replace(patt, "Minimum value error");    	
    	patt = /APPML_ERR_INPUT_MAX/g; txt = txt.replace(patt, "Maximum value error");    	
    	patt = /APPML_ERR_INPUT_REQ/g; txt = txt.replace(patt, "Required value error");    	
    	patt = /APPML_ERR_ILLEGAL_QUERY/g; txt = txt.replace(patt, "Illegal query error");    	
    	patt = /APPML_ERR_UKNOWN_DB/g; txt = txt.replace(patt, "Unknown database");    	
    	patt = /APPML_ERR_UKNOWN_DB_FIELD/g; txt = txt.replace(patt, "Unknown database field");    	
    	patt = /APPML_ERR_INVALID_KEY/g; txt = txt.replace(patt, "Invalid key");    	
    	patt = /APPML_ERR_ERROR/g; txt = txt.replace(patt, "Error");    	
    	patt = /APPML_MESSAGE_RECORD_UPDATED/g; txt = txt.replace(patt, "Record updated");    	
    	patt = /APPML_MESSAGE_RECORD_DELETED/g; txt = txt.replace(patt, "Record deleted");
    	patt = /APPML_MESSAGE_OF/g; txt = txt.replace(patt, "of");    	
    	return txt;
    };
    this.appmlGetInputParent = function (elmnt) {
        var i = 1, xid, x = elmnt;
        while (i === 1) {
            if (x.id === this.id) {
                i = 0;
                return;
            }
            xid = x.parentNode.id;
            if (xid.substr(0, 9) === "db_input_") {
                i = 0;
                return xid;
            }
            x = x.parentNode;
        }
    };
    this.displayMessage = function (txt) {
        var cc, obj = this;
        if (txt === "") {
            this.getElmnt("message").innerHTML = "";
            this.getElmnt("message").style.display = "none";
        } else {
            this.getElmnt("message").innerHTML = "<div id='appml_message_closebtn' class='appmlclosebtn'>X</div><br>" + txt;
            cc = this.getElmnt("appml_message_closebtn");
            if (cc) {cc.onclick = function () {obj.closeMessage(); }; }
            this.getElmnt("message").style.display = "block";
        }
    };
    this.putRecord = function (param) {
        var xml, i, j, k, l, kx, kn, felmnt, fname, fvalue, apptyp, xmldoc, http, httpText, action = param, formname = "db_input_1", formno = formname.substr(9);
        if (action === "UPDATE") {
            if (this.records[0].keyValues[0] === "") {action = "ADD"; }
        }
        xml = "<?xml version='1.0' encoding='UTF-8' ?>";
        xml = xml + "<update><action>" + action + "</action>";
        xml = xml + "<appname>" + this.appName + "</appname>";
        for (i = 0; i < this.keyFieldCounter; i++) {
            if (action !== "ADD") {xml = xml + "<appmlid>" + makeXml(this.records[formno - 1].keyValues[i]) + "</appmlid>"; }
        }
        if (action !== "DELETE") {
            xml = xml + "<record>";
            l = this.updateFields.length;
            for (i = 0; i < l; i++) {
                felmnt = getElmnt2(this.getElmnt(formname), this.updateFields[i]);
                if (felmnt) {
                    fname = felmnt.id;
                    fvalue = felmnt.value;
                    apptyp = "number";
                    for (j = 0; j < this.itemCounter; j++) {
                        if (this.itemNames[j].toLowerCase() === fname.toLowerCase()) {apptyp = this.itemTypes[j]; }
                    }
                    if (apptyp === "date") {fvalue = reformatDate(fvalue, this.dateFormat); }
                    xml = xml + "<item><name>" + fname + "</name><value>"  + makeXml(fvalue) + "</value><type>"  + apptyp + "</type></item>";
                }
            }
            xml = xml + "</record>";
        }
        xml = xml + "</update>";
//alert(xml);
        http = xmlHttp(this.appSrc, xml, "POST");
        httpText = http.responseText;
        if (http.responseXML) {
            xmldoc = http.responseXML;
            if (xmldoc.getElementsByTagName("error").length > 0) {
                this.displayMessage(this.translate(xmldoc.getElementsByTagName("error")[0].firstChild.nodeValue));
                return false;
            }
        }
        httpText = this.translate(httpText);
        if (httpText === "-1" || httpText.substr(0, 5) === "Error") {
            if (httpText.substr(0, 5) === "Error") {this.displayMessage(httpText); }
            return -1;
        }
        if (action === "ADD") {
            kx = httpText;
            //DETTE BLIR IKKE GJORT SOM DET SKAL:
            for (k = 1; k <= this.appmlKeycounter; k++) {
                kn = kx.indexOf(",");
                if (kn > -1) {
                    this.records[i - 1].keyValues[k] = kx.substr(0, kn);
                    kx = kx.substr(kn + 1);
                } else {
                    this.records[i - 1].keyValues[k] = kx;
                }
            }
            this.displayMessage("1 " + this.translate("APPML_MESS_RECORD_UPDATED"));
        } else {
            this.displayMessage(httpText);
        }
        if (action === "ADD" || action === "DELETE") {
            this.clear();
        }
        if (this.list) {this.list.fnpl("same"); }
    };
    this.deleteRecord = function () {
        var s = confirm("Are yoy sure you want to delete this record?")
        if (s === false) {
            return -1
        }
        this.putRecord("DELETE");
    };
    this.getModel = function () {
        var x, xx, xxx, xml, i, ii, iii, l, ll, lll;
        xml = this.modelXML;
        this.loginUser = getNodeValue(xml.getElementsByTagName("user")[0]);
        this.filterXML = xml.getElementsByTagName("filters")[0];
        if (this.filterXML) {
            this.orderByXML = this.filterXML.getElementsByTagName("order")[0];
            if (this.orderByXML && this.orderByXML !== "") {
                x = this.orderByXML.getElementsByTagName("field")
                l = x.length;
                for (i = 0; i < l; i++) {
                    this.orderBys[i] = getNodeValue(x[i]);
                    this.orderByLabels[i] = getAttributeValue(x[i], "label");
                    if (this.orderByLabels[i] === "") {this.orderByLabels[i] = this.orderBys[i]; }
                    for (ii = 0; ii < this.orderBys.length; ii++) {
                        this.orderByDirections[ii] = "asc";
                        if (this.orderBys[ii].toLowerCase().indexOf(" desc") > -1) {this.orderByDirections[ii] = "desc"; }
                        this.orderBys[ii] = rTrim(this.orderBys[ii].replace(/ desc/i, ""));
                        this.orderBys[ii] = rTrim(this.orderBys[ii].replace(/ asc/i, ""));
                    }
                }
            }
        }
        if (!this.filterXML && !this.orderByXML) {
            this.btnFilter = 0;
        }
        x = xml.getElementsByTagName("update");
        l = x.length;
        this.updateFields.splice(0,this.updateFields.length);
        for (i = 0; i < l; i++) {
            xx = x[i].getElementsByTagName("item");
            ll = xx.length;
            for (ii = 0; ii < ll; ii++) {
                xxx = xx[ii].getElementsByTagName("name");
                lll = xxx.length;
                for (iii = 0; iii < lll; iii++) {
                    this.updateFields.push(getNodeValue(xxx[iii]));
                }
            }
        }
        x = xml.getElementsByTagName("keyfield");
        this.keyFieldCounter = x.length;
        for (i = 0; i < this.keyFieldCounter; i++) {
            this.keyFields[i] = getNodeValue(x[i]);
        }
        x = xml.getElementsByTagName("datamodel");
        l = x.length;
        if (l > 0) {
            this.controlXML = x[0];
            xx = this.controlXML.getElementsByTagName("item");
            ll = xx.length;
            for (i = 0; i < ll; i++) {
                this.controlItem.push(getAttributeValue(xx[i], "name"));
                xxx = xx[i].getElementsByTagName("required");
                lll = xxx.length;
                if (lll > 0) { this.controlFunction.push("required"); }
                xxx = xx[i].getElementsByTagName("min");
                lll = xxx.length;
                if (lll > 0) {
                    this.controlFunction.push("min");
                    this.controlValue.push(getNodeValue(xxx[0]));
                }
            }
        }
    };
    this.displayContainers = function () {
        var divout = "", cc, obj = this;
        if (this.closeBtn === 1) {divout = divout + "<div id='appml_closebtn' class='appmlclosebtn'>X</div>"; }
        divout = divout + "<div id='appmlHTML'>";
        divout = divout + "<div id='appmltreeview'></div>";
        divout = divout + "<div id='appmlDisplayCommands'></div>";
        divout = divout + "<div id='message'></div>";
        divout = divout + "<div id='appmlquery'></div>";
        divout = divout + "<div id='appmlDisplayData'></div>";
        divout = divout + "</div>";
        divout = divout + "<div style='clear:both;'></div>";
        this.container.innerHTML = divout;
        if (this.closeBtn === 1) {
            cc = this.getElmnt("appml_closebtn");
            if (cc) {cc.onclick = function () {obj.closeForm(); }; }
        }
    };
    this.showTemplate = function () {
        this.displayMessage("<textarea style='width:380px;height:300px;'>" + this.template.outerHTML + String.fromCharCode(10) + String.fromCharCode(13) + "</textarea>");
    };
    this.writeCommands = function () {
        var obj = this, divout = "", cc;
        if (this.commands === false) {return false; }
        if (this.btnFirst === 1) {divout = divout + "<button id='db_000_nav_first' type='button' class='appmlcmd cmdfirst'>&laquo;</button>"; }
        if (this.btnPrevious === 1) {divout = divout + "<button id='db_000_nav_previous' type='button' class='appmlcmd cmdprevious'>&lsaquo;</button>"; }
        if (this.recordNumberDisplay === 1) {divout = divout + "<span id='recordnumberspan'></span>"; }
        if (this.btnNext === 1) {divout = divout + "<button id='db_000_nav_next' type='button' class='appmlcmd cmdnext'>&rsaquo;</button>"; }
        if (this.btnLast === 1) {divout = divout + "<button id='db_000_nav_last' type='button' class='appmlcmd cmdlast'>&raquo;</button>"; }
        if (this.btnFilter === 1) {divout = divout + "<button id='db_000_cmd_query' type='button' class='appmlcmd cmdfilter'>Filter </button>"; }
        if (this.btnNew === 1) {divout = divout + "<button id='db_000_cmd_new' type='button' class='appmlcmd cmdnew'>New </button>"; }
        if (this.btnSave === 1) {divout = divout + "<button id='db_000_cmd_save' type='button' class='appmlcmd cmdsubmit'>Save </button>"; }
        if (this.btnDelete === 1) {divout = divout + "<button id='db_000_cmd_delete' type='button' class='appmlcmd cmddelete'>Delete </button>"; }
        if (this.btnReport === 1) {divout = divout + "<button id='db_000_cmd_report' type='button' class='appmlcmd cmdreport'>Report </button>"; }
        if (divout !== "") {divout = divout + "<div style='clear:both;'></div>"; }
        this.getElmnt("appmlDisplayCommands").innerHTML = divout;
        if (this.recordNumberDisplay === 1) {
            cc = this.getElmnt("recordnumberspan");
            if (cc) {cc.ondblclick = function () {obj.showTemplate(); }; }
        }
        if (this.btnNew === 1) {
            cc = this.getElmnt("db_000_cmd_new");
            if (cc) {cc.ondblclick = function () {obj.showTemplate(); }; }
        }
    };
    this.getTemplate = function () {
        var a, b, c, x, z, tbody, header, i, ii, l, ll, cc, ccc, elmntID, elmntValue, row, rep;
        if (this.recCounter === 0) {return false; }
        if (this.modelTemplateElement !== undefined && this.modelTemplateElement !== "") {
            cc = this.modelXML.getElementsByTagName(this.modelTemplateElement);
            if (cc.length > 0) {
                a = document.createElement('div');
                a.innerHTML = cc[0].childNodes[0].nodeValue;
                this.template = a;
            } else {
                this.displayMessage("Could no find template: " + this.modelTemplateElement);
                return false;
            }
        }
        if (this.displayType.toUpperCase() === "LIST" || this.displayType.toUpperCase() === "REPORT") {
            if (this.template === undefined || this.template === "") {
                //TABLE:
                a = document.createElement("table");
                a.setAttribute("id", "appml_list");
                a.setAttribute("class", "appmltable");
                //TBODY:
                tbody = document.createElement("tbody");
                //TR HEADER:
                header = document.createElement("tr");
                for (i = 0; i < this.itemCounter; i++) {
                    b = document.createElement("th");
                    cc = this.itemNames[i];
                    c = document.createTextNode(cc);
                    b.appendChild(c);
                    header.appendChild(b);
                }
                tbody.appendChild(header);
                //TR ROW:
                row = document.createElement("tr");
                row.setAttribute("id", "appml_row");
                for (i = 0; i < this.itemCounter; i++) {
                    b = document.createElement("td");
                    c = document.createTextNode("#" + this.itemNames[i].toLowerCase() + "#");
                    b.appendChild(c);
                    row.appendChild(b);
                }
                tbody.appendChild(row);
                a.appendChild(tbody);
                this.template = a;
            }
        } else if (this.displayType.toUpperCase() === "FORM") {
            if (this.template === undefined || this.template === "") {
                a = document.createElement("div");
                a.setAttribute("id", "appml_form");
                a.setAttribute("class", "appmlform");
                for (i = 0; i < this.itemCounter; i++) {
                    ccc = 1;
                    for (ii = 0; ii < this.keyFields.length; ii++) {
                        if (this.itemNames[i].toLowerCase() === this.keyFields[ii].toLowerCase()) {ccc = 0; }
                    }
                    if (ccc === 1) {
                        b = document.createElement("label");
                        b.setAttribute("for", this.itemNames[i].toLowerCase());
                        cc = this.itemNames[i];
                        c = document.createTextNode(cc + ":");
                        b.appendChild(c);
                        a.appendChild(b);
                        b = document.createElement("input");
                        b.setAttribute("id", this.itemNames[i].toLowerCase());
                        b.setAttribute("value", "#" + this.itemNames[i].toLowerCase() + "#");
                        a.appendChild(b);
                    }
                }
                this.template = a;
            }
        }
        if (this.template === null) {
            this.displayMessage("The template does not exist.");
            return false;
        }
        z = this.template.getElementsByTagName("*");
        for (i = 0; i < z.length; i++) {
            if (getAttributeValue(z[i], "data-appmlapplication") !== "") {
                if (z[i].tagName === "SELECT") {
                    ll = z[i].length;//Empty dropdownbox before filling:
                    for (ii = 0; ii < ll; ii++) {
                        z[i].remove(0);
                    }
                    rep = new AppML();
                    rep.appName = getAttributeValue(z[i], "data-appmlapplication");
                    rep.appSrc = this.appSrc;
                    rep.getData();
                    //Inserting a blank option:
                    a = document.createElement("option");
                    a.setAttribute("value", "");
                    b = document.createTextNode("");
                    a.appendChild(b);
                    z[i].appendChild(a);
                    x = rep.records;
                    ll = x.length;
                    for (ii = 0; ii < ll; ii++) {
                        a = document.createElement("option");
                        a.setAttribute("value", rep.records[ii].itemValues[0]);
                        cc = rep.records[ii].itemValues[1];
                        if (!cc) {cc = rep.records[ii].itemValues[0]; }
                        b = document.createTextNode(cc);
                        a.appendChild(b);
                        z[i].appendChild(a);
                    }
                }
            }
        }
    };
    this.displayHTML = function () {
        var x, y, z, a, aa, l, ll, lll, r, rr, iname, ivalue, replaceFast = -1, row, rowClone, j, i, ii, iii, iiii, cc, obj = this, id;
        if (this.displayType.toUpperCase() === "LIST" || this.displayType.toUpperCase() === "FORM") {this.appmlFixFNPL(this.fromRec, this.toRec, this.totalRecCounter); }
        if (this.recCounter === 0) {this.getElmnt("appmlDisplayData").innerHTML = ""; return false; }
        //this.template.style.display = "none";
        this.html = this.template.cloneNode(true);
        this.html.style.display = "";
        if (this.recCounter === 0) {this.html.style.display = "none"; }
        if (this.displayType.toUpperCase() === "FORM") {
            for (i = 1; i <= this.recCounter; i++) {
                this.html.setAttribute("id", "db_input_" + i);
                if (i === 1 && replaceFast === -1) {replaceFast = checkReplaceInnerHTML(this.html); }
                this.replaceHTML(i-1,this.html,replaceFast);
/*                ll = this.itemNames.length;
                for (ii = 0; ii < ll; ii++) {
                    iname = this.itemNames[ii];
                    ivalue = this.records[i - 1].itemValues[ii];
                    r = new RegExp("#" + iname + "#", "gi");
                    a = this.html.attributes;
                    l = a.length;
                    for (iii = 0; iii < l; iii++) {
                        if (a[iii].value.match(r) !== null) {a[iii].value = a[iii].value.replace(r, ivalue); }
                    }
                    if (replaceFast === 1) {
                        this.html.innerHTML = this.html.innerHTML.replace(r, ivalue);
                    } else {
                        a = this.html.getElementsByTagName("*");
                        l = a.length;
                        for (iii = 0; iii < l; iii++) {
                            if (a[iii].outerHTML.match(r) !== null) {                        
                                if (a[iii].tagName !== "TBODY" && a[iii].tagName !== "TR") {
                                    a[iii].innerHTML = a[iii].innerHTML.replace(r, ivalue);
                                } else {
                                    if (a[iii].hasAttributes()) {
                                        aa = a[iii].attributes;
                                        lll = aa.length;
                                        for (iiii = 0; iiii < lll; iiii++) {
                                            if (aa[iiii].value.match(r) !== null) {aa[iiii].value = aa[iiii].value.replace(r, ivalue); }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }*/
                for (j = 0; j < 3; j++) {
                    if (j === 0) {a = this.html.getElementsByTagName("select"); }
                    if (j === 1) {a = this.html.getElementsByTagName("input"); }
                    if (j === 2) {a = this.html.getElementsByTagName("textarea"); }
                    l = a.length;
                    for (ii = 0; ii < l; ii++) {
                        cc = a[ii].id.toLowerCase();
                        ll = this.itemNames.length;
                        for (iii = 0; iii < ll; iii++) {
                            if (cc === this.itemNames[iii].toLowerCase()) {a[ii].value = this.records[i - 1].itemValues[iii]; }
                        }
                    }
                }
            }
        } else {
            this.html.setAttribute("id", "appml_list_real");//HUSK: Denne settes til "real" slik at man ikke f�r to DIVs med id=appml_list, hvor den ene er templaten, og den andre er den man ser.
            this.htmlRow = getElmnt2(this.html, "appml_row");
            if (this.htmlRow) {
                x = document.createElement("htmlrow");
                row = x.cloneNode(true);
                for (i = 1; i <= this.recCounter; i++) {
                    rowClone = this.htmlRow.cloneNode(true);
                    rowClone.setAttribute("id", "db_input_" + i);
                    if (i === 1 && replaceFast === -1) {replaceFast = checkReplaceInnerHTML(rowClone); }
                    this.replaceHTML(i-1,rowClone,replaceFast);
/*                    ll = this.itemNames.length;
                    for (ii = 0; ii < ll; ii++) {
                        iname = this.itemNames[ii];
                        ivalue = this.records[i - 1].itemValues[ii];
                        r = new RegExp("#" + iname + "#", "gi");
                        a = rowClone.attributes;
                        l = a.length;
                        for (iii = 0; iii < l; iii++) {
                            if (a[iii].value.match(r) !== null) {a[iii].value = a[iii].value.replace(r, ivalue); }
                        }
                        if (replaceFast === 1) {
                            rowClone.innerHTML = rowClone.innerHTML.replace(r, ivalue);
                        } else {
                            a = rowClone.getElementsByTagName("*");
                            l = a.length;
                            for (iii = 0; iii < l; iii++) {
                                if (a[iii].outerHTML.match(r)) {                                
                                    if (a[iii].tagName !== "TBODY" && a[iii].tagName !== "TR") {
                                        if (a[iii].innerHTML.match(r) !== null) {a[iii].innerHTML = a[iii].innerHTML.replace(r, ivalue); }
                                    } else {
                                        if (a[iii].hasAttributes()) {
                                            aa = a[iii].attributes;
                                            lll = aa.length;
                                            for (iiii = 0; iiii < lll; iiii++) {
                                                if (aa[iiii].value.match(r) !== null) {aa[iiii].value = aa[iiii].value.replace(r, ivalue); }
                                            }
                                        }
                                    }
                                }
                            }
                            a = rowClone.childNodes;
                            l = a.length
                            for (iii = 0; iii < l; iii++) {
                                if (a[iii].hasAttributes()) {
                                    aa = a[iii].attributes;
                                    lll = aa.length;
                                    for (iiii = 0; iiii < lll; iiii++) {
                                        if (aa[iiii].value.match(r) !== null) {aa[iiii].value = aa[iiii].value.replace(r, ivalue); }
                                    }
                                }
                            }
                        }
                    }*/
                    for (j = 0; j < 3; j++) {
                        if (j === 0) {a = rowClone.getElementsByTagName("select"); }
                        if (j === 1) {a = rowClone.getElementsByTagName("input"); }
                        if (j === 2) {a = rowClone.getElementsByTagName("textarea"); }
                        l = a.length;
                        for (ii = 0; ii < l; ii++) {
                            cc = a[ii].id.toLowerCase();
                            ll = this.itemNames.length;
                            for (iii = 0; iii < ll; iii++) {
                                if (cc === this.itemNames[iii].toLowerCase()) {a[ii].value = this.records[i - 1].itemValues[iii]; }
                            }
                        }
                    }
                    z = rowClone.cloneNode(true);
                    if (i === this.recCounter) {
                        this.htmlRow.parentNode.replaceChild(rowClone, this.htmlRow);
                    } else {
                        this.htmlRow.parentNode.insertBefore(rowClone, this.htmlRow);
                    }
                    row.appendChild(z);
                }
            }
            replaceFast = checkReplaceInnerHTML(this.html);
            this.replaceHTML(0,this.html,replaceFast);
/*            ll = this.itemNames.length;
            for (ii = 0; ii < ll; ii++) {
                iname = this.itemNames[ii];
                ivalue = this.records[0].itemValues[ii];
                r = new RegExp("#" + iname + "#", "gi");
                a = this.html.attributes;
                l = a.length;
                for (iii = 0; iii < l; iii++) {
                    if (a[iii].value.match(r) !== null) {a[iii].value = a[iii].value.replace(r, ivalue); }
                }
                if (replaceFast === 1) {
                    this.html.innerHTML = this.html.innerHTML.replace(r, ivalue);
                } else {
                    a = this.html.getElementsByTagName("*");
                    l = a.length;
                    for (iii = 0; iii < l; iii++) {
                        if (a[iii].outerHTML.match(r) !== null) {                        
                            if (a[iii].tagName !== "TBODY" && a[iii].tagName !== "TR") {
                                a[iii].innerHTML = a[iii].innerHTML.replace(r, ivalue);
                            } else {
                                if (a[iii].hasAttributes()) {
                                    aa = a[iii].attributes;
                                    lll = aa.length;
                                    for (iiii = 0; iiii < lll; iiii++) {
                                        if (aa[iiii].value.match(r) !== null) {aa[iiii].value = aa[iiii].value.replace(r, ivalue); }
                                    }
                                }
                            }
                        }
                    }
                }
            }*/
        }
        if (this.getElmnt("appmlDisplayData")) {
            this.getElmnt("appmlDisplayData").innerHTML = "";
            this.getElmnt("appmlDisplayData").appendChild(this.html);
        }
    };
    this.replaceHTML = function (n,a,replaceFast) {
        var ll,ii,iname,ivalue,r,l,iii,b,bb,lll,j;
        ll = this.itemNames.length;
        for (ii = 0; ii < ll; ii++) {
            iname = this.itemNames[ii];
            ivalue = this.records[n].itemValues[ii];
            r = new RegExp("#" + iname + "#", "gi");
            l = a.length;
            for (iii = 0; iii < l; iii++) {
                if (a[iii].value.match(r) !== null) {a[iii].value = a[iii].value.replace(r, ivalue); }
            }
            if (replaceFast === 1) {
                a.innerHTML = a.innerHTML.replace(r, ivalue);
            } else {
                b = a.getElementsByTagName("*");
                l = b.length;
                for (iii = 0; iii < l; iii++) {
                    if (b[iii].outerHTML.match(r) !== null) {
                        if (b[iii].tagName !== "TBODY" && b[iii].tagName !== "TR") {
                            if (b[iii].innerHTML.match(r) !== null) {b[iii].innerHTML = b[iii].innerHTML.replace(r, ivalue); }
                        } else {
                            if (b[iii].hasAttributes()) {
                                bb = b[iii].attributes;
                                lll = bb.length;
                                for (iiii = 0; iiii < lll; iiii++) {
                                    if (bb[iiii].value.match(r) !== null) {bb[iiii].value = bb[iiii].value.replace(r, ivalue); }
                                }
                            }
                        }
                    }
                }
                b = a.childNodes;
                l = b.length;
                for (iii = 0; iii < l; iii++) {
                    if (b[iii].hasAttributes()) {
                        bb = b[iii].attributes;
                        lll = bb.length;
                        for (iiii = 0; iiii < lll; iiii++) {
                            if (bb[iiii].value.match(r) !== null) {bb[iiii].value = bb[iiii].value.replace(r, ivalue); }
                        }
                    }
                }
            }
        }
    };
    this.setCommandEvents = function () {
        if (this.commands === false) {return false; }
        var cc, obj = this;
        cc = this.getElmnt("db_000_cmd_query");
        if (cc) {cc.onclick = function () {obj.appmlQuery(); }; }
        cc = this.getElmnt("db_000_cmd_new");
        if (cc) {cc.onclick = function () {obj.appmlNew(); }; }
//        if (cc) {cc.onclick = obj.clickNew; }
        cc = this.getElmnt("db_000_cmd_save");
        if (cc) {cc.onclick = function () {obj.putRecord("UPDATE"); }; }
        cc = this.getElmnt("db_000_cmd_delete");
        if (cc) {cc.onclick = function () {obj.deleteRecord(); }; }
        cc = this.getElmnt("db_000_cmd_report");
//        if (cc) {cc.onclick = function () {obj.openReport(); }; }
        if (cc) {cc.onclick = obj.clickReport; }
    };
    this.expandElement = function (id, n) {
/*        if (window.jQuery) {
            if (n === 2) {
                $("#" + obj.id + " #" + id).fadeIn(300);
            } else {
                $("#" + obj.id + " #" + id).slideDown(300);
            }
        } else {
    */  this.getElmnt(id).style.display = "block";
//        }
    };
    this.appmlNew = function () {
		this.run("Form01","","NULL");
    };
    this.appmlQuery = function () {
        var rep, obj = this, queryElmnt, a, b, c, d, e, f, g, s, cc, saveOK, z, y, x, xx, l, ll, lll, j, i, ii, iii, qhidden, operFrom, operTo, orderOK = 1, qsqlAppname = "", qlabel = "", qfname = "", qvalue = "", qoper = 0, qtype = "", oper = [], odir = [], ocount = 0;
        if (this.rowsPerPage === "" && this.displayType.toUpperCase() !== "REPORT") {return false; }
        saveOK = this.checkSave();
        if (saveOK !== 2) {
            queryElmnt = this.getElmnt("appmlquery");
            queryElmnt.innerHTML = "";
            a = document.createElement("div");
            a.setAttribute("id", "queryCloseBtn");
            a.setAttribute("class", "appmlclosebtn");
            b = document.createTextNode("X");
            a.appendChild(b);
            queryElmnt.appendChild(a);
            a = document.createElement("div");
            a.setAttribute("class", "appmlqueryheader");
            b = document.createElement("div");
            b.setAttribute("class", "appmlquerytabcmd");
            c = document.createTextNode("Filter");
            b.appendChild(c);
            a.appendChild(b);
            b = document.createElement("div");
            b.setAttribute("id", "appmlquerycmdDIV");
            c = document.createElement("button");
            c.setAttribute("id", "queryResetBtn");
            c.setAttribute("title", "Reset Queryform");
            c.setAttribute("type", "button");
            c.setAttribute("class", "appmlquerycmd querycmdreset");
            c.setAttribute("name", "reset");
            d = document.createTextNode("Reset ");
            c.appendChild(d);
            b.appendChild(c);
            c = document.createElement("button");
            c.setAttribute("id", "runQueryBtn");
            c.setAttribute("title", "Run Query");
            c.setAttribute("type", "button");
            c.setAttribute("class", "appmlquerycmd querycmdok");
            c.setAttribute("name", "sendquery");
            d = document.createTextNode("OK ");
            c.appendChild(d);
            b.appendChild(c);
            a.appendChild(b);
            b = document.createElement("div");
            b.setAttribute("style", "clear:both");
            a.appendChild(b);
            queryElmnt.appendChild(a);
            a = document.createElement("div");
            a.setAttribute("class", "appmlquerytab");
            a.setAttribute("id", "tab_1");
            a.setAttribute("name", "S�k");
            b = document.createElement("table");
            b.setAttribute("style", "width:500px");
            b.setAttribute("border", "0");
            l = 0;
            if (this.filterXML) {
                z = this.filterXML.getElementsByTagName("query");
                for (i = 0; i < z.length; i++) {
                    x = z[i].getElementsByTagName("field");
                    l = x.length;
                }
            }
            for (i = 0; i < l; i++) {
                s = "";
                qlabel = "";
                qfname = "";
                qvalue = "";
                qsqlAppname = "";
                qhidden = getAttributeValue(x[i], "hidden");
                if (qhidden.toLowerCase() === "true") {continue; }
                qoper = 0;
                qtype = getAttributeValue(x[i], "type");
                qfname = getNodeValue(x[i]);
                qvalue = getAttributeValue(x[i], "value");
                qlabel = getAttributeValue(x[i], "label");
                qsqlAppname = getAttributeValue(x[i], "application");
                ll = this.queryFields.length;
                for (ii = 0; ii < ll; ii++) {
                    if (qfname === this.queryFields[ii]) {
                        qvalue = "";
                        qvalue = qvalue + this.queryDisplayValues[ii];
                        qoper = this.queryDisplayOperators[ii];
                    }
                }
                if (qlabel === "") {qlabel = qfname; }
                c = document.createElement("tr");
                d = document.createElement("td");
                d.setAttribute("style", "width:150px");
                e = document.createTextNode(qlabel);
                d.appendChild(e);
                c.appendChild(d);
                d = document.createElement("td");
                d.setAttribute("nowrap", "nowrap");
                e = document.createElement("select");
                e.setAttribute("name", "operator" + qfname);
                e.setAttribute("id", "operator" + qfname);
                oper[0] = "=";
                oper[1] = "<>";
                oper[2] = "<";
                oper[3] = ">";
                oper[4] = "<=";
                oper[5] = ">=";
                oper[6] = "%";
                oper[10] = "=";
                oper[11] = "<>";
                operFrom = 0;
                operTo = 6;
                if (qsqlAppname !== "") {operFrom = 10; operTo = 11; }
                for (ii = operFrom; ii <= operTo; ii++) {
                    f = document.createElement("option");
                    f.setAttribute("value", ii);
                    if (qoper === ii) {f.setAttribute("selected", "selected"); }
                    g = document.createTextNode(oper[ii]);
                    f.appendChild(g);
                    e.appendChild(f);
                }
                d.appendChild(e);
                c.appendChild(d);
                d = document.createElement("td");
                d.setAttribute("nowrap", "nowrap");
                e = document.createElement("input");
                e.setAttribute("id", "datatype" + qfname);
                e.setAttribute("name", "datatype" + qfname);
                e.setAttribute("type", "hidden");
                e.setAttribute("value", qtype);
                d.appendChild(e);
                if (qsqlAppname !== "") {
                    rep = new AppML();
                    rep.appName = qsqlAppname;
                    rep.appSrc = this.appSrc;
                    rep.getData();
                    xx = rep.records;
                    ll = xx.length;
                    for (ii = 0; ii < ll; ii++) {
                        if (ii === 0) {
                            e = document.createElement("select");
                            e.setAttribute("id", qfname);
                            e.setAttribute("style", "width:290px");
                            e.setAttribute("name", "app" + qfname);
                            f = document.createElement("option");
                            f.setAttribute("value", "");
                            e.appendChild(f);
                        }
                        f = document.createElement("option");
                        f.setAttribute("value", rep.records[ii].itemValues[0]);
                        if (rep.records[ii].itemValues[0] === qvalue) {f.setAttribute("selected", "selected"); }
                        if (rep.records[ii].itemValues.length === 1) {
                            cc=rep.records[ii].itemValues[0];
                        } else {
                            cc=rep.records[ii].itemValues[1];
                        }
                        g = document.createTextNode(cc);
                        f.appendChild(g);
                        e.appendChild(f);
                    }
                } else {
                    e = document.createElement("input");
                    e.setAttribute("id", qfname);
                    e.setAttribute("style", "width:290px");
                    e.setAttribute("name", "app" + qfname);
                    e.setAttribute("value", qvalue);
                }
                d.appendChild(e);
                c.appendChild(d);
                b.appendChild(c);
            }
            a.appendChild(b);
            if (this.orderByXML) {
                b = document.createElement("div");
                b.setAttribute("class", "appmlquerytabcmd");
                b.setAttribute("style", "padding-left:5px;margin-top:10px;margin-bottom:5px;border:none");
                c = document.createTextNode("Order By");
                b.appendChild(c);
                a.appendChild(b);
                b = document.createElement("table");
                b.setAttribute("style", "width:500px");
                b.setAttribute("border", "0");
                x = this.orderBys;
                l = x.length;
                if (l > 0) {
                    c = document.createElement("tr");
                    d = document.createElement("td");
                    e = document.createElement("select");
                    e.setAttribute("style", "width:290px");
                    e.setAttribute("id", "sel");
                    e.setAttribute("name", "orderselect0");
                    odir = "asc";
                    y = [];
                    for (i = 0; i < l; i++) {
                        orderOK = 1;
                        ll = y.length;
                        for (j = 0; j < ll; j++) {
                            if (x[i] === y[j]) {
                                orderOK = 0;
                                break;
                            }
                        }
                        if (orderOK === 1) {
                            y.push(x[i]);
                            ocount = 0;
                            f = document.createElement("option");
                            f.setAttribute("value", x[i]);
                            if (i === 0) {
                                f.setAttribute("selected", "selected");
                                odir = this.orderByDirections[i];
                                if (odir === "") {odir = "asc"; }
                            }
                            g = document.createTextNode(this.orderByLabels[i]);
                            f.appendChild(g);
                            e.appendChild(f);
                        }
                    }
                    d.appendChild(e);
                    c.appendChild(d);
                    d = document.createElement("td");
                    e = document.createTextNode("ASC");
                    d.appendChild(e);
                    e = document.createElement("input");
                    e.setAttribute("type", "radio");
                    e.setAttribute("name", "orderdirection0");
                    e.setAttribute("value", "asc");
                    if (odir === "asc") {e.setAttribute("checked", "checked"); }
                    d.appendChild(e);
                    e = document.createTextNode("DESC");
                    d.appendChild(e);
                    e = document.createElement("input");
                    e.setAttribute("type", "radio");
                    e.setAttribute("name", "orderdirection0");
                    e.setAttribute("value", "desc");
                    if (odir === "desc") {e.setAttribute("checked", "checked"); }
                    d.appendChild(e);
                    c.appendChild(d);
                }
                b.appendChild(c);
                a.appendChild(b);
            }
            queryElmnt.appendChild(a);
            this.expandElement("appmlquery");
            cc = this.getElmnt("runQueryBtn");
            if (cc) {cc.onclick = function () {obj.makeQuery(); }; }
            cc = this.getElmnt("queryCloseBtn");
            if (cc) {cc.onclick = function () {obj.closeExpandElement("appmlquery"); }; }
            cc = this.getElmnt("queryResetBtn");
            if (cc) {cc.onclick = function () {obj.resetQuery(); }; }
            cc = this.getElmnt("cmd_tab_1");
            if (cc) {
                cc.onclick = function () {
                    obj.getElmnt("tab_2").style.display = "none";
                    obj.getElmnt("tab_1").style.display = "block";
                };
            }
            cc = this.getElmnt("cmd_tab_2");
            if (cc) {
                cc.onclick = function () {
                    obj.getElmnt("tab_1").style.display = "none";
                    obj.getElmnt("tab_2").style.display = "block";
                };
            }
        }
    };
    this.cancelQuery = function () {
        this.closeExpandElement("appmlquery");
    };
    this.closeExpandElement = function (id, n) {
/*        if (window.jQuery) {
            if (n === 2) {
                $("#" + obj.id + " #" + id).fadeOut(300);
            } else {
                $("#" + obj.id + " #" + id).slideUp(300);
            }
        } else {
*/      this.getElmnt(id).style.display = "none";
//        }
    };
    this.makeQuery = function () {
        var x, xx, l, ll, i, ii, xml = "", fname, fvalue = "", foper = "=", ftype = "", ocount, ofname = [], oflabel = [], odir = [], odirvalue, qcount = -1, fromDate, toDate, dateOK, displayvalue;
        for (i = 0; i < this.queryFields.length; i++) {
            this.queryFields.pop();
        }
        x = this.getElmnt("tab_1").getElementsByTagName("*");
        l = x.length;
        for (i = 0; i < l; i++) {
            if (x[i].name) {
                if (x[i].name.substr(0, 3) === "app") {
                    fname = x[i].name.substr(3);
                    fvalue = x[i].value;
                    foper = Number(this.getElmnt("operator" + fname).value);
                    ftype = this.getElmnt("datatype" + fname).value.toLowerCase();
                    if (fvalue.length > 0) {
                        qcount++;
                        this.queryFields[qcount] = fname;
                        this.queryValues[qcount] = [];
                        displayvalue = fvalue;
                        if (ftype === "number") {
                            if (!Number(fvalue)) {
                                window.alert("Illegal Number");
                                fvalue = "2...1";
                            }
                        }
                        if (ftype === "date") {
                            fromDate = "";
                            toDate = "";
                            dateOK = 0;
                            try {
                                if (fvalue.length === 10 || fvalue.length === 9 || fvalue.length === 8) {
                                    fromDate = new Date(reformatDate(fvalue, this.dateFormat));
                                    dateOK = 1;
                                }
                                if (fvalue.length === 7 || fvalue.length === 6) {
                                    fromDate = new Date(reformatDate("01/" + fvalue, this.dateFormat));
                                    toDate = new Date(fromDate);
                                    toDate.setMonth(fromDate.getMonth() + 1);
                                    toDate.setDate(0);
                                    dateOK = 1;
                                }
                                if (fvalue.length === 4) {
                                    fromDate = new Date(fvalue + "/01/01");
                                    toDate = new Date(fvalue + "/12/31");
                                    dateOK = 1;
                                }
                            } catch (er) {
                                dateOK = 0;
                            }
                            if (dateOK === 1) {
                                dateOK = 0;
                                if (isDate(fromDate)) {dateOK = 1; }
                                if (dateOK === 1 && toDate !== "") {
                                    if (isDate(toDate)) {dateOK = 1; }
                                }
                            }
                            if (dateOK === 0) {
                                window.alert("Illegal Date");
                                fromDate = new Date("2012/01/01");
                                toDate = new Date("2011/12/31");// does not return any result
                            }
                            fvalue = "#" + fromDate.getFullYear() + "/" + (fromDate.getMonth() + 1) + "/" + fromDate.getDate() + "#";
                            if (toDate !== "") {
                                fvalue = fvalue + "...#" + toDate.getFullYear() + "/" + (toDate.getMonth() + 1) + "/" + toDate.getDate() + "#";
                            }
                        }
                        if (fvalue.indexOf("...") > -1) {
                            this.queryValues[qcount][0] = fvalue.split("...")[0];
                            this.queryOperators[qcount] = 5;
                            qcount++;
                            this.queryFields[qcount] = fname;
                            this.queryValues[qcount] = [];
                            this.queryValues[qcount][0] = fvalue.split("...")[1];
                            this.queryOperators[qcount] = 4;
                        } else {
                            this.queryValues[qcount] = fvalue.split("|");
                            this.queryOperators[qcount] = foper;
                        }
                        this.queryDisplayValues[qcount] = displayvalue;
                        this.queryDisplayOperators[qcount] = foper;
                    }
                }
            }
        }
        x = this.getElmnt("tab_1").getElementsByTagName("*");
        l = x.length;
        ocount = 0;
        for (i = 0; i < l; i++) {
            if (x[i].name && x[i].name.substr(0, 11) === "orderselect") {
                ocount++;
                ofname[ocount] = x[i].value;
                ll = this.orderBys.length;
                for (ii = 0; ii < ll; ii++) {
                	if (ofname[ocount] === this.orderBys[ii]) {
                		oflabel[ocount] = this.orderByLabels[ii];
                	}
                }
                xx = this.getElmnt("tab_1").getElementsByTagName("input");
                ll = xx.length;
                for (ii = 0; ii < ll; ii++) {
                    if (xx[ii].name === "orderdirection" + (ocount - 1)) {
                        odirvalue = "asc";
                        if (xx[ii].checked === true) {odirvalue = xx[ii].value; }
                        odir[ocount] = odirvalue;
                    }
                }
            }
        }
        xml = "";
        for (i = 1; i <= ocount; i++) {
            this.orderBys.splice(0, 0, ofname[i]);
            this.orderByDirections.splice(0, 0, odir[i]);
            this.orderByLabels.splice(0, 0, oflabel[i]);            
        }
        this.fnpl();
        this.cancelQuery();
    };
    this.resetQuery = function () {
        var i, l, x = this.getElmnt("appmlquery").getElementsByTagName("INPUT");
        l = x.length;
        for (i = 0; i < l; i++) {
            if (x[i].name.substr(0, 3) === "app") {
                if (x[i].getAttribute("reset") !== "no") {x[i].value = ""; }
            }
        }
        x = this.getElmnt("appmlquery").getElementsByTagName("SELECT");
        l = x.length;
        for (i = 0; i < l; i++) {
            if (x[i].name.substr(0, 3) === "app") {
                if (x[i].getAttribute("reset") !== "no") {x[i].value = ""; }
            }
        }
    };
    this.openReport = function () {
        window.open("appml.htm?appname=" + this.appName + "&displaytype=report&r=" + Math.random());
    };
    this.clear = function () {
        this.container.style.display = "none";
    };
    this.setQuery = function (field, value, type) {
        var l = this.queryFields.length;
        if (!l) {l = -1; }
        l++;
        this.queryFields[l] = field;
        if (!type) {type = "text"; }
        this.queryTypes[l] = "number";
        this.queryValues[l] = [];
        if (typeof value === "object") {
            this.queryValues[l] = value;
        } else {
            this.queryValues[l][0] = value;
        }
        this.queryDisplayValues[l] = value;
        this.queryOperators[l] = 0;
        this.queryDisplayOperators[l] = 0;
    };
    this.clearQuery = function () {
        this.queryFields = [];
        this.queryValues = [];
        this.queryDisplayValues = [];
        this.queryTypes = [];
        this.queryOperators = [];
        this.queryDisplayOperators = [];
    };
    this.adoptQuery = function (adoptObj) {
        this.queryFields = adoptObj.queryFields;
        this.queryValues = adoptObj.queryValues;
        this.queryDisplayValues = adoptObj.queryDisplayValues;
        this.queryTypes = adoptObj.queryTypes;
        this.queryOperators = adoptObj.queryOperators;
        this.queryDisplayOperators = adoptObj.queryDisplayOperators;
        this.orderBys = adoptObj.orderBys;
        this.orderByDirections = adoptObj.orderByDirections;
        this.orderByLabels = adoptObj.orderByLabels;
    };
    this.query = function (field, value, type) {
        this.setQuery(field, value, type);
        this.run();
    };
    this.setOrder = function (field, direction) {
        var dir = "asc";
        if (!direction || direction === "") {
            if (this.orderBys[0] === field) {
                if (this.orderByDirections[0] === "asc") {dir = "desc"; }
            }
        }
        this.orderBys.splice(0, 0, field);
        this.orderByDirections.splice(0, 0, dir);
    };
    this.order = function (field, direction) {
        this.setOrder(field, direction);
        this.fnpl();
    };
    this.login = function (cbf) {
        var txt = "", cc, obj, x;
        txt = txt + "<div style='background-color: rgba(0, 0, 0, 0.6);height:100%;width:100%;position:absolute;top:0px;left:0px;font-family:verdana;'><div style='background-color:#f1f1f1;border:1px solid #d4d4d4;width:500px;min-width:50%;text-align:center;margin:auto;margin-top:100px;border-top-right-radius:10px;'>";
        txt = txt + "<div id='appml_login_closebtn' class='appmlclosebtn'>X</div>";
        txt = txt + "<table style='margin:auto;margin-top:40px;margin-bottom:40px;width:100%'>";
        txt = txt + "<tr><td style='text-align:right;width:30%;'>E-Mail: </td><td style='text-align:left;'><input type='text' id='uname' style='width:80%;'></td></tr>";
        txt = txt + "<tr><td style='text-align:right;'>Password: </td><td style='text-align:left;'><input type='password' id='pwd' style='width:80%;'></td></tr>";
        txt = txt + "</table>";
        txt = txt + "<button style='margin-bottom:40px;' type='button' id='appmlLoginSubmit'>Submit</button>";
        txt = txt + "</div></div>";
        this.loginElement = document.createElement("DIV");
        if (this.loginElement) {this.loginElement.innerHTML = txt; }
        document.body.appendChild(this.loginElement);
        cc = getElmnt2(this.loginElement, "appmlLoginSubmit");
        obj = this;
        if (cc) {
            cc.onclick = function () {
                var z, y;
                z = document.getElementById("uname").value;
                y = document.getElementById("pwd").value;
                obj.submitLogin(z, y, cbf);
            };
        }
        cc = getElmnt2(this.loginElement, "appml_login_closebtn");
        x = this.loginElement;
        if (cc && x) {cc.onclick = function () {x.innerHTML = ""; }; }
    };
    this.submitLogin = function (x, y, cb) {
        var xmlhttp, xml = "", xmldoc;
        xml = xml + "<appml><login><f1>" + x + "</f1><f2>" + y + "</f2></login></appml>";
        xmlhttp = xmlHttp(this.appSrc + "?r=" + Math.random(), xml, "POST", false);
        if (xmlhttp.responseText.substr(0,2) !== "OK") {
            xmldoc = xmlhttp.responseXML;
            if (xmldoc.getElementsByTagName("error").length > 0) {
                window.alert(this.translate(xmldoc.getElementsByTagName("error")[0].firstChild.nodeValue));
            } else {
            window.alert(this.translate(xmlhttp.responseText));
            }
        } else {
            this.loginElement.innerHTML = "";
            this.loginUser = xmlhttp.responseText.substr(2);
        }
        if (cb) {if (typeof(cb) === "function") {cb(); } }
    };
    this.getQueryStrings = function () {
        var key, i, assoc = {}, decode = function (s) {return decodeURIComponent(s.replace(/\+/g, " ")); }, queryString = location.search.substring(1), keyValues = queryString.split('&');
        for (i = 0; i < keyValues.length; i++) {
            key = keyValues[i].split('=');
            if (key.length > 1) {
                assoc[decode(key[0])] = decode(key[1]);
            }
        }
        return assoc;
    };
    this.closeForm = function () {
        this.clear();
    };
    this.closeMessage = function () {
        this.displayMessage("");
    };
}