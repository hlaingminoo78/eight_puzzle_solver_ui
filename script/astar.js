let initNode;
let descNode;
let currentNode;
let initPuzzleArray;
let descPuzzleArray;

// -save the path to the solution
let pathSolution = [];

// -to-search list
let openList = [];

// -already searched list
let closedList = [];

// -save number of iterations
let looping;

// -store html element to show looping count in html
let loopingText;

// -to check if the puzzle is already found
let alreadyFound = false;

function setup() {
  const canvasWidth = 300;
  const canvasHeight = 300;

  // -puzzle initialization
  initPuzzleArray = [1, 2, 5, 3, 4, 0, 6, 7, 8];
  descPuzzleArray = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  // -create p5 canvas
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent("canvas_container");

  // -buttons declaration
  let pauseButton, newButton, restartButton, startButton;

  // -buttons initialization
  loopingText = createSpan(looping);
  // -place the span tag inside the element with id (loop_count)
  loopingText.parent("loop_count");

  startButton = createButton("Start");
  startButton.parent("start_button");
  // -if the button is clicked, then start the looping
  startButton.mousePressed(() => {
    // -if already found, then do nothing
    if (alreadyFound) {
      alert("Puzzle is already solved!");
      // -return will not execute next lines of code and exit immediately
    } else {
      // -start the looping function (draw)
      loop();
    }
  });

  pauseButton = createButton("Pause");
  pauseButton.parent("pause_button");
  // -if the button is clicked, then stop the looping
  pauseButton.mousePressed(() => noLoop());

  newButton = createButton("Create Puzzle");
  newButton.parent("new_button");
  newButton.mousePressed(() => {
    // -get string data from javascript prompt function
    let ownArray = prompt(
      "Seperate value(0-8) by comma! (eg. 1,2,5,3,4,0,6,7,8)"
    );
    // -if the user enter the correct pattern, then continue
    if (
      ownArray != null &&
      ownArray.search(/\d,\d,\d,\d,\d,\d,\d,\d,\d/) != -1
    ) {
      // -split by comma and convert each data to integer
      ownArray = ownArray.split(",").map((elt) => parseInt(elt));
      reset(ownArray);
    } else {
      alert("Please enter the correct data!");
    }
  });

  restartButton = createButton("Restart");
  restartButton.parent("restart_button");
  restartButton.mousePressed(() => {
    noLoop();

    reset([1, 2, 5, 3, 4, 0, 6, 7, 8]);
  });

  noLoop();

  reset(initPuzzleArray);
}

// -function to reset all variables and clear the dom element
function reset(array) {
  initNode = new Node(array, 3);
  descNode = new Node(descPuzzleArray, 3);
  currentNode = initNode;

  currentNode.setStepToGoal(descNode);

  // -display the changed puzzle
  currentNode.display();

  // -reset all variables
  looping = 0;
  alreadyFound = false;
  openList = [];
  pathSolution = [];
  closedList = [];

  openList.push(currentNode);

  // -clear the solution steps
  document.getElementById("solution_steps").innerHTML = "";

  // -set loop count back to 0
  loopingText.html(looping);
}

function draw() {
  // -keep find until there are elements in to-search list
  if (openList.length > 0) {
    // -show current loop count
    loopingText.html(looping);

    // -find and get the node with lowest cost and its index in the to-search list
    currentNode = openList[0];
    let currentNodeIndex = 0;
    for (let i = 1; i < openList.length; i++) {
      if (openList[i].cost < currentNode.cost) {
        currentNode = openList[i];
        currentNodeIndex = i;
      }
    }

    // -display current puzzle
    currentNode.display();

    // -if this puzzle is the goal, then trace the path to the root
    if (currentNode.isSame(descNode)) {
      let newNode = currentNode;
      pathSolution.push(newNode);
      while (newNode.parent != null) {
        pathSolution.push(newNode.parent);
        newNode = newNode.parent;
      }

      console.log(`Goal Found! Total Looping = ${looping}`);
      console.log("Solution = ", pathSolution);

      // -empty the openList
      openList.splice(0, openList.length);

      alreadyFound = true;

      noLoop();

      // -display solution steps on webpage
      for (let i = pathSolution.length - 1; i >= 0; i--) {
        pathSolution[i].displayOnHtml();
      }

      return;
    }
    // -remove the first node from the searched list
    openList.splice(currentNodeIndex, 1);

    // -mark the first node as already-searched node
    closedList.push(currentNode);

    // -add the next possible nodes from the current puzzle position
    currentNode.expandChildNodes();

    for (let i = 0; i < currentNode.children.length; i++) {
      // -get the first child of current node
      const currentChild = currentNode.children[i];

      // -if the new child node is neithor in the already-searched list nor to-search list,
      // -then add the new child to to-search list
      if (
        !currentChild.isContain(closedList) &&
        !currentChild.isContain(openList)
      ) {
        // -update toGoal steps
        currentChild.setStepToGoal(descNode);

        openList.push(currentChild);
      }
    }
    // -increse the loop count
    looping++;
  } else {
    console.log(`Goal Not Found! Total Looping = ${looping}`);
    alreadyFound = false;
    noLoop();
    return;
  }
}
