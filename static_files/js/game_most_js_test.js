$(function(){
    $("#navbarToggleButton").blur(
       function(event){
           var scrinWidth = window.visualViewport.width;
           if (scrinWidth < 768){
              $("#myNavbar").collapse('hide');
           };
       }
    )
 });
 
 function changeFloat (){
     var formLoginNode = document.getElementById("input_form_login");
     if (formLoginNode.classList.contains("inputFormHidden")){
         hideForm("input_form_sign_up");
         showForm("input_form_login");
     }else{
         hideForm("input_form_login");
         showForm("input_form_sign_up");
     };
 };
 function logout(){
    dataForRequest = new Object();
    dataForRequest.typeOfRequest ="GET";
    $ajaxUtils.sendGetRequest("/logout", logoutServerResponse,dataForRequest);
 };

 function signUpForm(){
      var signUpForm = document.getElementById("input_form_sign_up");
      signUpForm.style.visibility = "visible";
      stopBubbles(event);
 };
 function loginServer(){
    var login = document.getElementById("login_log").value;
    var psw = document.getElementById("password_log").value;
    dataForRequest = new Object();
    dataForRequest.typeOfRequest ="formData";
    dataForRequest.login = login;
    dataForRequest.password = psw;
    $ajaxUtils.sendGetRequest("/login_ajax",loginServerResponse,dataForRequest);
 };
 function changeCssClassOfElement(elementID,currentClass,newClass){
      console.log(elementID);
      var elementHTMLClasses = document.getElementById(elementID).classList;
      if (!elementHTMLClasses.contains(newClass)){
         elementHTMLClasses.add(newClass);
      };
      if (elementHTMLClasses.contains(currentClass)){
         elementHTMLClasses.remove(currentClass);
      };
 };
 function hideFormXS(elementID){
     changeCssClassOfElement(elementID,"input_form_visible_xs","input_form_hidden_xs");
 };
 function showFormXS(elementID){
     changeCssClassOfElement(elementID,"input_form_hidden_xs","input_form_visible_xs");
 };
 function hideForm(elementID){
     changeCssClassOfElement(elementID,"inputFormVisible","inputFormHidden");
 };
 function showForm(elementID){
     changeCssClassOfElement(elementID,"inputFormHidden","inputFormVisible");
 };
 function logoutServerResponse(request){
    var logoutLabel = document.getElementById("logoutLabel");
    logoutLabel.innerHTML ="";
    logged_in = false;
 };
 var loginServerResponse = function(request){window.setTimeout(loginServerResponse,1000)};
 CardValues = {0:2,1:3,2:4,3:5,4:6,5:7,6:8,7:9,8:10,9:10,10:10,11:10,12:11};
 function RandomSort(a,b){
                              return (Math.random() - 0.5);
                          };
 function Desk(number_of_cards){
    this.cards = [];
    var counter = 0;
    while (counter < 13){
       var counter_suits = 0;
       while (counter_suits < 4){
           this.cards.push(new Card(counter,counter_suits,0));
           counter_suits +=1;
       };
       if (number_of_cards == 36 && counter == 0){
            counter += 5;
       }else{
            counter += 1;
         };
       };
    this.cards.sort(RandomSort);
    this.takeCard = function(){
        return this.cards.pop();
    };
    this.takeCard = function(){
        return this.cards.pop();
    };
    this.getCards = function(){
        return this.cards;
    };
    this.getFirstCard = function(){
        return this.cards[0];
    };
    this.getLenCards = function(){
        return this.cards.length;
    };
 };

 function Card(rang,suit,value)
      {
         this.rang = rang;
         this.suit = suit;
         this.value = value;
         this.getValue = function()
              {
                  return this.value;
              };
         this.getRang = function()
              {
                  return this.rang;
              };
         this.setValue = function(value)
              {
                  this.value = value;
              };
         this.getSuit = function()
              {
                 return this.suit;
              };
      };
 function Hand()
 {
      this.cards = [];
      this.giveCard = function(card){
          this.cards.push(card);
      };
      this.clearHand = function(){
          this.cards = [];
      };
      this.getLength = function(){
          return this.cards.length;
      };
      this.getCardsInHand = function(){
          return this.cards;
      };
      this.getValuesOfHand = function(){
          var value =0;
          for (card in this.cards){
               value += this.cards[card].getValue();
          };
          return value;
      };
 };
 function  getCardToHand(hand,desk){
        var card = desk.takeCard();
        var value = CardValues[card.getRang()];
        if (value == 11 && hand.getValuesOfHand()>10){
              card.setValue(1);
        }else{
              card.setValue(value);
              hand.giveCard(card);
        };
 };

 function initGame(){
     var roundIsOngoing = false;
     var busted = false;
     var GameDesk,GameStarted;
     var buttonDeal = document.getElementById("b_deal");
     var buttonHit = document.getElementById("b_hit");
     var buttonStand = document.getElementById("b_stand");
     var buttonBet = document.getElementById("b_bet");
     var gameControlActions = document.getElementById("gameControlActions");
     var gameControlBet = document.getElementById("gameControlBet");
     var gameControlSlider = document.getElementById("gameControlSlider");
     var PlayerHand = new Hand();
     var DealerHand = new Hand();
     var sliderRange = document.getElementById("sliderRange");
     var betInSlider = 1;
     var betInGame = 1;
     var resultOfTheRoundStr = "";
     function resultOfRound(playerLose)
     {
              roundIsOngoing =false;
              buttonDeal.style.backgroundColor = "";
              gameControlActions.style.visibility = "hidden";
              gameControlBet.style.visibility = "visible";
              gameControlSlider.style.visibility = "visible";
              dataForRequest = new Object();
              dataForRequest.bet = betInGame;
              dataForRequest.typeOfRequest ="formData";
              if (playerLose || (!(DealerHand.getValuesOfHand()>21) && DealerHand.getValuesOfHand()>=PlayerHand.getValuesOfHand()))
              {
                         dataForRequest.won = false;
                         resultOfTheRoundStr = "lose " + betInGame;
               }else
               {
                         dataForRequest.won = true;
                          resultOfTheRoundStr = "win " + betInGame;
               };

               $ajaxUtils.sendGetRequest('/ajax_sent_result',resultGameHandler,dataForRequest);
     };
     function deal()
     {

         if (!roundIsOngoing)
         {
              resultOfTheRoundStr = "";
              GameDesk = new Desk(52);
              PlayerHand = new Hand();
              DealerHand = new Hand();
              GameStarted = true;
              getCardToHand(PlayerHand,GameDesk);
              getCardToHand(PlayerHand,GameDesk);
              getCardToHand(DealerHand,GameDesk);
              getCardToHand(DealerHand,GameDesk);
              roundIsOngoing = true;
              busted = false;
              gameControlActions.style.visibility = "visible";
              gameControlBet.style.visibility = "hidden";
              gameControlSlider.style.visibility = "hidden";
              drawCanvasAnimation();
         };
     };
     function stand()
     {
        if (roundIsOngoing)
        {
                 while (DealerHand.getValuesOfHand() < 17)
                 {
                     getCardToHand(DealerHand,GameDesk);
                 };
                 resultOfRound(false);
                 drawCanvasAnimation();
        };
     };

     function hit()
     {
          if (roundIsOngoing)
          {
                getCardToHand(PlayerHand,GameDesk)
                if (PlayerHand.getValuesOfHand()>21){
                    busted = true;
                    resultOfRound(true);
                };
                drawCanvasAnimation();
          };
     };
     function bet() {
          betInGame = betInSlider;
          drawCanvasAnimation();
     };
     var resultGameHandler = function (request){
         result_obj = JSON.parse(request.responseText);
         money += result_obj.bet*(Number(result_obj.won)*2-1);
         betInSlider = 1;
         betInGame = 1;
         sliderRange.setAttribute("max",money);
         drawCanvasAnimation();
     };
     function sign_up(){
     };
     buttonDeal.addEventListener("mousedown",deal);
     buttonHit.addEventListener("mousedown",hit);
     buttonStand.addEventListener("mousedown",stand);
     buttonBet.addEventListener("mousedown",bet);
     sliderRange.oninput = function setValueInBet(){
         betInSlider = sliderRange.value;
         drawCanvasAnimation();
     };
     loginServerResponse = function (request){
             var notification = "";
             var responseObj = JSON.parse(request.responseText);
             if (!responseObj.userSigned){
                 notification = "Such login hasn't signed in";
             }else if(!responseObj.correctPassword){
                 notification = "Password isn't correct";
             }else{
                var loginLabel = document.getElementById("logoutLabel");
                loginLabel.innerHTML = responseObj.login;
                money = responseObj.money;
                betInSlider = 1;
                betInGame = 1;
                sliderRange.setAttribute("max",money);
                var login_form = document.getElementById("input_form_login");
                login_form.style.visibility = "hidden";
                return;
             };
             var loginFieldset = document.getElementById("input_fieldset");
             var notificationDiv = document.createElement("div");
             notificationDiv.innerHTML = notification;
             loginFieldset.appendChild(notificationDiv);
     };
     var cardsImage = document.createElement("img");
     var tableImage = document.createElement('img');
     var imageGameScore = document.createElement("img");
     var balanceImage = document.createElement("img");
     var sliderButton = document.createElement("img");
     var sliderCashBase = document.createElement("img");
     function drawCanvasAnimation()
     {
          var tileWidth = 144;
          var tileHeigth = 201;
          var drawingCanvas = document.getElementById('gameCanvas');
          if(drawingCanvas && drawingCanvas.getContext) {
              var context = drawingCanvas.getContext('2d');
              drawingCanvas.setAttribute('width',tableImage.width/3);
              drawingCanvas.setAttribute('height',tableImage.height/3);
              context.drawImage(tableImage,0,0,tableImage.width,tableImage.height,0,0,tableImage.width/3,tableImage.height/3);
              var counter = 0;
              var cards = PlayerHand.getCardsInHand();
              var playerHandX = 410 - Math.floor(cards.length/2)*tileWidth*0.1;
              for ( i = 0;i<cards.length;i++)
              {
                  context.setTransform(1,0,0,1,0,0);
                  var rad_angle;
                  if ((cards.length-1)/2 == i)
                  {
                      rad_angle =0;
                  }
                  else if(Math.round(i/cards.length)==0)
                  {
                      rad_angle = -5*(Math.floor(cards.length/2)-i);
                  }
                  else
                  {
                      rad_angle = 5*(i-Math.ceil(cards.length/2)+1);
                  };
                  context.translate(playerHandX+i*tileWidth*0.1 + 0.5*(tileWidth/3),240+ 0.5*(tileHeigth/3));
                  context.rotate(Math.ceil(cards.length/2)*rad_angle*(Math.PI/180));
                  context.drawImage(cardsImage,57+(tileWidth+11)*(cards[i].getRang()%7),258+ ((tileHeigth+16)*2+36)*cards[i].getSuit()+Math.floor(cards[i].getRang()/7)*(tileHeigth+16),tileWidth,tileHeigth,-0.5*tileWidth/3,-0.5*tileHeigth/3,tileWidth/3,tileHeigth/3);
              };
              context.setTransform(1,0,0,1,0,0);
              counter = 0;
              cards = DealerHand.getCardsInHand();
              if(roundIsOngoing){
                  context.drawImage(cardsImage,57+(tileWidth+11)*6, 258+tileHeigth+16,tileWidth,tileHeigth,410 - Math.ceil(cards.length/2)*tileWidth*0.1,70,tileWidth/3,tileHeigth/3);
              };
              for ( i = 0;i<cards.length;i++)
              {
                   if (!(i==0&&roundIsOngoing)){
                          context.drawImage(cardsImage,57+(tileWidth+11)*(cards[i].getRang()%7),258+ ((tileHeigth+16)*2+36)*cards[i].getSuit()+Math.floor(cards[i].getRang()/7)*(tileHeigth+16),tileWidth,tileHeigth,410- Math.ceil(cards.length/2)*tileWidth*0.1+i*tileWidth*0.1,70,tileWidth/3,tileHeigth/3);
                   };
              };
              context.drawImage(imageGameScore,410,140,50,26);
              context.drawImage(imageGameScore,410,215,50,26);
              var playerScoreText = "" + PlayerHand.getValuesOfHand();
              var dealerScoreText = "" + DealerHand.getValuesOfHand();
              context.font ="bold 16px serif";
              var dealerScoreTextMetrics = context.measureText(dealerScoreText);
              var playerScoreTextMetrics = context.measureText(playerScoreText);
              dealerScoreTextX = 435 - dealerScoreTextMetrics.width/2;
              playerScoreTextX = 435 - playerScoreTextMetrics.width/2;
              if (!roundIsOngoing){
                 context.fillText(dealerScoreText,dealerScoreTextX,158);
              };
              context.fillText(playerScoreText,playerScoreTextX,233);
              context.drawImage(balanceImage,0,0,180,90);
              context.fillStyle = "#FFFF00";
              context.font ="25px monospace";
              var gradient = context.createLinearGradient(70,35,70,50);
              gradient.addColorStop(0,"#f1e5b0");
              gradient.addColorStop(0.5,"#8e5e19");
              gradient.addColorStop(1,"#f1e5b0");
              context.fillStyle = gradient;
              var metrics = context.measureText(money);
              context.fillText(money,75 - metrics.width/2,50);
              var gradient = context.createLinearGradient(70,68,70,78);
              gradient.addColorStop(0,"#f1e5b0");
              gradient.addColorStop(0.5,"#8e5e19");
              gradient.addColorStop(1,"#f1e5b0");
              context.fillStyle = gradient;
              context.font ="20px monospace";
              var metrics = context.measureText(betInGame);
              context.fillText(betInGame,85 - metrics.width/2,78);
              if (resultOfTheRoundStr){
                  context.font ="50px monospace"
                  var metrics = context.measureText(resultOfTheRoundStr);
                  context.fillText(resultOfTheRoundStr,435 - metrics.width/2,200);
              };
              if (!roundIsOngoing){
              context.drawImage(sliderButton,252,320,348,118);
              context.drawImage(sliderCashBase,330,340,200,40);
              var metrics = context.measureText(betInSlider);
              context.fillStyle = "black";
              context.font ="25px monospace";
              context.fillText(betInSlider,430 - metrics.width/2,368);
              };
          };

     };

     var images = 0;
     var detectLoading = function (){
          images++;
          console.log;
          if (images == 6){
            drawCanvasAnimation();
          };
     };
     cardsImage.src = "/static/images/Small_Cards.png";
     tableImage.src ="/static/images/table.jpg";
     imageGameScore.src = "/static/images/resultBox.png";
     balanceImage.src ="/static/images/balance.png";
     sliderButton.src="/static/images/SliderBase.png";
     sliderCashBase.src="/static/images/SliderCashBase.png";
     tableImage.onload = detectLoading;
     cardsImage.onload = detectLoading;
     imageGameScore.onload = detectLoading;
     balanceImage.onload = detectLoading;
     sliderButton.onload = detectLoading;
     sliderCashBase.onload = detectLoading;



 };

window.onload = function() {

 initGame();
};
window.onbeforeunload = function(){
var buttonLogout = window.getElementById("buttonLogout");
alert("some");
};