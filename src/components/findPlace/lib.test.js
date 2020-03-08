import axios from "axios";
import {add, avg} from "./lib.js";

test("Test Add Function", ()=>{
	expect(add(3,4)).toBe(7);
	expect(add(undefined,4)).toBeNaN();
	expect(add("7",8)).toBe(15);
});
test("Test API", ()=>{
	return axios.get("https://cwpeng.github.io/live-records-samples/data/products.json").then((response)=>{
		expect(response.data).toBeDefined();
		expect(response.data.length).toBeGreaterThan(0);
		expect(response.data[0]).toHaveProperty("name");
		expect(response.data[0]).toHaveProperty("price");
		expect(response.data[0]).toHaveProperty("description");
		expect(typeof response.data[0].price).toBe("number");
	});
});
test("Test Process After API Call", ()=>{
	let mockResponse={
		data:[
			{
				"name":"Pixel 3",
				"price":27600,
				"description":"最新的 Google 手機。"
			},
			{
				"name":"Chromecast",
				"price":1500,
				"description":"在大螢幕上播放喜歡的影片。"
			},
			{
				"name":"Pixel Book",
				"price":12000,
				"description":"最新的 Chromebook 產品。"
			}
		]
	};
	expect(avg(mockResponse.data)).toBe(13700);
});