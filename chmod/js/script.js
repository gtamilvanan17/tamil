const reg_num = /^[0-7]{3}$/; // some regex to check the num input
const reg_let = /^([r\-]{1}[w\-]{1}[x\-]{1}){3}$/; // some regex to check the text input


window.addEventListener("DOMContentLoaded", function() {

  // loop over all the check boxes
  for (let i = 1; i < 10 ; i++) {
    let checkBox = document.getElementById(`${i}`);
    checkBox.addEventListener('change', function() {
      change_occured(true, false, false);

      // get rid of bad input classes
      document.getElementById('num').classList.remove('bad-input');
      document.getElementById("let_num_text").classList.add('hidden');

      document.getElementById('let').classList.remove('bad-input');
      document.getElementById("let_bad_text").classList.add('hidden');
    });
  }

  // the octal input
  let num_input = document.getElementById('num');
  num_input.addEventListener('change', function() {

    // check for bad input
    if (!reg_num.test(this.value)) {
      this.classList.add('bad-input');
      document.getElementById("let_num_text").classList.remove('hidden');
    } else {
      this.classList.remove('bad-input');
      document.getElementById("let_num_text").classList.add('hidden');
      change_occured(false, true, false);
    }
  })


  // the let input
  let let_input = document.getElementById('let');
  let_input.addEventListener('change', function() {

    // check for bad input
    if (!reg_let.test(this.value)) {
      this.classList.add('bad-input');
      document.getElementById("let_bad_text").classList.remove('hidden');
    } else {
      this.classList.remove('bad-input');
      document.getElementById("let_bad_text").classList.add('hidden');
      change_occured(false, false, true);
    }
  })

});

/* SETUP
r-4-1  r-4-4  r-4-7
w-2-2  w-2-5  w-2-8
x-1-3  x-1-6  x-1-9
*/


// define a function that runs when a change occures
function change_occured(caller_was_check, caller_was_num, caller_was_let) {
  let num1 = 0, num2 = 0, num3 = 0; // these are the three numbers for the octal
  let perm_string = ''; // holds the permision string ex. rw-x--r--

  if (caller_was_check) {
    // loop over all the check boxes and get the permisions
    for (let i = 1; i < 10 ; i++) {
      let checkBox = document.getElementById(`${i}`);

      if (checkBox.checked) { // if checked
        let current_perm = check_to_octal_and_text(i);
        perm_string += `${current_perm.perm_let}`;

        if (i <= 3) {
          num1 += current_perm.perm_num;
        } else if (i <= 6) {
          num2 += current_perm.perm_num;
        } else {
          num3 += current_perm.perm_num;
        }

      } else { // if not checked
        perm_string += '-';
      }
    }

    // set the permision input text
    document.getElementById('let').value = perm_string;
    document.getElementById('num').value = `${num1}${num2}${num3}`;

  } else if (caller_was_num) {
    // get the individual numbers
    let num_input_val = document.getElementById('num').value;
    num1 = num_input_val.substring(0,1);
    num2 = num_input_val.substring(1,2);
    num3 = num_input_val.substring(2,3);

    // set the checkboxes and get the perm string
    perm_string += octal_to_check_and_txt(num1, 0); //Owner
    perm_string += octal_to_check_and_txt(num2, 1); //Owner
    perm_string += octal_to_check_and_txt(num3, 2); //Owner

    // set the permision input text
    document.getElementById('let').value = perm_string;

  } else if (caller_was_let) {
    // get the text input
    let perm_text = document.getElementById('let').value;

    num1 = text_to_check_and_octal(perm_text.substring(0,3), 0)
    num2 = text_to_check_and_octal(perm_text.substring(3,6), 3)
    num3 = text_to_check_and_octal(perm_text.substring(6,9), 6)

    // set the octal value
    document.getElementById('num').value = `${num1}${num2}${num3}`;
  }

}


// define a function to converts the checkbox # to the respective permissions
// returns perm_num, perm_let
function check_to_octal_and_text(check_num) {
  let perm_num = 0;
  let perm_let = '-';

  switch (check_num) {
    case 1:
    case 4:
    case 7:
      perm_num = 4;
      perm_let = 'r';

      break;
    case 2:
    case 5:
    case 8:
      perm_num = 2;
      perm_let = 'w';

      break;
    case 3:
    case 6:
    case 9:
      perm_num = 1;
      perm_let = 'x';

      break;
    default:
      perm_num = 0;
      perm_let = '-';
  }
  // return values
  return {
      perm_num,
      perm_let
  };
}


/**
  Takes a number 1-7 and which class it is in:
  0 = owner
  1 = Group
  2 = Public

  Returns: perm text (ex. "rwx") and sets the appropriate checkboxes
*/
function octal_to_check_and_txt(octal_num, class_num) {
  let perm_text = '';
  let offset = class_num*3;

  switch (octal_num) {
    case '1':
      document.getElementById(`${1 + offset}`).checked = false;
      document.getElementById(`${2 + offset}`).checked = false;
      document.getElementById(`${3 + offset}`).checked = true;
      perm_text = '--x';
      break;

    case '2':
      document.getElementById(`${1 + offset}`).checked = false;
      document.getElementById(`${2 + offset}`).checked = true;
      document.getElementById(`${3 + offset}`).checked = false;
      perm_text = '-w-';
      break;

    case '3':
      document.getElementById(`${1 + offset}`).checked = false;
      document.getElementById(`${2 + offset}`).checked = true;
      document.getElementById(`${3 + offset}`).checked = true;
      perm_text = '-wx';
      break;

    case '4':
      document.getElementById(`${1 + offset}`).checked = true;
      document.getElementById(`${2 + offset}`).checked = false;
      document.getElementById(`${3 + offset}`).checked = false;
      perm_text = 'r--';
      break;

    case '5':
      document.getElementById(`${1 + offset}`).checked = true;
      document.getElementById(`${2 + offset}`).checked = false;
      document.getElementById(`${3 + offset}`).checked = true;
      perm_text = 'r-x';
      break;

    case '6':
      document.getElementById(`${1 + offset}`).checked = true;
      document.getElementById(`${2 + offset}`).checked = true;
      document.getElementById(`${3 + offset}`).checked = false;
      perm_text = 'rw-';
      break;

    case '7':
      document.getElementById(`${1 + offset}`).checked = true;
      document.getElementById(`${2 + offset}`).checked = true;
      document.getElementById(`${3 + offset}`).checked = true;
      perm_text = 'rwx';
      break;

    default:
      document.getElementById(`${1 + offset}`).checked = false;
      document.getElementById(`${2 + offset}`).checked = false;
      document.getElementById(`${3 + offset}`).checked = false;
      perm_text = '---';
  }
  return perm_text;
}


/**
  Takes 3 letters (r, w, x, -    ex. 'rw-') and an offset (0,3,6)
  Returns the octal num and sets the appropriate checkboxes
*/
function text_to_check_and_octal(letters, offset) {
  let perm_num = 0; // the octal number to return

  // add up the oct num and set the check boxes
  for (let i = 0; i < 3; i++) {
    current_let = letters.substring(i, i+1);
    if (current_let == 'r') {
      document.getElementById(`${i + 1 + offset}`).checked = true;
      perm_num += 4;
    } else if (current_let == 'w') {
      document.getElementById(`${i + 1 + offset}`).checked = true;
      perm_num += 2;
    } else if (current_let == 'x') {
      document.getElementById(`${i + 1 + offset}`).checked = true;
      perm_num += 1;
    } else {
      document.getElementById(`${i + 1 + offset}`).checked = false;
    }
  }

  return perm_num;
}
