  // Initialize Firebase
  var config = {
      apiKey: "AIzaSyDCVDH2-nZ4FqIz729OtIeUbW4kiLlRchU",
      authDomain: "pokemon-514c2.firebaseapp.com",
      databaseURL: "https://pokemon-514c2.firebaseio.com",
      projectId: "pokemon-514c2",
      storageBucket: "pokemon-514c2.appspot.com",
      messagingSenderId: "946348086330"
  };
  firebase.initializeApp(config);


  //---------------------------------------------------------------------------
  //
  // list of all the stupid global variables 
  //
  //---------------------------------------------------------------------------

  var database = firebase.database()
      /*  var connectionsRef = database.ref("/connections")
        var connectedRef = database.ref(".info/connected")
        var stage = database.ref("/stage")*/
  var currentPlayerNumber = 0;
  var thisPlayerNumber = 0;
  var playerId_;
  var postKey;
  var player1Choice;
  var player2Choice;
  var postKey = [];
  postKey = database.ref().push().key
  console.log(postKey)

  //---------------------------------------------------------------------------
  //
  // everytime a new connection happens, add it to firebase
  //
  //---------------------------------------------------------------------------


  data = {
      choice: ""
  }

  function pushUserToFirebase() {
      database.ref(postKey).set(data)
      database.ref(postKey).onDisconnect().remove()
  }


  pushUserToFirebase()


  //---------------------------------------------------------------------------
  //
  // use this function to determine currentPlayerNumber...too lazy to clean it right now 
  //
  //---------------------------------------------------------------------------


  database.ref().on("value", function(snap) {

      var temp = snap.val()
      console.log(temp[postKey])
      if (snap.numChildren() >= 3) {
          /*          console.log("more than 2 players")*/
          $("#connected-users").html("more than 2 players")
      } else {
          currentPlayerNumber = snap.numChildren()
          $("#connected-users").html(currentPlayerNumber)

      } 
  })

  //---------------------------------------------------------------------------
  //
  // RPS logic 
  //
  //---------------------------------------------------------------------------


  var testChoice1 = "Rock"
  var testChoice2 = "Paper"
  var testChoice3 = "Scissors"
  var choices = ["Rock", "Paper", "Scissors"]
  var map = {};


  choices.forEach(function(choice, i) {
      map[choice] = {};
      map[choice][choice] = "Was a tie"
      map[choice][choices[(i + 1) % 3]] = choices[(i + 1) % 3] + " wins!"
      map[choice][choices[(i + 2) % 3]] = choice + " wins!"
  })

  function compare(choice1, choice2) {
      return (map[choice1] || {})[choice2] || "Waiting for other user to select a choice...";
  }


  function whenChoiceIsPicked() {
      database.ref().on("value", function(snap) {
          console.log(snap.val())
              /*      snap.forEach(function(snapChild){
                      var childKey = snapChild.key;
                      var childData = snapChild.val();
                      console.log(childKey)
                      console.log(childData)
                    })*/
      })
  }
  /*
    console.log(map)
    console.log(compare(testChoice1, testChoice3))
  */
  $(document).on("click", "#rock", function(event) {
      event.preventDefault();
      database.ref(postKey).set({
          choice: "rock"
      })
      whenChoiceIsPicked()
  })

  $(document).on("click", "#paper", function(event) {
      event.preventDefault();
      database.ref(postKey).set({
          choice: "paper"
      })
      console.log("paper works")
      whenChoiceIsPicked()


  })
  $(document).on("click", "#scissors", function(event) {
      event.preventDefault();
      database.ref(postKey).set({
          choice: "scissors"
      })
      console.log("scissors works")
      whenChoiceIsPicked()


  })
