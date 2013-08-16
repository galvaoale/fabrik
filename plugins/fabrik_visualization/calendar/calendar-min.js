var fabrikCalendar=new Class({Implements:[Options],options:{days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortDays:["Sun","Mon","Tues","Wed","Thur","Fri","Sat"],months:["January","Feburary","March","April","May","June","July","August","September","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"],viewType:"month",calendarId:1,tmpl:"default",Itemid:0,colors:{bg:"#F7F7F7",highlight:"#FFFFDF",headingBg:"#C3D9FF",today:"#dddddd",headingColor:"#135CAE",entryColor:"#eeffff"},eventLists:[],listid:0,popwiny:0,urlfilters:[],url:{add:"index.php?option=com_fabrik&controller=visualization.calendar&view=visualization&task=getEvents&format=raw",del:"index.php?option=com_fabrik&controller=visualization.calendar&view=visualization&task=deleteEvent&format=raw"},monthday:{width:90,height:80},restFilterStart:"na",j3:false},initialize:function(a){this.firstRun=true;this.el=document.id(a);this.SECOND=1000;this.MINUTE=this.SECOND*60;this.HOUR=this.MINUTE*60;this.DAY=this.HOUR*24;this.WEEK=this.DAY*7;this.date=new Date();this.selectedDate=new Date();this.entries=$H();this.droppables={month:[],week:[],day:[]};this.fx={};this.ajax={};if(typeOf(this.el.getElement(".calendar-message"))!=="null"){this.fx.showMsg=new Fx.Morph(this.el.getElement(".calendar-message"),{duration:700});this.fx.showMsg.set({opacity:0})}this.colwidth={};this.windowopts={id:"addeventwin",title:"add/edit event",loadMethod:"xhr",minimizable:false,evalScripts:true,width:380,height:320,onContentLoaded:function(b){b.fitToContent()}.bind(this)};Fabrik.addEvent("fabrik.form.submitted",function(c,b){this.ajax.updateEvents.send();Fabrik.Windows.addeventwin.close()}.bind(this))},removeFormEvents:function(a){this.entries.each(function(c,b){if(typeof(c)!=="undefined"&&c.formid===a){this.entries.dispose(b)}}.bind(this))},_makeEventRelDiv:function(o,a,e,k){var n,f;var m=o.label;a.left===a.left?a.left:0;a["margin-left"]===a["margin-left"]?a["margin-left"]:0;var g=(o.colour!=="")?o.colour:this.options.colors.entryColor;if(a.startMin===0){a.startMin=a.startMin+"0"}if(a.endMin===0){a.endMin=a.endMin+"0"}var p=a.view?a.view:"dayView";var b={"background-color":this._getColor(g,e),width:a.width,cursor:"pointer","margin-left":a["margin-left"],top:a.top.toInt()+"px",position:"absolute",border:"1px solid #666666","border-right":"0","border-left":"0",overflow:"auto",opacity:0.6};if(a.height){b.height=a.height.toInt()+"px"}if(a.left){b.left=a.left.toInt()+1+"px"}b["max-width"]=a["max-width"]?a["max-width"]-10+"px":"";var c="fabrikEvent_"+o._listid+"_"+o.id;if(k){c+=k.className.replace(" ","")}if(a.view==="monthView"){b.width-=1}if(this.options.j3){var l="";if(o._canDelete){l+=this.options.buttons.del}if(o._canEdit){l+=this.options.buttons.edit}if(o._canView){l+=this.options.buttons.view}var h="Start: "+new Date(o.startdate).format("%X")+"<br /> End :"+o.enddate.format("%X");if(l!==""){l+='<hr /><div class="btn-group" style="text-align:center">'+l+"</div>"}f=new Element("a",{"class":"fabrikEvent label",id:c,styles:b,rel:"popover","data-original-title":m+'<button class="close" data-popover="'+c+'">&times;</button>',"data-content":h,"data-placement":"top","data-html":"true","data-trigger":"click"});if(typeof(jQuery)!=="undefined"){jQuery(f).popover()}}else{f=new Element("div",{"class":"fabrikEvent label",id:c,styles:b});f.addEvent("mouseenter",function(q){this.doPopupEvent(q,o,m)}.bind(this))}if(o.link!==""&&this.options.readonly===false&&this.options.j3===false){n=new Element("a",{href:o.link,"class":"fabrikEditEvent",events:{click:function(r){Fabrik.fireEvent("fabrik.viz.calendar.event",[r]);if(!o.custom){r.stop();var s={};var q=r.target.getParent(".fabrikEvent").id.replace("fabrikEvent_","").split("_");s.rowid=q[1];s.listid=q[0];this.addEvForm(s)}}.bind(this)}}).appendText(m)}else{if(o.custom){m=m===""?"click":m;n=new Element("a",{href:o.link,events:{click:function(q){Fabrik.fireEvent("fabrik.viz.calendar.event",[q])}}}).appendText(m)}else{n=new Element("span").appendText(m)}}f.adopt(n);return f},doPopupEvent:function(h,f,b){var k;var g=this.activeHoverEvent;if(!this.popWin){return}this.activeHoverEvent=h.target.hasClass("fabrikEvent")?h.target:h.target.getParent(".fabrikEvent");if(!f._canDelete){this.popWin.getElement(".popupDelete").hide()}else{this.popWin.getElement(".popupDelete").show()}if(!f._canEdit){this.popWin.getElement(".popupEdit").hide();this.popWin.getElement(".popupView").show()}else{this.popWin.getElement(".popupEdit").show();this.popWin.getElement(".popupView").hide()}if(this.activeHoverEvent){k=this.activeHoverEvent.getCoordinates()}else{k={top:0,left:0}}var a=this.popup.getElement("div[class=popLabel]");a.empty();a.set("text",b);this.activeDay=h.target.getParent();var c=k.top-this.popWin.getSize().y;var l={opacity:[0,1],top:[k.top+50,k.top-10]};this.inFadeOut=false;this.popWin.setStyles({left:k.left+20,top:k.top});this.fx.showEventActions.cancel().set({opacity:0}).start.delay(500,this.fx.showEventActions,l)},_getFirstDayInMonthCalendar:function(e){var b=new Date();b.setTime(e.valueOf());if(e.getDay()!==this.options.first_week_day){var c=e.getDay()-this.options.first_week_day;if(c<0){c=7+c}e.setTime(e.valueOf()-(c*24*60*60*1000))}if(b.getMonth()===e.getMonth()){var a=7*24*60*60*1000;while(e.getDate()>1){e.setTime(e.valueOf()-this.DAY)}}return e},showMonth:function(){var f=new Date();f.setTime(this.date.valueOf());f.setDate(1);f=this._getFirstDayInMonthCalendar(f);var a=this.el.getElements(".monthView tr");var h=0;for(var b=1;b<a.length;b++){var e=a[b].getElements("td");var g=0;e.each(function(l){l.setProperties({"class":""});l.addClass(f.getTime());if(f.getMonth()!==this.date.getMonth()){l.addClass("otherMonth")}if(this.selectedDate.isSameDay(f)){l.addClass("selectedDay")}l.empty();l.adopt(new Element("div",{"class":"date",styles:{"background-color":this._getColor("#E8EEF7",f)}}).appendText(f.getDate()));var c=0;this.entries.each(function(m){if((m.enddate!==""&&f.isDateBetween(m.startdate,m.enddate))||(m.enddate===""&&m.startdate.isSameDay(f))){c++}}.bind(this));var k=0;this.entries.each(function(q){if((q.enddate!==""&&f.isDateBetween(q.startdate,q.enddate))||(q.enddate===""&&q.startdate.isSameDay(f))){var n=l.getElements(".fabrikEvent").length;var m=20;var r=l.getElement(".date").getSize().y;m=Math.floor((l.getSize().y-c-r)/(c));var t=(l.getSize().y*(b-1))+this.el.getElement(".monthView .dayHeading").getSize().y+r;this.colwidth[".monthView"]=this.colwidth[".monthView"]?this.colwidth[".monthView"]:l.getSize().x;var o=l.getSize().x;o=this.colwidth[".monthView"];t=t+(n*m);var s=o*g;var p={view:"monthView","max-width":o};p.top=t;if(window.ie){p.left=s}p.startHour=q.startdate.getHours();p.endHour=q.enddate.getHours();p.startMin=q.startdate.getMinutes();p.endMin=q.enddate.getMinutes();p["margin-left"]=0;l.adopt(this._makeEventRelDiv(q,p,f,l))}k++}.bind(this));f.setTime(f.getTime()+this.DAY);g++}.bind(this))}document.addEvent("mousemove",function(l){var k=l.target;var c=l.client.x;var p=l.client.y;var n=this.activeArea;if(typeOf(n)!=="null"&&typeOf(this.activeDay)!=="null"){if((c<=n.left||c>=n.right)||(p<=n.top||p>=n.bottom)){if(!this.inFadeOut){var m=this.activeHoverEvent.getCoordinates();var o={opacity:[1,0],top:[m.top-10,m.top+50]};this.fx.showEventActions.cancel().start.delay(500,this.fx.showEventActions,o)}this.activeDay=null}}}.bind(this));this.entries.each(function(k){var c=this.el.getElement(".fabrikEvent_"+k._listid+"_"+k.id);if(c){}}.bind(this));this._highLightToday();this.el.getElement(".monthDisplay").innerHTML=this.options.months[this.date.getMonth()]+" "+this.date.getFullYear()},_makePopUpWin:function(){if(this.options.readonly){return}if(typeOf(this.popup)==="null"){var b=new Element("div",{"class":"popLabel"});var a=new Element("div",{"class":"popupDelete"}).set("html",this.options.buttons);this.popup=new Element("div",{"class":"popWin",styles:{position:"absolute"}}).adopt([b,a]);this.popup.inject(document.body);this.activeArea=null;this.fx.showEventActions=new Fx.Morph(this.popup,{duration:500,transition:Fx.Transitions.Quad.easeInOut,onCancel:function(){}.bind(this),onComplete:function(g){if(this.activeHoverEvent){var c=this.popup.getCoordinates();var k=this.activeHoverEvent.getCoordinates();var f=window.getScrollTop();var h={};h.left=(c.left<k.left)?c.left:k.left;h.top=(c.top<k.top)?c.top:k.top;h.top=h.top-f;h.right=(c.right>k.right)?c.right:k.right;h.bottom=(c.bottom>k.bottom)?c.bottom:k.bottom;h.bottom=h.bottom-f;this.activeArea=h;this.inFadeOut=false}}.bind(this)})}return this.popup},makeDragMonthEntry:function(a){},removeWeekEvents:function(){var g=this.date.getDay();g=g-this.options.first_week_day.toInt();var f=new Date();f.setTime(this.date.getTime()-(g*this.DAY));var c={};var a=this.el.getElements(".weekView tr");for(var b=1;b<a.length;b++){f.setHours(b-1,0,0);if(b!==1){f.setTime(f.getTime()-(6*this.DAY))}var e=a[b].getElements("td");for(j=1;j<e.length;j++){if(typeOf(c[j-1])==="null"){c[j-1]=[]}var h=e[j];c[j-1].push(h);if(j!==1){f.setTime(f.getTime()+this.DAY)}h.addClass("day");if(typeOf(h.retrieve("calevents"))!=="null"){h.retrieve("calevents").each(function(k){k.destroy()})}h.eliminate("calevents");h.className="";h.addClass("day");h.addClass(f.getTime()-this.HOUR);if(this.selectedDate.isSameWeek(f)&&this.selectedDate.isSameDay(f)){h.addClass("selectedDay")}else{h.removeClass("selectedDay")}}}return c},showWeek:function(){var l,m;var q=this.date.getDay();q=q-this.options.first_week_day.toInt();var b=new Date();b.setTime(this.date.getTime()-(q*this.DAY));var f=new Date();f.setTime(this.date.getTime()-(q*this.DAY));var e=new Date();e.setTime(this.date.getTime()+((6-q)*this.DAY));this.el.getElement(".monthDisplay").innerHTML=(b.getDate())+"  "+this.options.months[b.getMonth()]+" "+b.getFullYear()+" - ";this.el.getElement(".monthDisplay").innerHTML+=(e.getDate())+"  "+this.options.months[e.getMonth()]+" "+e.getFullYear();var o=this.el.getElements(".weekView tr");var c=o[0].getElements("th");var u=this.removeWeekEvents();var t,s,r;for(i=0;i<c.length;i++){c[i].className="dayHeading";c[i].addClass(f.getTime());r=c[i].getStyle("background-color");s=this.options.shortDays[f.getDay()]+" "+f.getDate()+"/"+this.options.shortMonths[f.getMonth()];t=new Element("div",{styles:{"background-color":this._getColor(r,f)}}).set("text",s);c[i].empty().adopt(t);var p=10;var n={};var k={};var a=u[i];this.entries.each(function(x){if((x.enddate!==""&&f.isDateBetween(x.startdate,x.enddate))||(x.enddate===""&&x.startdate.isSameDay(f))){var w=this._buildEventOpts({entry:x,curdate:f,divclass:".weekView",tdOffset:i});for(var v=w.startHour;v<=w.endHour;v++){n[v]=typeOf(n[v])==="null"?0:n[v]+1}}}.bind(this));var g=1;Object.each(n,function(h){if(h>g){g=h}});this.entries.each(function(y){if((y.enddate!==""&&f.isDateBetween(y.startdate,y.enddate))||(y.enddate===""&&y.startdate.isSameDay(f))){var x=this._buildEventOpts({entry:y,curdate:f,divclass:".weekView",tdOffset:i});for(var v=x.startHour;v<=x.endHour;v++){k[v]=typeOf(k[v])==="null"?0:k[v]+1}var z=0;for(v=x.startHour;v<=x.endHour;v++){if(k[v]>z){z=k[v]}}td=a[x.startHour];p=Math.floor((td.getSize().x-g)/(g+1));x.width=p+"px";x["margin-left"]=z*(p+1);var A=this._makeEventRelDiv(y,x,null,td);A.inject(document.body);A.store("opts",x);var w=td.retrieve("calevents",[]);w.push(A);td.store("calevents",w);A.position({relativeTo:td,position:"upperLeft"})}}.bind(this));f.setTime(f.getTime()+this.DAY)}},_buildEventOpts:function(a){var f=a.curdate;var q=new CloneObject(a.entry,true,["enddate","startdate"]);var m=this.el.getElements(a.divclass+" tr");var k=(q.startdate.isSameDay(f))?q.startdate.getHours()-this.options.open:0;k=k<0?0:k;var l=a.tdOffset;q.label=q.label?q.label:"";var g=m[k+1].getElements("td")[l+1];var p=q.startdate.getHours();var o=g.getSize().y;this.colwidth[a.divclass]=this.colwidth[a.divclass]?this.colwidth[a.divclass]:g.getSize().x;var n=this.el.getElement(a.divclass).getElement("tr").getSize().y;colwidth=this.colwidth[a.divclass];var e=(colwidth*l);e+=this.el.getElement(a.divclass).getElement("td").getSize().x;var h=Math.ceil(q.enddate.getHours()-q.startdate.getHours());if(h===0){h=1}if(q.startdate.getDay()!==q.enddate.getDay()){h=this.options.open!==0||this.options.close!==24?this.options.close-this.options.open+1:24;if(q.startdate.isSameDay(f)){h=this.options.open!==0||this.options.close!==24?this.options.close-this.options.open+1:24-q.startdate.getHours()}else{q.startdate.setHours(0);if(q.enddate.isSameDay(f)){h=this.options.open!==0||this.options.close!==24?this.options.close-this.options.open:q.enddate.getHours()}}}n=n+(o*k);var s=(o*h);if(q.enddate.isSameDay(f)){s+=(q.enddate.getMinutes()/60*o)}if(q.startdate.isSameDay(f)){n+=(q.startdate.getMinutes()/60*o);s-=(q.startdate.getMinutes()/60*o)}var c=g.getElements(".fabrikEvent");var b=colwidth/(c.length+1);var t=b*c.length;c.setStyle("width",b+"px");var r=a.divclass.substr(1,a.divclass.length);b-=g.getStyle("border-width").toInt();a={"z-index":999,"margin-left":t+"px",height:s,view:"weekView","background-color":this._getColor(this.options.colors.headingBg)};a["max-width"]=b+"px";a.left=e;a.top=n;a.color=this._getColor(this.options.colors.headingColor,q.startdate);a.startHour=q.startdate.getHours();a.endHour=a.startHour+h;a.startMin=q.startdate.getMinutes();a.endMin=q.enddate.getMinutes();q.startdate.setHours(p);return a},removeDayEvents:function(){var c=new Date();var e=[];c.setTime(this.date.valueOf());c.setHours(0,0);var a=this.el.getElements(".dayView tr");for(var b=1;b<a.length;b++){c.setHours(b-1,0);var f=a[b].getElements("td")[1];if(typeOf(f)!=="null"){e.push(f);f.className="";f.addClass("day");if(typeOf(f.retrieve("calevents"))!=="null"){f.retrieve("calevents").each(function(g){g.destroy()})}f.eliminate("calevents");f.addClass(c.getTime()-this.HOUR)}}return e},showDay:function(){var a=this.el.getElements(".dayView tr"),c;thbg=a[0].childNodes[1].getStyle("background-color");ht=this.options.days[this.date.getDay()];c=new Element("div",{styles:{"background-color":this._getColor(thbg,this.date)}}).set("text",ht);a[0].childNodes[1].empty().adopt(c);var k=this.removeDayEvents();var g=100;var f={};var e={};this.entries.each(function(n){if((n.enddate!==""&&this.date.isDateBetween(n.startdate,n.enddate))||(n.enddate===""&&n.startdate.isSameDay(firstDate))){var m=this._buildEventOpts({entry:n,curdate:this.date,divclass:".dayView",tdOffset:0});for(var l=m.startHour;l<=m.endHour;l++){e[l]=typeOf(e[l])==="null"?0:e[l]+1}}}.bind(this));var b=1;Object.each(e,function(h){if(h>b){b=h}});this.entries.each(function(p){if((p.enddate!==""&&this.date.isDateBetween(p.startdate,p.enddate))||(p.enddate===""&&p.startdate.isSameDay(firstDate))){var o=this._buildEventOpts({entry:p,curdate:this.date,divclass:".dayView",tdOffset:0});td=k[o.startHour];g=Math.floor((td.getSize().x-b)/(b+1));o.width=g+"px";for(var m=o.startHour;m<=o.endHour;m++){f[m]=typeOf(f[m])==="null"?0:f[m]+1}var l=0;for(m=o.startHour;m<=o.endHour;m++){if(f[m]>l){l=f[m]}}o["margin-left"]=l*(g+1);var q=this._makeEventRelDiv(p,o,null,td);q.inject(document.body);q.store("opts",o);var n=td.retrieve("calevents",[]);n.push(q);td.store("calevents",n);q.position({relativeTo:td,position:"upperLeft"})}}.bind(this));this.el.getElement(".monthDisplay").innerHTML=(this.date.getDate())+"  "+this.options.months[this.date.getMonth()]+" "+this.date.getFullYear()},renderMonthView:function(){var k,l;this.fadePopWin(0);var a=this._getFirstDayInMonthCalendar(new Date());var f=this.options.days.slice(this.options.first_week_day).concat(this.options.days.slice(0,this.options.first_week_day));var b=new Date();b.setTime(a.valueOf());if(a.getDay()!==this.options.first_week_day){var e=a.getDay()-this.options.first_week_day;b.setTime(a.valueOf()-(e*24*60*60*1000))}this.options.viewType="monthView";if(!this.mothView){tbody=new Element("tbody",{"class":"viewContainerTBody"});l=new Element("tr");for(k=0;k<7;k++){l.adopt(new Element("th",{"class":"dayHeading",styles:{width:"80px",height:"20px","text-align":"center",color:this._getColor(this.options.colors.headingColor,b),"background-color":this._getColor(this.options.colors.headingBg,b)}}).appendText(f[k]));b.setTime(b.getTime()+this.DAY)}tbody.appendChild(l);var o=this.options.colors.highlight;var m=this.options.colors.bg;var h=this.options.colors.today;for(var g=0;g<6;g++){l=new Element("tr");var n=this;for(k=0;k<7;k++){var p=this.options.colors.bg;var c=(this.selectedDate.isSameDay(a))?"selectedDay":"";l.adopt(new Element("td",{"class":"day "+(a.getTime())+c,styles:{width:this.options.monthday.width+"px",height:this.options.monthday.height+"px","background-color":p,"vertical-align":"top",padding:0,border:"1px solid #cccccc"},events:{mouseenter:function(){this.setStyles({"background-color":o})},mouseleave:function(){this.set("morph",{duration:500,transition:Fx.Transitions.Sine.easeInOut});var q=(this.hasClass("today"))?h:m;this.morph({"background-color":[o,q]})},click:function(q){n.selectedDate.setTime(this.className.split(" ")[1]);n.date.setTime(n._getTimeFromClassName(this.className));n.el.getElements("td").each(function(r){r.removeClass("selectedDay");if(r!==this){r.setStyles({"background-color":"#F7F7F7"})}}.bind(this));this.addClass("selectedDay")},dblclick:function(q){this.openAddEvent(q)}.bind(this)}}));a.setTime(a.getTime()+this.DAY)}tbody.appendChild(l)}this.mothView=new Element("div",{"class":"monthView",styles:{position:"relative"}}).adopt(new Element("table",{styles:{"border-collapse":"collapse"}}).adopt(tbody));this.el.getElement(".viewContainer").appendChild(this.mothView)}this.showView("monthView")},_getTimeFromClassName:function(a){return a.replace("today","").replace("selectedDay","").replace("day","").replace("otherMonth","").trim()},openAddEvent:function(k){var l;if(this.options.canAdd===0){return}k.stop();if(k.target.className==="addEventButton"){var a=new Date();l=a.getTime()}else{l=this._getTimeFromClassName(k.target.className)}this.date.setTime(l);d=0;if(!isNaN(l)&&l!==""){var h=new Date();h.setTime(l);var c=h.getMonth()+1;c=(c<10)?"0"+c:c;var n=h.getDate();n=(n<10)?"0"+n:n;var f=h.getHours();f=(f<10)?"0"+f:f;var g=h.getMinutes();g=(g<10)?"0"+g:g;this.doubleclickdate=h.getFullYear()+"-"+c+"-"+n+" "+f+":"+g+":00";d="&jos_fabrik_calendar_events___start_date="+this.doubleclickdate}if(this.options.eventLists.length>1){this.openChooseEventTypeForm(this.doubleclickdate,l)}else{var b={};b.rowid="";b.id="";d="&"+this.options.eventLists[0].startdate_element+"="+this.doubleclickdate;b.listid=this.options.eventLists[0].value;this.addEvForm(b)}},openChooseEventTypeForm:function(c,a){var b="index.php?option=com_fabrik&tmpl=component&view=visualization&controller=visualization.calendar&task=chooseaddevent&id="+this.options.calendarId+"&d="+c+"&rawd="+a;b+="&renderContext="+this.el.id.replace(/visualization_/,"");this.windowopts.contentURL=b;this.windowopts.id="chooseeventwin";this.windowopts.onContentLoaded=function(){var e=new Fx.Scroll(window).toElement("chooseeventwin")};Fabrik.getWindow(this.windowopts)},addEvForm:function(c){console.log(c);this.windowopts.id="addeventwin";var a="index.php?option=com_fabrik&controller=visualization.calendar&view=visualization&task=addEvForm&format=raw&listid="+c.listid+"&rowid="+c.rowid;a+="&jos_fabrik_calendar_events___visualization_id="+this.options.calendarId;a+="&visualizationid="+this.options.calendarId;if(c.nextView){a+="&nextview="+c.nextView}a+="&fabrik_window_id="+this.windowopts.id;if(typeof(this.doubleclickdate)!=="undefined"){a+="&start_date="+this.doubleclickdate}this.windowopts.type="window";this.windowopts.contentURL=a;var b=this.options.filters;this.windowopts.onContentLoaded=function(e){var f=new Fx.Scroll(window).toElement("addeventwin");b.each(function(g){if(document.id(g.key)){switch(document.id(g.key).get("tag")){case"select":document.id(g.key).selectedIndex=g.val;break;case"input":document.id(g.key).value=g.val;break}}});e.fitToContent()}.bind(this);Fabrik.getWindow(this.windowopts)},_highLightToday:function(){var a=new Date();this.el.getElements(".viewContainerTBody td").each(function(c){var b=new Date(this._getTimeFromClassName(c.className).toInt());if(a.equalsTo(b)){c.addClass("today")}else{c.removeClass("today")}}.bind(this))},centerOnToday:function(){this.date=new Date();this.showView()},renderDayView:function(){var b,c;this.fadePopWin(0);this.options.viewType="dayView";if(!this.dayView){tbody=new Element("tbody");b=new Element("tr");for(c=0;c<2;c++){if(c===0){b.adopt(new Element("td",{"class":"day"}))}else{b.adopt(new Element("th",{"class":"dayHeading",styles:{width:"80px",height:"20px","text-align":"center",color:this.options.headingColor,"background-color":this.options.colors.headingBg}}).appendText(this.options.days[this.date.getDay()]))}}tbody.appendChild(b);this.options.open=this.options.open<0?0:this.options.open;(this.options.close>24||this.options.close<this.options.open)?this.options.close=24:this.options.close;for(i=this.options.open;i<(this.options.close+1);i++){b=new Element("tr");for(c=0;c<2;c++){if(c===0){var a=(i.length===1)?i+"0:00":i+":00";b.adopt(new Element("td",{"class":"day"}).appendText(a))}else{b.adopt(new Element("td",{"class":"day",styles:{width:"100%",height:"10px","background-color":"#F7F7F7","vertical-align":"top",padding:0,border:"1px solid #cccccc"},events:{mouseenter:function(f){this.setStyles({"background-color":"#FFFFDF"})},mouseleave:function(f){this.setStyles({"background-color":"#F7F7F7"})},dblclick:function(f){this.openAddEvent(f)}.bind(this)}}))}}tbody.appendChild(b)}this.dayView=new Element("div",{"class":"dayView",styles:{position:"relative"}}).adopt(new Element("table",{"class":"",styles:{"border-collapse":"collapse"}}).adopt(tbody));this.el.getElement(".viewContainer").appendChild(this.dayView)}this.showView("dayView")},hideDayView:function(){if(this.el.getElement(".dayView")){this.el.getElement(".dayView").hide();this.removeDayEvents()}},hideWeekView:function(){if(this.el.getElement(".weekView")){this.el.getElement(".weekView").hide();this.removeWeekEvents()}},showView:function(a){this.hideDayView();this.hideWeekView();if(this.el.getElement(".monthView")){this.el.getElement(".monthView").hide()}this.el.getElement("."+this.options.viewType).style.display="block";switch(this.options.viewType){case"dayView":this.showDay();break;case"weekView":this.showWeek();break;default:case"monthView":this.showMonth();break}Cookie.write("fabrik.viz.calendar.view",this.options.viewType)},renderWeekView:function(){var e,g,f,b,c;this.fadePopWin(0);c=this.options.showweekends===false?6:8;this.options.viewType="weekView";if(!this.weekView){b=new Element("tbody");f=new Element("tr");for(g=0;g<c;g++){if(g===0){f.adopt(new Element("td",{"class":"day"}))}else{f.adopt(new Element("th",{"class":"dayHeading",styles:{width:this.options.weekday.width+"px",height:(this.options.weekday.height-10)+"px","text-align":"center",color:this.options.headingColor,"background-color":this.options.colors.headingBg},events:{click:function(k){k.stop();this.selectedDate.setTime(k.target.className.replace("dayHeading ","").toInt());var h=new Date();k.target.getParent().getParent().getElements("td").each(function(m){var l=m.className.replace("day ","").replace(" selectedDay").toInt();h.setTime(l);if(h.getDayOfYear()===this.selectedDate.getDayOfYear()){m.addClass("selectedDay")}else{m.removeClass("selectedDay")}}.bind(this))}.bind(this)}}).appendText(this.options.days[g-1]))}}b.appendChild(f);this.options.open=this.options.open<0?0:this.options.open;(this.options.close>24||this.options.close<this.options.open)?this.options.close=24:this.options.close;for(e=this.options.open;e<(this.options.close+1);e++){f=new Element("tr");for(g=0;g<c;g++){if(g===0){var a=(e.length===1)?e+"0:00":e+":00";f.adopt(new Element("td",{"class":"day"}).appendText(a))}else{f.adopt(new Element("td",{"class":"day",styles:{width:this.options.weekday.width+"px",height:this.options.weekday.height+"px","background-color":"#F7F7F7","vertical-align":"top",padding:0,border:"1px solid #cccccc"},events:{mouseenter:function(h){if(!this.hasClass("selectedDay")){this.setStyles({"background-color":"#FFFFDF"})}},mouseleave:function(h){if(!this.hasClass("selectedDay")){this.setStyles({"background-color":"#F7F7F7"})}},dblclick:function(h){this.openAddEvent(h)}.bind(this)}}))}}b.appendChild(f)}this.weekView=new Element("div",{"class":"weekView",styles:{position:"relative"}}).adopt(new Element("table",{styles:{"border-collapse":"collapse"}}).adopt(b));this.el.getElement(".viewContainer").appendChild(this.weekView)}this.showWeek();this.showView("weekView")},render:function(c){this.setOptions(c);document.addEvent("click:relay(button[data-task=deleteCalEvent], a[data-task=deleteCalEvent])",function(g,h){g.preventDefault();this.deleteEntry()}.bind(this));document.addEvent("click:relay(button[data-task=editCalEvent], a[data-task=editCalEvent])",function(g,h){g.preventDefault();this.editEntry()}.bind(this));document.addEvent("click:relay(button[data-task=viewCalEvent], a[data-task=viewCalEvent])",function(g,h){g.preventDefault();this.viewEntry()}.bind(this));document.addEvent("click:relay(a.fabrikEvent)",function(h,g){this.activeHoverEvent=h.target.hasClass("fabrikEvent")?h.target:h.target.getParent(".fabrikEvent")}.bind(this));this.windowopts.title=Joomla.JText._("PLG_VISUALIZATION_CALENDAR_ADD_EDIT_EVENT");this.windowopts.y=this.options.popwiny;this.popWin=this._makePopUpWin();var f=this.options.urlfilters;f.visualizationid=this.options.calendarId;if(this.firstRun){this.firstRun=false;f.resetfilters=this.options.restFilterStart}this.ajax.updateEvents=new Request({url:this.options.url.add,data:f,evalScripts:true,onSuccess:function(h){if(typeOf(h)!=="null"){var k=h.stripScripts(true);var g=JSON.decode(k);this.addEntries(g);this.showView()}}.bind(this)});this.ajax.deleteEvent=new Request({url:this.options.url.del,data:{visualizationid:this.options.calendarId},onComplete:function(h){h=h.stripScripts(true);var g=JSON.decode(h);this.entries=$H();this.addEntries(g)}.bind(this)});if(typeOf(this.el.getElement(".addEventButton"))!=="null"){this.el.getElement(".addEventButton").addEvent("click",function(g){this.openAddEvent(g)}.bind(this))}var b=[];var e=new Element("div",{"class":"calendarNav"}).adopt(new Element("ul",{"class":"viewMode"}).adopt(b));this.el.appendChild(e);this.el.appendChild(new Element("div",{"class":"viewContainer"}));if(typeOf(Cookie.read("fabrik.viz.calendar.date"))!=="null"){this.date=new Date(Cookie.read("fabrik.viz.calendar.date"))}var a=typeOf(Cookie.read("fabrik.viz.calendar.view"))==="null"?this.options.viewType:Cookie.read("fabrik.viz.calendar.view");switch(a){case"dayView":this.renderDayView();break;case"weekView":this.renderWeekView();break;default:case"monthView":this.renderMonthView();break}this.el.getElement(".nextPage").addEvent("click",function(g){this.nextPage(g)}.bind(this));this.el.getElement(".previousPage").addEvent("click",function(g){this.previousPage(g)}.bind(this));if(this.options.show_day){this.el.getElement(".dayViewLink").addEvent("click",function(g){this.renderDayView(g)}.bind(this))}if(this.options.show_week){this.el.getElement(".weekViewLink").addEvent("click",function(g){this.renderWeekView(g)}.bind(this))}if(this.options.show_week||this.options.show_day){this.el.getElement(".monthViewLink").addEvent("click",function(g){this.renderMonthView(g)}.bind(this))}this.el.getElement(".centerOnToday").addEvent("click",function(g){this.centerOnToday(g)}.bind(this));this.showMonth();this.ajax.updateEvents.send()},showMessage:function(a){this.el.getElement(".calendar-message").set("html",a);this.fx.showMsg.start({opacity:[0,1]}).chain(function(){this.start.delay(2000,this,{opacity:[1,0]})})},addEntry:function(b,g){var f,c,a,e;if(g.startdate){f=g.startdate.split(" ");f=f[0];if(f.trim()===""){return}e=g.startdate.split(" ");e=e[1];e=e.split(":");f=f.split("-");c=new Date();a=(f[1]).toInt()-1;c.setYear(f[0]);c.setMonth(a,f[2]);c.setDate(f[2]);c.setHours(e[0].toInt());c.setMinutes(e[1].toInt());c.setSeconds(e[2].toInt());g.startdate=c;this.entries.set(b,g);if(g.enddate){f=g.enddate.split(" ");f=f[0];if(f.trim()===""){return}if(f==="0000-00-00"){g.enddate=g.startdate;return}e=g.enddate.split(" ");e=e[1];e=e.split(":");f=f.split("-");c=new Date();a=(f[1]).toInt()-1;c.setYear(f[0]);c.setMonth(a,f[2]);c.setDate(f[2]);c.setHours(e[0].toInt());c.setMinutes(e[1].toInt());c.setSeconds(e[2].toInt());g.enddate=c}}},deleteEntry:function(){var c=this.activeHoverEvent.id.replace("fabrikEvent_","");var b=c.split("_");var a=b[0];if(!this.options.deleteables.contains(a)){return}if(confirm(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_CONF_DELETE"))){this.ajax.deleteEvent.options.data={id:b[1],listid:a};this.ajax.deleteEvent.send();document.id(this.activeHoverEvent).fade("out");this.fx.showEventActions.start({opacity:[1,0]});this.removeEntry(c);this.activeDay=null}},editEntry:function(b){var c={};c.id=this.options.formid;var a=this.activeHoverEvent.id.replace("fabrikEvent_","").split("_");c.rowid=a[1];c.listid=a[0];b.stop();this.addEvForm(c)},viewEntry:function(){var b={};b.id=this.options.formid;var a=this.activeHoverEvent.id.replace("fabrikEvent_","").split("_");b.rowid=a[1];b.listid=a[0];b.nextView="details";this.addEvForm(b)},addEntries:function(b){b=$H(b);b.each(function(c,a){this.addEntry(a,c)}.bind(this));this.showView()},removeEntry:function(a){this.entries.erase(a);this.showView()},nextPage:function(){this.fadePopWin(0);switch(this.options.viewType){case"dayView":this.date.setTime(this.date.getTime()+this.DAY);this.showDay();break;case"weekView":this.date.setTime(this.date.getTime()+this.WEEK);this.showWeek();break;case"monthView":this.date.setDate(1);this.date.setMonth(this.date.getMonth()+1);this.showMonth();break}Cookie.write("fabrik.viz.calendar.date",this.date)},fadePopWin:function(a){if(this.popWin){this.popWin.setStyle("opacity",a)}},previousPage:function(){this.fadePopWin(0);switch(this.options.viewType){case"dayView":this.date.setTime(this.date.getTime()-this.DAY);this.showDay();break;case"weekView":this.date.setTime(this.date.getTime()-this.WEEK);this.showWeek();break;case"monthView":this.date.setMonth(this.date.getMonth()-1);this.showMonth();break}Cookie.write("fabrik.viz.calendar.date",this.date)},addLegend:function(b){var c=new Element("ul");b.each(function(e){var a=new Element("li");a.adopt(new Element("div",{styles:{"background-color":e.colour}}),new Element("span").appendText(e.label));c.appendChild(a)}.bind(this));new Element("div",{"class":"legend"}).adopt([new Element("h3").appendText(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_KEY")),c]).inject(this.el,"after")},_getGreyscaleFromRgb:function(c){var f=parseInt(c.substring(1,3),16);var e=parseInt(c.substring(3,5),16);var a=parseInt(c.substring(5),16);var h=parseInt(0.3*f+0.59*e+0.11*a,10);return"#"+h.toString(16)+h.toString(16)+h.toString(16)},_getColor:function(a,e){if(!this.options.greyscaledweekend){return a}var b=new Color(a);if(typeOf(e)!=="null"&&(e.getDay()===0||e.getDay()===6)){return this._getGreyscaleFromRgb(a)}else{return a}}});Date._MD=new Array(31,28,31,30,31,30,31,31,30,31,30,31);Date.SECOND=1000;Date.MINUTE=60*Date.SECOND;Date.HOUR=60*Date.MINUTE;Date.DAY=24*Date.HOUR;Date.WEEK=7*Date.DAY;Date.prototype.getMonthDays=function(b){var a=this.getFullYear();if(typeof b==="undefined"){b=this.getMonth()}if(((0===(a%4))&&((0!==(a%100))||(0===(a%400))))&&b===1){return 29}else{return Date._MD[b]}};Date.prototype.isSameWeek=function(a){return((this.getFullYear()===a.getFullYear())&&(this.getMonth()===a.getMonth())&&(this.getWeekNumber()===a.getWeekNumber()))};Date.prototype.isSameDay=function(a){return((this.getFullYear()===a.getFullYear())&&(this.getMonth()===a.getMonth())&&(this.getDate()===a.getDate()))};Date.prototype.isSameHour=function(a){return((this.getFullYear()===a.getFullYear())&&(this.getMonth()===a.getMonth())&&(this.getDate()===a.getDate())&&(this.getHours()===a.getHours()))};Date.prototype.isDateBetween=function(c,b){var e=c.getFullYear()*10000+(c.getMonth()+1)*100+c.getDate();var f=b.getFullYear()*10000+(b.getMonth()+1)*100+b.getDate();var a=this.getFullYear()*10000+(this.getMonth()+1)*100+this.getDate();return e<=a&&a<=f};