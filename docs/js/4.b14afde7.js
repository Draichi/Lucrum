(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[4],{"713b":function(t,e,a){"use strict";a.r(e);var o=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("q-layout",{attrs:{view:"lHh Lpr lFf"}},[o("q-toolbar",{class:t.textColor},[o("q-avatar",[o("img",{staticClass:"custom-img",attrs:{src:a("b640"),alt:"logo"}})]),o("q-toolbar-title",[t._v("\n      Buy Low Sell High\n    ")]),o("q-btn",{staticClass:"q-mr-md",attrs:{icon:"wb_incandescent",size:"sm",round:""},on:{click:function(e){return t.$q.dark.toggle()}}}),t.providerReady?o("q-avatar",{attrs:{color:"primary",size:"md","text-color":"white"}},[t._v("0x")]):o("q-btn",{attrs:{icon:"img:statics/metamask.svg",label:"metamask",flat:""},on:{click:t.connectMetamask}})],1),o("q-page-container",[o("router-view")],1)],1)},n=[],r={name:"MainLayout",data:function(){return{providerReady:!1}},created:function(){window.web3.currentProvider.publicConfigStore.on("update",this.setWalletStatus),this.providerReady=!!window.web3.currentProvider.selectedAddress},methods:{connectMetamask:function(){window.ethereum.enable()},setWalletStatus:function(t){this.providerReady=t.isUnlocked}},computed:{textColor:function(){return this.$store.getters["theme/textColor"]}}},i=r,s=(a("89d3"),a("2877")),c=a("eebe"),l=a.n(c),u=a("4d5a"),d=a("65c6"),b=a("cb32"),m=a("0016"),p=a("6ac5"),w=a("9c40"),v=a("09e3"),f=Object(s["a"])(i,o,n,!1,null,null,null);e["default"]=f.exports;l()(f,"components",{QLayout:u["a"],QToolbar:d["a"],QAvatar:b["a"],QIcon:m["a"],QToolbarTitle:p["a"],QBtn:w["a"],QPageContainer:v["a"]})},"89d3":function(t,e,a){"use strict";var o=a("b0e3"),n=a.n(o);n.a},b0e3:function(t,e,a){},b640:function(t,e,a){t.exports=a.p+"img/logo.2423b30d.jpg"}}]);