class BackgroudHelper {

	private bgurl: string;

	constructor() {
		var key = "bgurl";
		this.bgurl = decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
		if (this.bgurl.length <= 0) {

			this.bgurl = 'background.png';
		}
	}

	getBackgroudImage() : string {
		return this.bgurl;
	}
}

export {
	BackgroudHelper as default
};