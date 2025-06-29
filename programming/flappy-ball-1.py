import tkinter as tk
from tkinter import messagebox
import hashlib
import uuid
import random
import os

# File to store user accounts and high scores
file_path = "accounts.txt"
high_score_file = "high_score.txt"

# Ensure the files exist
if not os.path.exists(file_path):
    open(file_path, 'w').close()

if not os.path.exists(high_score_file):
    open(high_score_file, 'w').close()

# Function to hash password with a salt using hashlib
def hash_password(password, salt=None):
    if salt is None:
        salt = uuid.uuid4().hex
    hash_object = hashlib.sha256((salt + password).encode())
    return hash_object.hexdigest(), salt

def login(username, password):
    try:
        with open(file_path, "r") as file:
            lines = file.readlines()
        for line in lines:
            stored_username, stored_hash, salt = line.strip().split(":")
            if username == stored_username:
                hashed_input_password, _ = hash_password(password, salt)
                return hashed_input_password == stored_hash
        return False
    except FileNotFoundError:
        return False

# Function to switch frames
def switch_frame(frame):
    frame.tkraise()

# Main App Class to manage all frames
class AccountManagementApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Account Management System")
        self.geometry("400x400")
        self.configure(bg="#2E2E2E")  # Dark background
        
        # Create different frames for different views
        self.main_menu_frame = MainMenu(self)
        self.create_account_frame = CreateAccount(self)
        self.login_frame = Login(self)
        self.admin_menu_frame = AdminMenu(self)

        # Position all frames in the same location
        for frame in (self.main_menu_frame, self.create_account_frame, self.login_frame, self.admin_menu_frame):
            frame.grid(row=0, column=0, sticky="nsew")

        # Start with the main menu
        switch_frame(self.main_menu_frame)

# Modern, minimalist button style
def create_button(parent, text, command):
    return tk.Button(
        parent, 
        text=text, 
        command=command, 
        font=("Helvetica", 12),
        bg="#3C3C3C", 
        fg="#F5F5F5", 
        activebackground="#575757", 
        activeforeground="#FFFFFF", 
        bd=0, 
        padx=10, 
        pady=10,
        relief="flat"
    )

class MainMenu(tk.Frame):
    def __init__(self, parent):
        tk.Frame.__init__(self, parent)
        self.configure(bg="#2E2E2E")

        tk.Label(self, text="Account Management", font=("Helvetica", 18), bg="#2E2E2E", fg="#F5F5F5").pack(pady=20)

        create_button(self, "Create Account", lambda: switch_frame(parent.create_account_frame)).pack(pady=10)
        create_button(self, "Login", lambda: switch_frame(parent.login_frame)).pack(pady=10)
        create_button(self, "Exit", parent.quit).pack(pady=10)

class CreateAccount(tk.Frame):
    def __init__(self, parent):
        tk.Frame.__init__(self, parent)
        self.configure(bg="#2E2E2E")

        tk.Label(self, text="Create Account", font=("Helvetica", 18), bg="#2E2E2E", fg="#F5F5F5").grid(row=0, column=0, columnspan=2, pady=20)

        tk.Label(self, text="Username:", font=("Helvetica", 12), bg="#2E2E2E", fg="#D0D0D0").grid(row=1, column=0, padx=10, pady=5, sticky="e")
        self.username_entry = tk.Entry(self, font=("Helvetica", 12), bg="#3C3C3C", fg="#F5F5F5", insertbackground="#F5F5F5", bd=1)
        self.username_entry.grid(row=1, column=1, padx=10, pady=5)

        tk.Label(self, text="Password:", font=("Helvetica", 12), bg="#2E2E2E", fg="#D0D0D0").grid(row=2, column=0, padx=10, pady=5, sticky="e")
        self.password_entry = tk.Entry(self, font=("Helvetica", 12), bg="#3C3C3C", fg="#F5F5F5", show="*", insertbackground="#F5F5F5", bd=1)
        self.password_entry.grid(row=2, column=1, padx=10, pady=5)

        create_button(self, "Create Account", self.submit_account).grid(row=3, columnspan=2, pady=20)
        create_button(self, "Back", lambda: switch_frame(parent.main_menu_frame)).grid(row=4, columnspan=2)

    def submit_account(self):
        username = self.username_entry.get()
        password = self.password_entry.get()
        if username and password:
            hashed_password, salt = hash_password(password)
            with open(file_path, "a") as file:
                file.write(f"{username}:{hashed_password}:{salt}\n")
            messagebox.showinfo("Success", f"Account for {username} created.")
            self.username_entry.delete(0, tk.END)
            self.password_entry.delete(0, tk.END)
            switch_frame(self.master.main_menu_frame)
        else:
            messagebox.showwarning("Input Error", "Please provide both username and password.")

