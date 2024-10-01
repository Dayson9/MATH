const dataset = [
  { input: "( 8 / 4 )", output: "2", e: true },
  { input: "( 2 * 9 )", output: "18", e: true },
  { input: "( 2 + 9 )", output: "11", e: true },
  { input: "( 2 - 9 )", output: "-7", e: true },
  { input: "8 / 4", output: "2", e: true },
  { input: "2 * 9", output: "18", e: true },
  { input: "2 + 9", output: "11", e: true },
  { input: "2 - 9", output: "-7", e: true },
  { input: "y + 1 = 0", output: "y = 0 - 1" },
  { input: "2 y = 0", output: "y = 0 / 2" },
  { input: "2 / y = 1", output: "1 * y = 2" },
  { input: "2 - y = 0", output: "- y = 0 + 2" },
  { input: "1 * y = 2", output: "y = 2 / 1" },
  { input: "1 + y = 2", output: "y = 2 - 1" },
  { input: "x - 1 = 0", output: "x = 0 + 1" },
  { input: "x + 1 = 0", output: "x = 0 - 1" },
  { input: "x * 1 = 0", output: "x = 0 / 1" },
  { input: "x / 1 = 0", output: "x = 0 * 1" },
  { input: "1 * x = - 0.5", output: "x = - 0.5 / 1" },
  { input: "- a =", output: "a = -" },
  { input: "+ -", output: "-" },
  { input: "- +", output: "-" }
];

// Function to convert a string into a regular expression that matches the input string.
const toRegex = (inputString) => {
  // Define an array of operators.
  const operators = ["+", "-", "/", "*"];

  // Split the input string into an array of tokens.
  const tokens = inputString.split(" ");

  // Map over the tokens and create a regular expression for each token.
  const regexTokens = tokens.map((token, i) => {
    // If the token is a number or "0", create a regular expression that matches a number.
    if (!(operators.includes(token)) && parseInt(token) || token === "0") {
      return "\\s*([\-][ ]*)?\\d+(\\.\\d+)?";
    }
    // If the token is an operator including "=", create a regular expression that matches the operator.
    else if (([...operators, "="].includes(token))) {
      // If the token is "+" or "*", create a regular expression that matches the operator with a space before and after.
      return ["+", "*", "/"].includes(token) ? "[ ]\\" + token : "[ ]" + token;
      // Otherwise, create a regular expression that matches a letter.
    } else {
      return "[ ][a-zA-Z]+";
    }
  });

  // Join the regex tokens into a single string.
  const regexString = regexTokens.join("").trim().replace("[ ]", "");

  // Return the regular expression.
  return regexString;
}

// Function to format the input string by adding spaces around operators and separating numbers and variables.
const format = (inputString) => {
  // Define regular expressions for numbers, letters, and variables.
  const numberRegex = /[0-9]+/;
  const letterRegex = /[a-zA-Z]+/;
  const variableRegex = /[0-9]+[a-zA-Z]+/g;

  // Define a regular expression for operators.
  const operatorRegex = /\+|\/|\*|\=/g;
  // Define regular expressions for brackets
  const bracketRegex = /\[|\]|\(|\)/;

  // Remove all spaces from the input string.
  let formattedString = inputString.replace(/\s/g, "");

  // Replace operators with spaces around them.
  formattedString = formattedString.replace(operatorRegex, (operator) => " " + operator + " ");
  
  
  // Replace variables with spaces between the number and the letter.
  formattedString = formattedString.replace(variableRegex, (extract) => {
    const number = numberRegex.exec(extract)[0];
    const letter = letterRegex.exec(extract)[0];
    return number + " " + letter;
  });

  // Replace brackets with spaces around them.
  formattedString = formattedString.replace(bracketRegex, (bracket) => " " + bracket + " ");
  
  // Remove all double or more spaces
 formattedString = formattedString.replace(/\s{2,}/g, "");

  // Return the formatted string.
  return formattedString;
}

// Function to create an array of data from the input and output strings.
const toDataArr = (inputString, outputString) => {
  // Split the output string into an array of tokens.
  const outputTokens = outputString.split(" ");
  // Split the input string into an array of tokens.
  const inputTokens = inputString.split(" ");

  // Map over the output tokens and create an array of data.
  const data = outputTokens.map((token, index) => {
    // If the input string includes the token, return the index of the token in the input string.
    if (inputString.includes(token)) {
      return inputTokens.indexOf(token);
    }
    // Otherwise, return the token.
    else {
      return token;
    }
  });

  // Return an object containing the data array.
  return { data };
}


// Function to convert the dataset into an executable format.
const toExecutable = () => {
  // Map over the dataset and create an object for each input-output pair.
  return dataset.map(({ input, output, e }) => {
    // Convert the input string into a regular expression.
    const regex = toRegex(input);

    // Convert the input and output strings into an array of data.
    const data = toDataArr(input, output);

    // Return an object containing the regular expression, data, and e flag.
    return { ...data, regex: regex, e: e };
  });
};


//  prints a warning message to the console.
const warn = (message) => console.warn(message);

// Execute the toExecutable function and store the result in the executables variable.
const executables = toExecutable();



const evaluateExpr = (str) => {
  const reg = /-?\d+(\.\d+)?[ ](\+|\*|\/|\-){1}[ ]-?\d+(\.\d+)?/g;

  const match = reg.exec(str);
  if (match) {
    return str.replace(reg, (it) => {
      return eval(it);
    })
  } else {
    return str;
  }
}



//  converts the extracted text into the desired output format.
const toOutput = (extractedText, data) => {
  // Split the extracted text into an array of words.
  const splittedText = extractedText.split(" ");
  // Map over the data and convert each element to the corresponding output.
  return data.map((item) => {
    // If the item is a number, return the corresponding word from the splitted text.
    if (typeof item == "number") {
      return splittedText[item];
    } else {
      // Otherwise, return the item itself.
      return item;
    }
  }).join(" "); // Join the output elements back into a string.
}

const stillExecutable = (expression) => {
  let out = false;
  for ({ regex } of executables) {
    let reg = new RegExp(regex);
    if (reg.test(expression)) {
      out = true;
      break;
    }
  }

  return out;
}


//  predicts the output for a given input.
const predict = (input) => {
  // Format the input string.
  const formattedInput = format(input);
  let currentInput = formattedInput,
    match = true,
    output = [],
    bfr = currentInput;

  while (match) {
    for ({ data, regex, e } of executables) {
      const reg = new RegExp(regex),
        test = reg.test(currentInput),
        matched = reg.exec(currentInput);

      bfr = format(currentInput);

      if (test) {
        currentInput = e ? currentInput.replaceAll(matched[0], eval(matched[0])) : currentInput.replaceAll(matched[0], toOutput(matched[0], data));
      }
      currentInput = format(currentInput);
      output.push(currentInput === bfr ? "" : currentInput);
      bfr = currentInput;
      currentInput = evaluateExpr(currentInput);

      output.push(currentInput === bfr ? "" : currentInput);
      match = stillExecutable(currentInput);
    }
  }

  return [formattedInput, ...output.filter(Boolean)];
};

warn(predict("4 * 8 + y = 64 / 2 * -8").join("\n\n") + "//");