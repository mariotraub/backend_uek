const [,, ...nums] = process.argv;

console.log(nums.reduce((prev, curr) => {
	return parseInt(curr) + prev;	
}, 0))