class Login(tk.Frame):
    def __init__(self, parent):
        tk.Frame.__init__(self, parent)
        self.configure(bg="#2E2E2E")

        tk.Label(self, text="Login", font=("Helvetica", 18), bg="#2E2E2E", fg="#F5F5F5").grid(row=0, column=0, columnspan=2, pady=20)

        tk.Label(self, text="Username:", font=("Helvetica", 12), bg="#2E2E2E", fg="#D0D0D0").grid(row=1, column=0, padx=10, pady=5, sticky="e")
        self.username_entry = tk.Entry(self, font=("Helvetica", 12), bg="#3C3C3C", fg="#F5F5F5", insertbackground="#F5F5F5", bd=1)
        self.username_entry.grid(row=1, column=1, padx=10, pady=5)

        tk.Label(self, text="Password:", font=("Helvetica", 12), bg="#2E2E2E", fg="#D0D0D0").grid(row=2, column=0, padx=10, pady=5, sticky="e")
        self.password_entry = tk.Entry(self, font=("Helvetica", 12), bg="#3C3C3C", fg="#F5F5F5", show="*", insertbackground="#F5F5F5", bd=1)
        self.password_entry.grid(row=2, column=1, padx=10, pady=5)

        create_button(self, "Login", lambda: self.submit_login(parent)).grid(row=3, columnspan=2, pady=20)
        create_button(self, "Back", lambda: switch_frame(parent.main_menu_frame)).grid(row=4, columnspan=2)

    def submit_login(self, parent):
        username = self.username_entry.get()
        password = self.password_entry.get()
        if login(username, password):
            messagebox.showinfo("Success", f"Welcome, {username}.")
            self.username_entry.delete(0, tk.END)
            self.password_entry.delete(0, tk.END)
            switch_frame(parent.admin_menu_frame)  # Switch to the admin menu on success
        else:
            messagebox.showerror("Login Failed", "Invalid username or password.")

class AdminMenu(tk.Frame):
    def __init__(self, parent):
        tk.Frame.__init__(self, parent)
        self.configure(bg="#2E2E2E")

        tk.Label(self, text="Admin Menu", font=("Helvetica", 18), bg="#2E2E2E", fg="#F5F5F5").pack(pady=20)

        create_button(self, "View Users", self.view_users).pack(pady=10)
        create_button(self, "Delete User", self.delete_user).pack(pady=10)
        create_button(self, "Play Flappy Bird", self.open_flappy_bird).pack(pady=10)
        create_button(self, "Log Out", lambda: switch_frame(parent.main_menu_frame)).pack(pady=10)
        create_button(self, "Credits", self.show_credits).pack(pady=10)  # Correctly added Credits button

    def show_credits(self):
        credits_message = (
            "gelosStation5\n"
            "Developed by hayden\n"
            "Special thanks to hayden.\n"
            "Version: 1.0\n"
        )
        messagebox.showinfo("Credits", credits_message)

    def open_flappy_bird(self):
        FlappyBirdGame(self)  # Launch the Flappy Bird game

    def view_users(self):
        try:
            with open(file_path, "r") as file:
                users = file.readlines()
            if users:
                users_list = "\n".join([f"{i+1}. {user.split(':')[0]}" for i, user in enumerate(users)])
                messagebox.showinfo("Users", users_list)
            else:
                messagebox.showinfo("Users", "No users found.")
        except FileNotFoundError:
            messagebox.showinfo("Error", "No users found.")

    def delete_user(self):
        try:
            with open(file_path, "r") as file:
                users = file.readlines()
            
            if users:
                delete_window = tk.Toplevel(self)
                delete_window.title("Delete User")
                delete_window.configure(bg="#2E2E2E")

                tk.Label(delete_window, text="Select a user to delete", font=("Helvetica", 12), bg="#2E2E2E", fg="#F5F5F5").pack(pady=10)
                
                user_listbox = tk.Listbox(delete_window, font=("Helvetica", 12), bg="#3C3C3C", fg="#F5F5F5", bd=0)
                for i, user in enumerate(users):
                    username, _, _ = user.split(":")
                    user_listbox.insert(tk.END, f"{i+1}. {username}")
                user_listbox.pack(pady=10)

                def confirm_delete():
                    selected_index = user_listbox.curselection()
                    if selected_index:
                        index = selected_index[0]
                        username_to_delete = users[index].split(":")[0]
                        
                        # Remove the user from the file
                        with open(file_path, "w") as file:
                            for i, user in enumerate(users):
                                if i != index:
                                    file.write(user)
                        
                        messagebox.showinfo("Success", f"User {username_to_delete} deleted.")
                        delete_window.destroy()
                    else:
                        messagebox.showwarning("Selection Error", "Please select a user to delete.")

                create_button(delete_window, "Delete", confirm_delete).pack(pady=10)
            else:
                messagebox.showinfo("No Users", "No users found to delete.")
        except FileNotFoundError:
            messagebox.showinfo("Error", "No users found.")

