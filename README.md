# LeonioGroup_HRIS
 

# Local Installation Set-Up
<!-- 1. Clone the repository either by downloading the contents of the repository [here](), or using the command below (Note: git should be installed in your system for this to work).
```
git clone 
``` -->
2. Open Command Prompt
3. Navigate to the project folder - the folder containing the contents of the cloned or downloaded repository.
4. Run the command `npm install` to initialize and install all necessary modules used in the project.
5. To load the database, navigate to the /db_setup directory then run `.\mongorestore --uri mongodb://localhost:27017/`
    There will be 2 databases.
    1. hris-leonio-group-old : This is outdated, might cause more errors 
    2. hris-leonio-group : This is the latest and safer but incomplete.
6. Server runtime uses Nodemon. To run the server, we run the command `nodemon app`. Upon running the command, your Command Prompt should display the following statement: `Listening to port: 3000`
7. Go to http://localhost:3000/.


# Accessing Template (For Developers)
A template is used to jumpstart the development of the system. The templates can be accessed in the sidebar links or through `/templates/::templatename`. 

The reference template can be accessed on [BootStrap Themes](https://bootstrapthemes.co/item/target-free-responsive-bootstrap-admin-template/).


# Directories
```bash
├── assets
│   ├── css
│   │   ├── **/*.css
│   │   ├── custom-styles.css `to customize the template`
│   ├── font-awesome ` fa library/icons`
│   ├── fonts
│   ├── img `images`
│   ├── js ` javascripts`
│   │   ├── **/*.js
│   ├── materialize `library used in template`
│   └── plugins
├── controllers 
├── node_modules
├── routes
├── views   `views have subfolders. to use them include the subfolder. e.g. forms/PersonnelRequisitionForm`
│   ├── forms
│   ├── pages `pages`
│   ├── partials `consistent navbars, sidebars, head, footer`
│   ├── template `views for template only`
│   ├── **
├── README.md
├── package.json
├── index.js
├── .gitignore
└── .env
```


