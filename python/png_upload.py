import numpy
from PIL import Image
import pygame
from game_board import GameBoard
import argparse

def view_img(image=""):
    pygame.init()

    game_board = GameBoard()

    running = True
    clock = pygame.time.Clock()
    pause = True

    image = Image.open('img/' + image + ".png")

    new_size = 400
    resized_image = image.resize((new_size, new_size))

    gray_image = resized_image.convert('L')

    data = numpy.asarray(gray_image)
    threshold = 100

    binary_array = (data > threshold).astype(int)

    game_board.tiles = binary_array

    while running:
        clock.tick(30)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_x:
                    game_board.reset()

                elif event.key == pygame.K_SPACE:
                    pause = not pause
                    print(pause)
                elif event.key == pygame.K_r:
                    pause = True
                    print(pause)
                    game_board.tiles = binary_array

            if pause:
                if event.type == pygame.MOUSEBUTTONDOWN:
                    if event.button == 1:
                        game_board.paint_tile(*event.pos)
                    elif event.button == 3:
                        game_board.remove_tile(*event.pos)

        game_board.draw_window(pause)

    pygame.quit()

if __name__ == "__main__":
    parser = argparse.ArgumentParser("images")
    parser.add_argument("image", help="which image to pick from the directory")
    args = parser.parse_args()
    view_img(args.image)



