# Simple Meal Tracker

Simple Meal Tracker is a program where you can keep track of your food consumption anytime you feel like it.

## Usage

## DATABASE

Postgres was used for this project. Each row has 5 columns, here are the details:
id : references the item's PRIMARY KEY in DB ( Used for querying )

type: references the Time of day (eg, breakfast, lunch, dinner, supper)

description: references the name of dish (eg, pizza, salad, bread ..)

amount_of_alcohol: references the amount (in numbers/integers) of alcohol consumed during the meal

was_hungry_before_meal: references how you felt before the meal. Hungry or not (takes in boolean (true/ false) )

```bash
node . report # returns all data listed in DB
node . report (arg) # returns data filtered by argument (arguments: breakfast, lunch, dinner, supper, was_hungry, not_hungry, alcohol, id)
node . add # starts a prompt for you to follow and insert new data into DB
node . edit-one (arg1)  (arg2) (arg3)  # arg1: enter in the id of the item in your DB to edit
                                # arg2: enter the column name you wish to edit
                                # arg3: enter the value you wish to update with

node . edit # starts a prompt for you to follow and edit an entire entry
```
