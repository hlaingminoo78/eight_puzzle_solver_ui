class Node {
  constructor(
    puzzle,
    columnCount,
    cellWidth = 100,
    cellHeight = 100,
    foreground = 255,
    background = 100
  ) {
    // -children save nodes which contains the next possible puzzles from this node
    this.children = [];

    // -parent save where this node come from
    this.parent = null;

    // -puzzle save all cells data
    this.puzzle = [];

    // -add all cells to puzzle
    let k = 0;
    for (let i = 0; i < columnCount; i++) {
      for (let j = 0; j < columnCount; j++) {
        this.puzzle.push(
          new Cell(
            j * cellWidth,
            i * cellHeight,
            puzzle[k],
            cellWidth,
            cellHeight,
            foreground,
            background
          )
        );
        k++;
      }
    }

    // -columnCount refer to the number of columns
    this.columnCount = columnCount;

    // -blankPosition refer to index of blank (0) position
    this.blankPosition = null;

    // -direction save how this puzzle is formed from parent
    this.direction = "START";

    // -set the blank blankPosition
    for (let i = 0; i < puzzle.length; i++) {
      if (puzzle[i] == 0) this.blankPosition = i;
    }

    // -fromRoot save how step far from the root node (h-function)
    this.fromRoot = 0;

    // -toGoal save how step away to the goal node (g-function)
    this.toGoal = 99999;
  }

  // -function to swap two values in the Array
  swap(index, blankIndex) {
    let temp = this.puzzle[index].value;
    this.puzzle[index].value = this.puzzle[blankIndex].value;
    this.puzzle[blankIndex].value = temp;

    // -set the blank blankPosition again
    this.blankPosition = blankIndex;
  }

  // -function to get each cell value of the puzzle
  getPuzzleArray() {
    let puzzleArray = [];
    for (let i = 0; i < this.puzzle.length; i++) {
      puzzleArray.push(this.puzzle[i].value);
    }
    return puzzleArray;
  }

  // -add the next new possible node from this current puzzle position
  // -you can move at most 4 moves
  expandChildNodes() {
    // -moving left
    // -blank position : 2, 5, 8 cannot go right
    if (this.blankPosition % this.columnCount < this.columnCount - 1) {
      // -initialize new puzzle
      let newpuzzArray = this.getPuzzleArray();

      // -create new child node with new puzzle
      let child = new Node(newpuzzArray, this.columnCount);

      // -swap the blank space and right value
      child.swap(this.blankPosition, this.blankPosition + 1);

      // -set the direction
      child.direction = "LEFT";

      // -set this node as the parent of the new child node
      child.parent = this;

      // -child node is one step far from parent node, so add 1
      child.fromRoot = this.fromRoot + 1;

      // -add new child to the children list of this node
      this.children.push(child);
    }

    // -moving right
    // -blank position : 0, 3, 6 cannot go left

    if (this.blankPosition % this.columnCount != 0) {
      // -initialize new puzzle
      let newpuzzArray = this.getPuzzleArray();

      // -create new child node with new puzzle
      let child = new Node(newpuzzArray, this.columnCount);

      // -swap the blank space and left value
      child.swap(this.blankPosition, this.blankPosition - 1);

      // -set the direction
      child.direction = "RIGHT";

      // -set this node as the parent of the new child node
      child.parent = this;

      // -child node is one step far from parent node, so add 1
      child.fromRoot = this.fromRoot + 1;

      // -add new child to the children list of this node
      this.children.push(child);
    }

    // -moving down
    // -position : 0, 1, 2 cannot go up
    if (this.blankPosition - this.columnCount >= 0) {
      // -initialize new puzzle
      let newpuzzArray = this.getPuzzleArray();

      // -create new child node with new puzzle
      let child = new Node(newpuzzArray, this.columnCount);

      // -swap the blank space and down value
      child.swap(this.blankPosition, this.blankPosition - 3);

      // -set the direction
      child.direction = "DOWN";

      // -set this node as the parent of the new child node
      child.parent = this;

      // -child node is one step far from parent node, so add 1
      child.fromRoot = this.fromRoot + 1;

      // -add new child to the children list of this node
      this.children.push(child);
    }

    // -moving up
    // -position : 6, 7, 8 cannot go down
    if (this.blankPosition + this.columnCount < this.puzzle.length) {
      // -initialize new puzzle
      let newpuzzArray = this.getPuzzleArray();

      // -create new child node with new puzzle
      let child = new Node(newpuzzArray, this.columnCount);

      // -swap the blank space and up value
      child.swap(this.blankPosition, this.blankPosition + 3);

      // -set the direction
      child.direction = "UP";

      // -set this node as the parent of the new child node
      child.parent = this;

      // -child node is one step far from parent node, so add 1
      child.fromRoot = this.fromRoot + 1;

      // -add new child to the children list of this node
      this.children.push(child);
    }
  }

  // -function to check if a puzzle is already appeared in the list
  isContain(list) {
    for (let i = 0; i < list.length; i++) {
      // -if one of the puzzles in the list matches with this puzzle, then true
      if (this.isSame(list[i])) {
        return true;
      }
    }
    return false;
  }

  // -function to check if the two puzzles are the same
  isSame(node) {
    for (let i = 0; i < node.puzzle.length; i++) {
      if (this.puzzle[i].value != node.puzzle[i].value) {
        return false;
      }
    }
    return true;
  }
  // -function to display the puzzle on canvas
  display() {
    for (let i = 0; i < this.puzzle.length; i++) {
      // noStroke();
      stroke(200);
      if (this.puzzle[i].value == 0) {
        fill(255, 0, 0);
      } else {
        fill(this.puzzle[i].background);
      }
      rect(
        this.puzzle[i].x,
        this.puzzle[i].y,
        this.puzzle[i].width,
        this.puzzle[i].height
      );
      fill(this.puzzle[i].foreground);
      textAlign(CENTER, CENTER);
      textSize(24);
      text(
        this.puzzle[i].value,
        this.puzzle[i].x + this.puzzle[i].width / 2,
        this.puzzle[i].y + this.puzzle[i].height / 2
      );
    }
  }

  // -function to display the puzzle in html
  displayOnHtml() {
    let xml = "";
    xml +=
      "<p class='step_button'>" +
      this.direction +
      " ></p><table class='solution_steps_table'><tr><td>" +
      this.puzzle[0].value +
      "</td><td>" +
      this.puzzle[1].value +
      "</td><td>" +
      this.puzzle[2].value +
      "</td></tr><tr><td>" +
      this.puzzle[3].value +
      "</td><td>" +
      this.puzzle[4].value +
      "</td><td>" +
      this.puzzle[5].value +
      "</td></tr><tr><td>" +
      this.puzzle[6].value +
      "</td><td>" +
      this.puzzle[7].value +
      "</td><td>" +
      this.puzzle[8].value +
      "</td></tr></table>";
    let paragraph = createDiv(xml);
    paragraph.parent("solution_steps");
    paragraph.addClass("vertical_align_center");
  }

  // -function to calculate how many step this node needs to go to reach goal
  // -use manhattan distance
  setStepToGoal(goal) {
    let positionCurrent = [];
    let positionGoal = [];
    let step = 0;
    let k = 0;
    // -save x and y value to calculate manhattan distance later
    for (let i = 0; i < this.columnCount; i++) {
      for (let j = 0; j < this.columnCount; j++) {
        positionCurrent.push({ x: j, y: i, value: this.puzzle[k].value });
        positionGoal.push({ x: j, y: i, value: goal.puzzle[k].value });
        k++;
      }
    } // -sort the two array with its value attributes
    positionCurrent = positionCurrent.sort((a, b) => a.value - b.value);
    positionGoal = positionGoal.sort((a, b) => a.value - b.value);

    // -calculate distance
    for (let i = 0; i < this.puzzle.length; i++) {
      step +=
        Math.abs(positionCurrent[i].x - positionGoal[i].x) +
        Math.abs(positionCurrent[i].y - positionGoal[i].y);
    }

    this.toGoal = step;
  }
  // -get total cost (f=g+h)
  get cost() {
    return this.fromRoot + this.toGoal;
  }
}
