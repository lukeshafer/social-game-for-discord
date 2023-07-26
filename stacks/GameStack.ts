import { StackContext, Table, WebSocketApi, AstroSite } from "sst/constructs";

export function GameStack({ stack }: StackContext) {
	//const table = new Table(stack, "Connections", {
	//fields: {
	//id: "string",
	//},
	//primaryIndex: { partitionKey: "id" },
	//});

	//const api = new WebSocketApi(stack, "Api", {
	//defaults: {
	//function: {
	//bind: [table],
	//},
	//},
	//routes: {
	//$connect: "packages/functions/src/connect.main",
	//$disconnect: "packages/functions/src/disconnect.main",
	//sendMessage: "packages/functions/src/sendMessage.main",
	//},
	//});

	const site = new AstroSite(stack, "Site", {
		path: "packages/site",
	});
	stack.addOutputs({
		url: site.url || "http://localhost:3000",
		//apiUrl: api.url,
	});
}
