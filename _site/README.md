# Free to Engineer Portfolio Template 
Simple and modern portfolio template for engineers. Host your portfolio for free in as little as **15 minutes**!

## Getting Started:

### Setup GitHub Account
1. **Visit GitHub**: If you don't have an account, go to [GitHub](https://github.com/) and sign up.
2. **Create an Account**: Fill out the registration form with your preferred username, email, and password.
3. **Verify Your Email**: Check your email to verify your account.
### Fork the Template

1. **Navigate to FreeToEngineer Repository**: Go to the repository where this portfolio template is [hosted](https://github.com/leea12/freeToEngineer)
2. **Fork the template**: Click the "Use this template" button at the top right of the page. Then, choose create a new repository. This creates a copy under your GitHub account.

   ![GitHub Use Template](/assets/readme/github-use-template.png)

3. **[IMPORTANT] Name the repository**: in the "Repository name" field, type in `{your github id}.github.io`.This is also the url of your portfolio. You can use your custom domain as well. (change in the setting later)

   ![GitHub Use Template](/assets/readme/github-name-repository.png)
4. Click "Create repository"
5. **That's it!** Now, you have a portfolio webiste @ [your id].github.io

## Set up Your Portfolio
You only need to edit two files. 

### 1. Setup your page in `_config.yml`
This file contains the configuration settings for your site. Here's what you might want to change: 
After you are done. just click **"commit chages"** to apply. Give a minute or so for github to build your website.


- **Site Title**: Change the `title:` this is what shows up in the tab of the browser on your site
- **Name**: Change the `name:` your name will show up as seen above
- **Description**: Update the `description:` with a brief overview of your highlights and qualification
- **profile_image**: place your profile image in assets/profile folder and update the directory
- **Resume-url**: You can either link to externally stored pdf (ex. google drive) or save the pdf under assets/pdf/ folder and enter the directory  

![GitHub Use Template](/assets/readme/main-page.png)

- **External Links**: link your external accounts (linkedin, github, stackoverflow, medium, etc)
![GitHub Use Template](/assets/readme/external-link.png) 
Only the icons for the accounts that you enter will appear.
*Example*:
  ```yaml
    external-links:    # input only your own url slug. The icons with missing entries will not appear.
      linkedin: johndoe1       # https://www.linkedin.com/in/{your url slug} 
      github: johndoe1         # https://github.com/{your url slug} 
      stackoverflow: johndoe1  # https://stackoverflow.com/users/{your url slug}
  ```


- **Skills**: you can list your skills by category. It will  show up like below. Be careful with the identation.
![GitHub Use Template](/assets/readme/skills.png) 
  *Example*:
    ```yaml
      skills:
        - category: 3D Modeling
          tools:
          - Onshape
          - Solidworks
          - Creo
          - Fusion 360 
        
        - category: Prototyping
          tools:
          - SLA
          - CNC
          - FDM
          - SLS
          - DMLS
          - PolyJet Printing
          - Vacuum Casting
    ```
        

- **(optional)** you chan change your color theme by inputting color hex code for a few variables. Feel free to be creative!
  ```yaml
  colors: # this is the basic theme
    text: "##1a1c20"
    border: "#ddd"
    link: "#4a76ee"
    highlight: "#0c0cf2"
    background: "#ffffff"
    light_background: "#f3f5fb"
  ```
  There is a few suggested themes in `_config.yml`
  - **mint green**
  ![GitHub Use Template](/assets/readme/mint-green.png) 
  - **lemon**
  ![GitHub Use Template](/assets/readme/lemon.png) 
  - **cotton-candy**
  ![GitHub Use Template](/assets/readme/cotton-candy.png) 

### 2. [project name].markdown
For each project, you need to create a markdown file within _projects folder. I recommend created a folder for each project so that it is easy to organize image files that you may want to add. To get started, follow the below steps.

#### Creating a markdown file in Github
1. Go to **_project** folder. Make sure you are in the correct level.
![GitHub Use Template](/assets/readme/go-to-project-directory.png) 
2. In the right side of the screen, click add file - create new file
![GitHub Use Template](/assets/readme/create-new-file.png) 
3. in the available field, enter the name of the folder: **{your-project-name}** then hit "/". This will create a folder for the project 
![GitHub Use Template](/assets/readme/enter-folder-name.png) 
4. create a markdown file by entering index.md. 
![GitHub Use Template](/assets/readme/index-md.png) 
4. In the text field paste the below "front-matter" template and fill out the title, description, skills, and name of the main project image that you want to use. This is the summary of the project that will be used to display the project in the main page.

    ```md
      ---
      layout: post
      title: project title
      description:  short description of the project
      skills: 
        - skill 1
        - skill 2
      main-image: /project.webp 
      ---
    ```
5. then click **Submit changes** to create the file.
6. Upload your image in the same folder by clicking **Add file - upload files**.
![GitHub Use Template](/assets/readme/create-new-file.png) 
7. Drag your image file, then click **commit changes**. 
![GitHub Use Template](/assets/readme/upload-files.png) 
8. Allow a minute or so for the build. It will create a project section that looks like this below.
![GitHub Use Template](/assets/readme/project-section.png) 
9. If you want to add addtional details, you can go back to the index.md file and add more details below the front matter. It will be helpful if you become familiarized with markdown syntax. If you are interested in learning, see [markdown guide](https://www.markdownguide.org/cheat-sheet/).
10. I set up a couple styling to allow you to embed multiple images and video easily and become responsive for mobile view. See the demo project. You can also add code blocks, blockquote, and tables. 
