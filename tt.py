
import random



class MyWindow(pyglet.window.Window):
    def __init__(self):
        super(MyWindow, self).__init__()
        self.button_stand = pyglet.image.load("button_stand.png")
        self.button_hit = pyglet.image.load("button_hit.png")
        self.button_new_game = pyglet.image.load("button_new_game.png")
        self.button_deal = pyglet.image.load("button_deal.png")
        self.table = pyglet.image.load("table.jpg").get_region(x=0,y = 0,width = 600,height = 300)

    def on_draw(self):
        window.clear()
        self.table.blit(30,105)
        if player_hand != "":
            cards  = player_hand.get_cards_in_hand()
            counter = 0
            for card in cards:
                card.get_image().blit(46+72*counter,124)
                counter+=1
        if bankir_hand != "":
            cards  = bankir_hand.get_cards_in_hand()
            counter = 0
            for card in cards:
                if counter == 0 and round_is_ongoing:
                    image_back_of_card.blit(46+72*counter,290)
                else:
                    card.get_image().blit(46+72*counter,290)
                counter+=1

        self.button_stand.blit(5,5)
        self.button_hit.blit(120,5)
        self.button_new_game.blit(350,5)
        self.button_deal.blit(235,5)
        self.label_player_wins = pyglet.text.Label("Player wins: " + str(player_wins),x =100,y = 450)
        self.label_player_wins.draw()
        self.label_comp_wins = pyglet.text.Label("Computer wins: " + str(computer_wins),x =300,y = 450)
        self.label_comp_wins.draw()
        if not round_is_ongoing and player_hand!= "":
            player_sum = str(player_hand.get_values_of_hand())
            self.label_player_hands_value = pyglet.text.Label(player_sum,font_name = "comic",
                                                              font_size = 45,
                                                              x =550
                                                              ,y = 25,color = (255,32,32,255)
                                                              )
            self.label_player_hands_value.draw()
            bankir_sum = str(bankir_hand.get_values_of_hand())
            self.label_bankir_hand_value = pyglet.text.Label(bankir_sum,font_name = "comic",
                                                              font_size = 44,
                                                              x =550
                                                              ,y = 420,color = (255,32,32,255)
                                                              )
            self.label_bankir_hand_value.draw()
        if winner != 0:
            if winner == 2:
                winner_text = "player"
            else:
                winner_text = "computer"
            self.rezult_of_game = pyglet.text.Label(winner_text+" wins this round!",font_name = "comic",
                                                              font_size = 35,
                                                              x =30
                                                              ,y = 240,color = (255,32,32,255)
                                                              )
            self.rezult_of_game.draw()
    def on_mouse_press(self,x,y,button,modifiers):
        if x>=5 and x<=115 and y>=5 and y<=55:
            stand()
        if x>=120 and x<=230 and y>=5 and y<=55:
            hit()
        if x>=235 and x<=345 and y>=5 and y<=55:
            deal()
        if x>=350 and x<=460 and y>=5 and y<=55:
            start_game()






