sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox",
	"../model/formatter"
], function (BaseController, JSONModel, History,MessageBox, formatter) {
	"use strict";

	return BaseController.extend("sap.treinamento.prjcat.projectcategories.controller.Object", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit : function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy : true,
					delay : 0
				});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
					// Restore original busy indicator delay for the object view
					oViewModel.setProperty("/delay", iOriginalBusyDelay);
				}
			);
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */


		/**
		 * Event handler  for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the worklist route.
		 * @public
		 */
		onNavBack : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("worklist", {}, true);
			}
        },
        
        onPressEditar: function(){
                this.getView().byId("btnEditar").setVisible(false);
                this.getView().byId("btnExcluir").setVisible(true);
                this.getView().byId("btnSalvar").setVisible(true);
                this.getView().byId("inName").setEditable(true); 
        }, 

        onPressCriar: function () {
            //pegar os valores que o usuário digitou
            debugger;
            var oCreate = {};
            oCreate.ID = parseInt(this.getView().byId("inId").getValue());
            oCreate.Name = this.getView().byId("inName").getValue();
           var oI18n = this.getView().getModel("i18n").getResourceBundle();
           var sMsgSucesso = oI18n.getText("msgSucesso");
            var sMsgErro = oI18n.getText("msgErro");
            var sMsgCamposObrigatorios = oI18n.getText("msgCamposObrigatorios");
           if ( (!oCreate.ID && oCreate.ID !== 0) || !oCreate.Name ){
                //mandar a mensagem
                MessageBox.error(sMsgCamposObrigatorios);
                return;
            }
            //fazer uma requisição de criação
            this.getModel().create("/Categories", oCreate, {
                success: function () {
                    //mandar uma mensagem de sucesso
                    MessageBox.success(sMsgSucesso, {
                        onClose: function (){
                            //quando o usuário apertar OK, navega para a worklist
                            window.history.go(-1);
                        }
                    });
                }, error: function () {
                    //manda mensagem de erro
                    MessageBox.error(sMsgErro);
                }
            });
           
        },


        onPressSalvar: function () {
            //pegar os valores que o usuário digitou
            debugger;
            var oUpdate = {};
            oUpdate.ID = parseInt(this.getView().byId("inId").getValue());
            oUpdate.Name = this.getView().byId("inName").getValue();
            var oI18n = this.getView().getModel("i18n").getResourceBundle();
            var sMsgSucesso = oI18n.getText("msgSucesso");
            var sMsgErro = oI18n.getText("msgErro");
           var sPath = this.getModel().createKey("Categories", {
                ID : oUpdate.ID
            });            
            debugger;
            this.getModel().update("/" + sPath, oUpdate, {
                success: function () {
                    //mandar uma mensagem de sucesso
                    MessageBox.success(sMsgSucesso, {
                        onClose: function (){
                            //quando o usuário apertar OK, navega para a worklist
                            window.history.go(-1);
                        }
                    });
                }, error: function () {
                    //manda mensagem de erro
                    MessageBox.error(sMsgErro);
                }
            });
        }, 

        onPressExcluir: function () {
            debugger;
            var sId = parseInt(this.getView().byId("inId").getValue());
            var oI18n = this.getView().getModel("i18n").getResourceBundle();
            var sMsgSucesso = oI18n.getText("msgSucesso");
            var sMsgErro = oI18n.getText("msgErro");
            var sPath = this.getModel().createKey("Categories", {
                ID : sId
            });
            this.getModel().remove("/" + sPath, {
                success: function (){
                    MessageBox.success(sMsgSucesso, {
                        onClose: function (){
                            window.history.go(-1);
                        }
                    });
                }, error: function () {
                    MessageBox.error(sMsgErro);
                }
            });
        },

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
       _onObjectMatched : function (oEvent) {
            var sObjectId =  oEvent.getParameter("arguments").objectId;
            var oViewModel = this.getModel("objectView");
            this.getModel().setUseBatch(false);
            if (sObjectId === "new"){
                this.getView().byId("btnCriar").setVisible(true);
                this.getView().byId("btnEditar").setVisible(false);
                this.getView().byId("btnExcluir").setVisible(false);
                this.getView().byId("btnSalvar").setVisible(false); 
                this.getView().byId("inId").setEditable(true);
                this.getView().byId("inName").setEditable(true);                
                this.getView().byId("inId").setValue("");
                this.getView().byId("inName").setValue("");
                oViewModel.setProperty("/busy", false);               
            }else{
                this.getView().byId("btnEditar").setVisible(true); 
                this.getView().byId("btnCriar").setVisible(false);
                this.getView().byId("btnExcluir").setVisible(false);
                this.getView().byId("btnSalvar").setVisible(false);
                this.getView().byId("inId").setEditable(false);
                this.getView().byId("inName").setEditable(false); 
                this.getModel().metadataLoaded().then( function() {
                    var sObjectPath = this.getModel().createKey("Categories", {
                        ID :  sObjectId
                    });
                    this._bindView("/" + sObjectPath);
                }.bind(this));
            }
        },

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView : function (sObjectPath) {
			var oViewModel = this.getModel("objectView"),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oDataModel.metadataLoaded().then(function () {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange : function () {
			var oView = this.getView(),
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();
            debugger;
			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.ID,
				sObjectName = oObject.ID;

			oViewModel.setProperty("/busy", false);

			oViewModel.setProperty("/shareSendEmailSubject",
			oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
			oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		}

	});

});