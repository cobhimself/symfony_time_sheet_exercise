# Symfony Time Sheet Exercise

A simple Symfony time sheet exercise.

## Technologies Used

 - Symfony
 - Doctrine
 - Behat (and PHPUnit)
 - Composer
 - Bower
 - NodeJS
 - ReactJS (using Babel JS and ECMAScript 2015)
 - PHP 7
 - Twig
 - and more!

## Requirements

 - PHP 7
 - VirtualBox
 - Vagrant
 - NodeJs

## Get Started

This exercise is run on a Homestead Vagrant machine.
To get started, run the following:

```bash
composer install
```

	NOTE: Composer will ask for some parameter information, see the Parameters.yml section below.

After composer is done installing the dependencies, continue by running the following:

```bash
npm install
bower install
gulp
./node_modules/webpack/bin/webpack.js
vagrant up
```

	NOTE: In order to connect to the vagrant machine, make sure
	there is an entry within your `/etc/hosts` file for the
	IP address listed in `Homestead.yaml` (192.168.10.10)

### Parameters.yml

By default, `app/config/parameters.yml` is ignored in
Symfony projects. Being this is a practice repo, and security is not important,
the parameters are provided here:

```yaml
parameters:
    database_host: 127.0.0.1
    database_port: null
    database_name: php_exercise
    database_user: homestead
    database_password: secret
    mailer_transport: smtp
    mailer_host: 127.0.0.1
    mailer_user: null
    mailer_password: null
    secret: 88833c3ff83625cca25b50f0754e6b032e126ee4
```

### Create the database

Within the project folder, run `vagrant ssh` to ssh into the vagrant machine.

Once you are at the command prompt for the vagrant machine, run the following
to create the database:

```bash
cd ~/php-exercise
php bin/console doctrine:database:create
```

	NOTE: Normally you would want to modify the mysql database collation and
	character set to use utf8mb4 by default but, because this is just a
	practice exercise, you can skip this part if you want. See
	https://symfony.com/doc/current/doctrine.html for more details.

### Create Database Schema

To create the schema for the database, run the following in the php-exercise
folder on your vagrant machine:

```bash
./bin/console doctrine:migration:migrate -n
```

### Load Fixture Data (Optional)

If you would like to add fake data to the database, run the following
within the project directory on the vagrant machine:

```bash
./bin/console doctrine:fixtures:load -n
```

	NOTE: This will flush all the data in your database.

### Run Behat Tests

If you would like to run the behat tests for the application, run the
following from within the project directory on the vagrant machine:

```bash
./vendor/bin/behat
```
### Launch!

Open http://homestead.app in your browser and you should see the
practice application.

## To Do

A couple of things were skimped on in order to get this project up and
running quickly. Therefore, this practice symfony project has some room
to grow. Here are a couple of things that could make it better!

 - Core tests could be written for each of the entity classes. Right now
   there are only tests for the API.
 - User input validation does not happen on front-end or back-end.
 - Webpack is used for scripts and gulp is used for styles. It'd be good
   to use webpack for both.
 - after.sh is not idempotent
 - The interface could be prettier.
 - The API could utilize PUT in addition to POST but POST works for now.
 - Only one Time Sheet is editable. The interface could allow for
   new Time Sheets to be created.

