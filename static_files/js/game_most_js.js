
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

        /*This object allows easily scale groups of buttons as canvas resizing.
        id means id of corresponding html element*/
        class GameControlGroup{
            constructor(id, top, left, width, height){
                this.id = id;
                this.top = top;
                this.left = left;
                this.width = width;
                this.height = height;
            }
            static scaleObjects(objects, scaleRatio){
                for (let i = 0; i < objects.length;i++){
                    objects[i].scale(scaleRatio);
                }
            }
            scale(scaleRatio){
                const newTop = this.top * scaleRatio;
                const newLeft = this.left * scaleRatio;
                const newWidth = this.width * scaleRatio;
                const newHeight = this.height * scaleRatio;
                const htmlElement = document.getElementById(this.id);
                if (this.top !== undefined){
                    htmlElement.style.top = `${newTop}px`;
                };
                if (this.left!== undefined){
                    htmlElement.style.left = `${newLeft}px`;
                };
                if (this.width !== undefined){
                    htmlElement.style.width = `${newWidth}px`;
                };
                if (this.height !== undefined){
                    htmlElement.style.height = `${newHeight}px`;
                };
            }
        }
        var resultGameHandler;

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
            const canvasEl = document.getElementById('gameCanvas');
            //variables store the same width and height as CSS #gameCanvas
            const initialCanvasWidth = 867;
            const initialCanvasHeight = 493;
            /*creating objects refering to groups of buttons and their left and top coordinates in absolute display.
            This object allows easily scale groups of buttons as canvas resizing*/
            gameControlObjects = [];
            gameControlObjects.push(new GameControlGroup("gameControlActions", 425, 100, 867, 68));
            gameControlObjects.push(new GameControlGroup("gameControlBet", 425, 200, 867, 68));
            gameControlObjects.push(new GameControlGroup("gameControlSlider", 367, 270, 867, 48));
            gameControlObjects.push(new GameControlGroup("b_hit", undefined, undefined, 152, 50));
            gameControlObjects.push(new GameControlGroup("b_stand", undefined, undefined, 151, 50));
            gameControlObjects.push(new GameControlGroup("b_double", undefined, undefined, 186, 50));
            gameControlObjects.push(new GameControlGroup("b_rebet", undefined, undefined, 148, 50));
            gameControlObjects.push(new GameControlGroup("b_split", undefined, undefined, 153, 50));
            gameControlObjects.push(new GameControlGroup("b_bet", undefined, undefined, 146, 50));
            gameControlObjects.push(new GameControlGroup("b_deal", undefined, undefined, 146, 50));
            gameControlObjects.push(new GameControlGroup("sliderButton", undefined, undefined, 308, 48));
            gameControlObjects.push(new GameControlGroup("sliderRange", undefined, undefined, 308, 48));
            function resultOfRound(playerLose)
            {
                     roundIsOngoing =false;
                     buttonDeal.style.backgroundColor = "";
                     gameControlActions.style.visibility = "hidden";
                     gameControlBet.style.visibility = "visible";
                     gameControlSlider.style.visibility = "visible";
                     dataForRequest = new Object();
                     dataForRequest.bet = betInGame;
                     if (playerLose || (!(DealerHand.getValuesOfHand()>21) && DealerHand.getValuesOfHand()>=PlayerHand.getValuesOfHand()))
                     {
                                dataForRequest.won = false;
                                resultOfTheRoundStr = "lose " + betInGame;
                      }else
                      {
                                dataForRequest.won = true;
                                 resultOfTheRoundStr = "win " + betInGame;
                      };
                      dataForRequest.typeOfRequest="formData"
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
            function resizeCanvas(){
                const canvasEl = document.getElementById('gameCanvas');
                let canvasWidth;
                let canvasHeight;
                if (window.innerWidth/initialCanvasWidth < window.innerHeight/initialCanvasHeight){
                    canvasWidth = window.innerWidth;
                    canvasHeight = (window.innerWidth/initialCanvasWidth) * initialCanvasHeight;
                }else{
                    canvasHeight = window.innerHeight;
                    canvasWidth = (window.innerHeight/initialCanvasHeight) * initialCanvasWidth;
                };
                console.log(canvasWidth);
                console.log(initialCanvasWidth);
                canvasScaleRatio = canvasWidth/initialCanvasWidth;
                GameControlGroup.scaleObjects(gameControlObjects, canvasScaleRatio);
                ctx = canvasEl.getContext("2d");
                ctx.scale(canvasScaleRatio, canvasScaleRatio);
                canvasEl.style.width = `${canvasWidth}px`;
                canvasEl.style.height = `${canvasHeight}px`;
                drawCanvasAnimation();
            };
            var resultGameHandler = function (res){
                result_obj = JSON.parse(res.responseText);
                money += result_obj.bet*(Number(result_obj.won)*2-1);
                betInSlider = 1;
                betInGame = 1;
                sliderRange.setAttribute("max",money);
                drawCanvasAnimation();
            };
            buttonDeal.addEventListener("click",deal);
            buttonHit.addEventListener("click",hit);
            buttonStand.addEventListener("click",stand);
            buttonBet.addEventListener("click",bet);
            window.addEventListener("resize", resizeCanvas);
            sliderRange.oninput = function setValueInBet(){
                betInSlider = sliderRange.value;
                drawCanvasAnimation();
            };

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
                 if (images == 6){
                    drawCanvasAnimation();
                 };
            };
            const cardsImage = document.createElement("img");
            const tableImage = document.createElement('img');
            const imageGameScore = document.createElement("img");
            const balanceImage = document.createElement("img");
            const sliderButton = document.createElement("img");
            const sliderCashBase = document.createElement("img");
            cardsImage.src = "static/images/Small_Cards.png";
            tableImage.src ="static/images/table.jpg";
            imageGameScore.src = "static/images/resultBox.png";
            balanceImage.src ="static/images/balance.png";
            sliderButton.src="static/images/SliderBase.png";
            sliderCashBase.src="static/images/SliderCashBase.png";
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