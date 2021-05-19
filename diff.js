let diffText = '';

//initialize a 2D array with predefined row and column numbers
const makeArray = (a, b) => {
  const arr = new Array(a);
  for (let i = 0; i < a; i++) arr[i] = new Array(b);
  return arr;
};

//display the difference between 2 array of words
const showDiff = (S1, S2, m, n, LCSLookupTable) => {
  console.log(diffText);
  // if the last word of sentence 1 and sentence 2 matches
  if (m > 0 && n > 0 && S1[m - 1] == S2[n - 1]) {
    showDiff(S1, S2, m - 1, n - 1, LCSLookupTable);
    console.log(S1[m - 1]);
    diffText = diffText + (' ' + S1[m - 1]);
  }

  // if the current word of sentence 2 is not present in sentence 1
  else if (
    n > 0 &&
    (m == 0 || LCSLookupTable[m][n - 1] >= LCSLookupTable[m - 1][n])
  ) {
    console.log(LCSLookupTable[m][n - 1]);
    console.log(LCSLookupTable[m - 1][n]);
    console.log(S2[n - 1]);
    showDiff(S1, S2, m, n - 1, LCSLookupTable);
    diffText = diffText + (' <span class="green">' + S2[n - 1] + '</span>');
  }

  // if the current word of sentence 1 is not present in sentence 2
  else if (
    m > 0 &&
    (n == 0 || LCSLookupTable[m][n - 1] < LCSLookupTable[m - 1][n])
  ) {
    console.log(LCSLookupTable[m][n - 1]);
    console.log(LCSLookupTable[m - 1][n]);
    console.log(S1[m - 1]);
    showDiff(S1, S2, m - 1, n, LCSLookupTable);
    diffText = diffText + (' <span class="red">' + S1[m - 1] + '</span>');
  }
};

// Function to fill the LCSLookupTable table by finding the length of longest common subsequence
const LCSLength = (S1, S2, m, n, LCSLookupTable) => {
  // first column of the LCSLookupTable table will be all 0
  for (let i = 0; i <= m; i++) {
    LCSLookupTable[i][0] = 0;
  }

  // first row of the LCSLookupTable table will be all 0
  for (let j = 0; j <= n; j++) {
    LCSLookupTable[0][j] = 0;
  }

  // fill the LCSLookupTable table in a bottom-up manner
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // if current word of sentence 1 and sentence 2 matches
      if (S1[i - 1] == S2[j - 1]) {
        LCSLookupTable[i][j] = LCSLookupTable[i - 1][j - 1] + 1;
      }
      // otherwise, if the current character of sentence 1 and sentence 2 don't match
      else {
        LCSLookupTable[i][j] = Math.max(
          LCSLookupTable[i - 1][j],
          LCSLookupTable[i][j - 1]
        );
      }
    }
  }
  /*   console.log(LCSLookupTable);
  for (var i = 0; i < LCSLookupTable[i].length; i++) {
    for (var z = 0; z < LCSLookupTable.length; z++) {
      console.log(LCSLookupTable[z][i]);
    }
  } */
};

//handler for "diff" button
$('#diffButton').click(() => {
  diffText = '';
  const P1 = $('textarea#originalTA')
    .val()
    //divide paragraph into array of sentences
    .replace(/([.?!])\s*(?=[A-Z])/g, '$1|')
    .split('|');
  const P2 = $('textarea#modifiedTA')
    .val()
    //divide paragraph into array of sentences
    .replace(/([.?!])\s*(?=[A-Z])/g, '$1|')
    .split('|');

  // if P1 is longer or equal in length, P2[i] will be undefined and P2[i] cannot split
  if (P1.length >= P2.length) {
    for (let i = 0; i < P1.length; i++) {
      //divide sentence into array of words
      const S1 = P1[i].split(' ');
      let S2;
      if (P2[i] === undefined) {
        S2 = '';
      } else {
        S2 = P2[i].split(' ');
      }

      const LCSLookupTable = makeArray(S1.length + 1, S2.length + 1);

      // fill LCSLookupTable table
      LCSLength(S1, S2, S1.length, S2.length, LCSLookupTable);
      console.log(LCSLookupTable);

      // find the difference
      showDiff(S1, S2, S1.length, S2.length, LCSLookupTable);
    }
  } else {
    for (let i = 0; i < P2.length; i++) {
      //divide sentence into array of words
      let S1;
      if (P1[i] === undefined) {
        S1 = '';
      } else {
        S1 = P1[i].split(' ');
      }

      const S2 = P2[i].split(' ');

      const LCSLookupTable = makeArray(S1.length + 1, S2.length + 1);

      // fill LCSLookupTable table
      LCSLength(S1, S2, S1.length, S2.length, LCSLookupTable);

      // find the difference
      showDiff(S1, S2, S1.length, S2.length, LCSLookupTable);
    }
  }

  //diffText is accumulated and now show
  $('#result').html(diffText);
});
