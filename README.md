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
    database_name: symfony
    database_user: root
    database_password: null
    mailer_transport: smtp
    mailer_host: 127.0.0.1
    mailer_user: null
    mailer_password: null
    secret: 88833c3ff83625cca25b50f0754e6b032e126ee4
```