# FlappyBirdGame class with a simple game loop
class FlappyBirdGame(tk.Toplevel):
    def __init__(self, parent):
        super().__init__(parent)
        self.title("Flappy Bird Clone")
        self.geometry("400x600")

        # Create a canvas to display the game (no background image)
        self.canvas = tk.Canvas(self, width=400, height=600)
        self.canvas.pack(fill="both", expand=True)

        self.score = 0
        self.high_score = self.load_high_score()
        self.is_game_over = False

        # Add the bird (a yellow oval for simplicity)
        self.bird = self.canvas.create_oval(50, 250, 80, 280, fill="yellow")  # Yellow bird
        self.bird_y = 250
        self.bird_velocity = 0

        # Variables for obstacles (pipes)
        self.pipes = []
        self.pipe_speed = 5

        # Game variables
        self.gravity = 0.8
        self.flapping = False

        # Bind space bar to flap
        self.bind_all("<space>", self.flap)  # Use bind_all for global space binding

        # Display score and high score
        self.score_text = self.canvas.create_text(10, 10, anchor="nw", text=f"Score: {self.score}", font=("Helvetica", 16), fill="black")
        self.high_score_text = self.canvas.create_text(300, 10, anchor="nw", text=f"High Score: {self.high_score}", font=("Helvetica", 16), fill="black")

        # Add Exit button
        create_button(self, "Exit", self.exit_game).place(x=350, y=10)

        # Start the game loop
        self.spawn_pipe()
        self.game_loop()

    def load_high_score(self):
        try:
            with open(high_score_file, "r") as file:
                return int(file.read())
        except (FileNotFoundError, ValueError):
            return 0

    def save_high_score(self, score):
        with open(high_score_file, "w") as file:
            file.write(str(score))

    # Game loop
    def game_loop(self):
        if self.is_game_over:
            return

        # Apply gravity to the bird
        self.bird_velocity += self.gravity
        self.bird_y += self.bird_velocity
        self.canvas.coords(self.bird, 50, self.bird_y, 80, self.bird_y + 30)

        # Check if bird hit the ground or flew out of bounds
        if self.bird_y > 570 or self.bird_y < 0:
            self.game_over()

        # Move and check pipes
        for pipe in self.pipes[:]:
            pipe_top_coords = self.canvas.coords(pipe["top"])
            pipe_bottom_coords = self.canvas.coords(pipe["bottom"])

            if not pipe_top_coords or not pipe_bottom_coords:
                continue  # Skip this pipe if it has been deleted

            self.canvas.move(pipe["top"], -self.pipe_speed, 0)
            self.canvas.move(pipe["bottom"], -self.pipe_speed, 0)

            # Check if pipe passed bird and increase score
            pipe_x = pipe_top_coords[0]
            if pipe_x < 50 and not pipe["scored"]:
                self.score += 1
                self.canvas.itemconfigure(self.score_text, text=f"Score: {self.score}")
                pipe["scored"] = True

            # Remove pipes that move off-screen
            if pipe_x < -50:
                self.canvas.delete(pipe["top"])
                self.canvas.delete(pipe["bottom"])
                self.pipes.remove(pipe)

            # Check for collisions with pipes
            if self.check_collision(pipe):
                self.game_over()

        # Spawn new pipes periodically
        if len(self.pipes) == 0 or self.canvas.coords(self.pipes[-1]["top"])[0] < 200:
            self.spawn_pipe()

        # Continue the game loop
        self.after(30, self.game_loop)

    # Function for bird's flap (fly upwards)
    def flap(self, event):
        self.bird_velocity = -8  # Flap upward

    # Check for collision between bird and pipes
    def check_collision(self, pipe):
        bird_coords = self.canvas.coords(self.bird)
        top_pipe_coords = self.canvas.coords(pipe["top"])
        bottom_pipe_coords = self.canvas.coords(pipe["bottom"])

        if not bird_coords or not top_pipe_coords or not bottom_pipe_coords:
            return False  # Skip collision check if any of the objects do not exist

        # Check if bird is within the pipe range (collision)
        if bird_coords[2] > top_pipe_coords[0] and bird_coords[0] < top_pipe_coords[2]:
            if bird_coords[1] < top_pipe_coords[3] or bird_coords[3] > bottom_pipe_coords[1]:
                return True
        return False

    def spawn_pipe(self):
        gap_size = 150
        pipe_width = 50
        pipe_height = random.randint(100, 300)
        gap_position = pipe_height

        # Top pipe
        top_pipe = self.canvas.create_rectangle(400, 0, 400 + pipe_width, gap_position, fill="green")
        # Bottom pipe
        bottom_pipe = self.canvas.create_rectangle(400, gap_position + gap_size, 400 + pipe_width, 600, fill="green")

        # Add pipes to the list
        self.pipes.append({"top": top_pipe, "bottom": bottom_pipe, "scored": False})

    def game_over(self):
        self.is_game_over = True
        if self.score > self.high_score:
            self.high_score = self.score
            self.save_high_score(self.high_score)
            messagebox.showinfo("Game Over", f"New High Score: {self.high_score}")
        else:
            messagebox.showinfo("Game Over", f"Score: {self.score}")
        self.destroy()  # Close the game window

    def exit_game(self):
        self.destroy()

# To launch the application
if __name__ == "__main__":
    app = AccountManagementApp()
    app.mainloop()

