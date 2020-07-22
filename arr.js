const arr1 = [1, 2, 3, 4, 5];
const arr2 = [3, 4, 7, 2];
const arr3 = arr1.filter((item) => arr2.indexOf(item) === -1);

console.log(arr3); // [2, 3, 4]
