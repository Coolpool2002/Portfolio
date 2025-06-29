import random

def game():
    i = random.randint(1, 10)
    print("guess the lucky number and win a prize")

    while True:
        guess = int(input())

        if guess < i:
            print("too low")
        elif guess > i:
            print("too high")
        else:
            print("you win")
            break

game()
