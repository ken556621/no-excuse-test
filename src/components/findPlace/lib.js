function add(n1,n2){
	return Number(n1)+Number(n2);
}
function avg(data){
	let total=data.reduce((total, item)=>{
		return total+item.price;
	}, 0);
	return total/data.length;
}
export {add, avg};