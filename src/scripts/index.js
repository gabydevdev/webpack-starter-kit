import "../styles/index.scss";

console.log("webpack starterkit");

async function init() {
	// import all your functions/code there
}

if (document.readyState === "complete") {
	init();
} else {
	window.addEventListener("load", init);
}
