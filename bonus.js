function bonus(nums) {
    
    let farthest = 0

   
    for (let i = 0; i < nums.length; i++) {
       
        if (i > farthest) {
            return false
        }

        
        farthest = Math.max(farthest, i + nums[i])

        
        if (farthest >= nums.length - 1) {
            return true
        }
    }

    
    return farthest >= nums.length - 1
}


console.log(bonus([2,3,1,1,4]));
console.log(bonus([3,2,1,0,4])); 