import App from './components/App';
import setupServiceWorker from "./utils/setupServiceWorker";
import dateToUTC from "./utils/dateToUTC";
Date.prototype.toJSON = function(){
	const time= dateToUTC(this);
	return [time.getHours(), time.getMinutes(), time.getSeconds()]
};
ReactDOM.hydrate(<App/>, document.getElementById("app"));
if("serviceWorker" in navigator){
	setupServiceWorker();
}