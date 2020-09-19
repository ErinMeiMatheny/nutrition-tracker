# nutrition-tracker

-The Nutrition Tracker app,is an online system.Allowing users to log food intake, to help reach dietary goals!
-Users can post and delete meals, and get information on macros (calories,fat,etc.).
-This application was created using, ejs,sql, and js.
-Authentication is achieved via connect-flash and pbkdf2 - encryption.
-Macro data for logged foods is pulled from the Edamam API.
-Nutritition Tracker is a CRUD application, allowing users to not only post and delete meals, but also update user information.

The user is able to register throught the landing page which redirects them to the login page if successful. Emails are used as a unique identifier and cannot be duplicated for registration. Once logged in the user is redirected to ther users page. On this page user data (age, name, gender, weight etc) are displayed as well as user macros. It is also through this page that users can search for foods/nutritional information. The Log Button sends nutrition information to the online database hosted through ElephantSQL. The food is also then appeneded to the users intake log where foods logged can also be deleted. Unfortunately due to the connection limitations of the free ElephantSQL service, displaying macros are triggered via buttons (calories, carbs, protein, fats). Once clicked user macros are displayed. If a food is logged or deleted and the user clicks macro buttons again, updated info is displayed. User can also update their personal information from the users page.

****Future Updates
-Additional user interaction (friends,stat sharing,photos)
-Detailed tracking (timestamped macros,daily intake goal)
-Food search images
-Prompts for additional user info (if missing)


Creators
Erin Matheny
Bryan Urias
Brandon Hill
Ernesto Carrillo Guerrero


