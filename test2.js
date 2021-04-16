function opr(stack, result){
    while(stack.length){
        const op = stack.pop();
        if(op == "(")	break;
        result.push(op);
    }
  }

function infixToPostfix(infix){
    const operator = ["-", "+", "*", "/"];
    infix = infix.split('');
	const stack = [];
    const result = [];
    
    for(let str of infix){
    	// Step 1
    	if(!isNaN(str)){
        	result.push(parseInt(str)); continue;
        }
        const lastStack = stack[stack.length - 1];
        // Step 2
        if(!stack.length || lastStack == "(" || str == "("){
        	stack.push(str); continue;
        }
        // Step 3
        if(str == ")"){
        	opr(stack, result);continue;
        }
        // Step 4
		let prevOprIndex = operator.indexOf(lastStack);
        let	currOprIndex = operator.indexOf(str);
        while(currOprIndex < prevOprIndex){
            const op = stack.pop();
            result.push(op);
            prevOprIndex = operator.indexOf(stack[stack.length - 1]);
        }
        stack.push(str);
	}
    // Step 5
    opr(stack, result)
    return result.join('');
}

console.log(infixToPostfix("1+2"));
console.log(infixToPostfix("1+2*3"));
console.log(infixToPostfix("1*(2+3*4)+5"));