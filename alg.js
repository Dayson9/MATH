var dataset = [{ input: "4 plus 6", output: "4 + 6" }, { input: "4 times 16", output: "4 * 16" }, { input: "{4} ( {x} {+} {7} )", output: "4 * x + 4 * 7" }, { input: "{x} + 2 = 3", output: "x = 3 - 2" }],
  pattern = [];

const input = document.querySelector("input");

function strBetween(str, f, s) {
  let out = "";
  let indexF = str.indexOf(f) + 1;
  let indexS = str.indexOf(s);
  out = str.slice(indexF, indexS);
  return out;
}


const to_template = (input, output) => {
  let o_spl = output.split(" ");
  let in_spl = input.split(" ");
  let template = [];

  o_spl.forEach((item) => {
    for (i in in_spl) {
      if (item === in_spl[i]) {
        template.push(parseInt(i));
        break;
      } else {
        if ((in_spl.length - 1) == i) {
          template.push(item);
        }
      }

    }
  });
  return template;
}


const to_regex = (temp) => {
  let reg = "";
  temp.forEach((item) => {
    if (parseInt(item).toString() != "NaN") {
      reg += "\\s[0-9]{1,}";
    } else {

      if (item.includes("{") && item.includes("}")) {
        reg += "\\s.*";
      } else {
        reg += "\\s" + item;
      }

    }
  });

  reg = reg.replace("\\s", "");
  reg = reg.replaceAll("+", "\\+");
  reg = reg.replaceAll("(", "\\(");
  reg = reg.replaceAll(")", "\\)");
  return new RegExp(reg);
}



const train = () => {
  dataset.forEach((data) => {
    let reg = to_regex(data.input.split(" "));
    data.input = data.input.replaceAll("{", "");
    data.input = data.input.replaceAll("}", "");

    let temp = to_template(data.input, data.output);
    pattern.push({ template: temp, regex: reg });
  });
}


const pred = (template, str) => {
  let s = str[0];
  str = s.split(" ");
  let out = "",
    t_len = template.length;

  for (c = 0; c < t_len; c++) {
    if (typeof template[c] != "string") {
      out += " " + str[template[c]];
    } else {
      out += " " + template[c];
    }
  }

  out = out.replace(" ", "");
  return out;
}


const pred1 = (p, int) => {
  let prediction = "",
    ext = "",
    tst, len, i, tmp = int.split(" "),
    bool = false;

  tmp.forEach((t) => {
    tst = p.regex.test(int);
    ext = p.regex.exec(int);

    if (tst) {
      int = int.replace(ext, pred(p.template, ext));
      bool = true;

    }
    prediction = int;
  });


  return [prediction, bool];
};


const predict = (inp) => {
  let pre = inp,
    temp = [];

  pattern.forEach((p) => {
    temp = pred1(p, pre);
    if (temp[1]) {
      pre = temp[0];
    }
  });

  return pre;
}


train();
console.log(pattern);

console.log(predict(input.value));