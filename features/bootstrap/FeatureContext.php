<?php

use Behat\Behat\Context\Context;
use Behat\Gherkin\Node\PyStringNode;
use Behat\Gherkin\Node\TableNode;
use Behat\MinkExtension\Context\MinkContext;
use Behat\Symfony2Extension\Context\KernelDictionary;
use Doctrine\Common\DataFixtures\Executor\ORMExecutor;
use Doctrine\Common\DataFixtures\Purger\ORMPurger;
use Doctrine\Common\Util\Inflector;
use PHPUnit\Framework\Assert;
use Symfony\Bridge\Doctrine\DataFixtures\ContainerAwareLoader;
use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\HttpKernel\KernelInterface;

/**
 * Defines application features from the specific context.
 */
class FeatureContext extends MinkContext implements Context {
    /**
     * This gives us access to the Symfony container.
     */
    use KernelDictionary;

    private $jsonData;
    private $postData;

    /**
     * Initializes context.
     *
     * Every scenario gets its own context instance.
     * You can also pass arbitrary arguments to the
     * context constructor through behat.yml.
     */
    public function __construct() {
    }

    /**
     * Load our fixtures.
     * @BeforeScenario @fixtures
     */
    public function loadFixtures() {
        //Load our data fixtures
        $loader = new ContainerAwareLoader($this->getContainer());
        $loader->loadFromDirectory(__DIR__ . '/../../src/AppBundle/DataFixtures/');

        //Purge the database.
        $purger = new ORMPurger($this->getEntityManager());
        $purger->setPurgeMode(ORMPurger::PURGE_MODE_TRUNCATE);

        //Execute them!
        $executor = new ORMExecutor($this->getEntityManager(), $purger);
        $this->setForeignKeyChecks(0);
        $executor->execute($loader->getFixtures());
        $this->setForeignKeyChecks(1);
    }

    private function setForeignKeyChecks($val) {
        /**
         * @type \Doctrine\DBAL\Connection
         */
        $dbConn = $this->getContainer()->get('doctrine')->getConnection();
        $dbConn->exec('SET FOREIGN_KEY_CHECKS=' . $val);
    }

    /**
     * @return \Doctrine\Common\Persistence\ObjectManager
     */
    private function getEntityManager() {
        return $this->getContainer()->get('doctrine')->getManager();
    }

    /**
     * @Given /^I request "(GET|PUT|POST|DELETE) ([^"]*)"$/
     * @param $method
     * @param $uri
     * @throws Exception
     */
    public function iRequest($method, $uri) {
//        $driver = new GoutteDriver();
//        $request = $driver->getClient()->request($parts[0], $parts[1]);
        $data = array();
        if ($method === 'POST') {
            if (!$this->postData) {
                throw new Exception('Cannot send post data when it is not set!');
            }
            $data = $this->postData;
        }

        $this->getSession()
            ->getDriver()
            ->getClient()
            ->request($method, $uri, $data);
//        $this->getSession()->visit($uri);
    }

    private function camelize($string) {
        return Inflector::camelize($string);
    }

    /**
     * @Given I have the following data:
     * @param TableNode $table
     */
    public function iHaveTheFollowingData(TableNode $table)
    {
        $this->postData = $table->getHash();
    }

    /**
     * @Then a(n) :prop property should exist
     * @param $prop
     */
    public function aPropertyShouldExist($prop) {
        $data = $this->getObjectFromJson();
        Assert::assertObjectHasAttribute(
            $this->camelize($prop),
            $data,
            'The ' . $prop . ' property does not exist!'
        );
    }

    /**
     * @Then the :key property should equal :value
     * @param $key
     * @param $value
     */
    public function thePropertyShouldEqual($key, $value) {
        $data = $this->getObjectFromJson();
        Assert::assertEquals($value, $data->$key);
    }

    public function getObjectFromJson() {
        if (!$this->jsonData) {
            $this->jsonData = json_decode($this->getSession()->getDriver()->getContent());
        }

        return $this->jsonData;
    }

    /**
     * Sets Kernel instance.
     *
     * @param KernelInterface $kernel
     * @return Kernel
     */
    public function setKernel(KernelInterface $kernel) {
        return $this->kernel = $kernel;
    }

    /**
     * @Then the data should be empty
     */
    public function theDataShouldBeEmpty() {
        Assert::assertEmpty($this->getObjectFromJson(), 'The json data is not empty!');
    }

    /**
     * @Then I should have a list of data
     */
    public function iShouldHaveAListOfData() {
        $data = $this->getObjectFromJson();
        Assert::assertTrue(
            is_array($data),
            'The returned data is not an array.'
        );
    }

    /**
     * @Then the data should have values for the following:
     * @param PyStringNode $string
     */
    public function theDataShouldHaveValuesForTheFollowing(PyStringNode $string) {
        $data = $this->getObjectFromJson();
        foreach ($string as $key) {
            Assert::assertArrayHasKey(
                $this->camelize($key),
                $data,
                'The data does not contain a value for the key ' . $key
            );
        }
    }

    /**
     * @Then a :key property should equal:
     * @param $key
     * @param PyStringNode $string
     */
    public function aPropertyShouldEqual($key, PyStringNode $string) {
        $data = $this->getObjectFromJson();
        Assert::assertEquals($string->getLine(), $data[$key]);
    }

    /**
     * @Then a(n) :key property should equal :value
     * @param $key
     * @param $value
     */
    public function aPropertyShouldEqual2($key, $value) {
        $data = $this->getObjectFromJson();
        Assert::assertEquals(
            $value,
            $data[$key],
            'The ' . $key . ' property does not equal ' . $value . '!'
        );
    }
}
