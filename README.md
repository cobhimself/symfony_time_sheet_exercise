# php_exercise

A simple Symfony exercise.

## Get Started

This exercise is run on a Homestead Vagrant machine.
To get started, run the following:

```bash
composer install
npm install
bower install
gulp
vagrant up
```

In order to connect to the vagrant machine, make sure
there is an entry within your `/etc/hosts` file for the
IP address listed in `Homestead.yaml`

### Parameters.yml

By default, `app/config/parameters.yml` is ignored in
Symfony projects. Being this is a practice repo,
the following should be placed in your parameters.yml file:

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
	
### Load Fixture Data (Optional)

If you would like to add fake data to the database, run the following
within the project directory on the vagrant machine:

```bash
./bin/console doctrine:fixtures:load -n
```

	NOTE: This will flush all the data in your database.
